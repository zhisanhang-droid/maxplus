import { API_BASE_URL } from "./config";

interface PublicKeyPayload {
  publicKeyPem: string;
  keyId: string;
}

interface SecureEnvelope {
  encryptedKey: string;
  iv: string;
  ciphertext: string;
  tag: string;
}

let publicKeyCache: Promise<CryptoKey> | null = null;

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const base64 = pem
    .replace("-----BEGIN PUBLIC KEY-----", "")
    .replace("-----END PUBLIC KEY-----", "")
    .replace(/\s+/g, "");
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes.buffer;
}

function toBase64(bytes: ArrayBuffer | Uint8Array): string {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";

  view.forEach((item) => {
    binary += String.fromCharCode(item);
  });

  return window.btoa(binary);
}

async function fetchPublicKey(): Promise<PublicKeyPayload> {
  const response = await fetch(`${API_BASE_URL}/security/public-key`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({})
  });

  const result = (await response.json()) as {
    success: boolean;
    message: string;
    data: PublicKeyPayload;
  };

  if (!response.ok || !result.success) {
    throw new Error(result.message || "无法获取加密公钥。");
  }

  return result.data;
}

async function getPublicCryptoKey(): Promise<CryptoKey> {
  if (!publicKeyCache) {
    publicKeyCache = fetchPublicKey().then((payload) =>
      window.crypto.subtle.importKey(
        "spki",
        pemToArrayBuffer(payload.publicKeyPem),
        {
          name: "RSA-OAEP",
          hash: "SHA-256"
        },
        false,
        ["encrypt"]
      )
    );
  }

  return publicKeyCache;
}

export async function buildSecureEnvelope(payload: unknown): Promise<SecureEnvelope> {
  const publicKey = await getPublicCryptoKey();
  const aesKey = await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256
    },
    true,
    ["encrypt"]
  );
  const rawAesKey = await window.crypto.subtle.exportKey("raw", aesKey);
  const encryptedKey = await window.crypto.subtle.encrypt(
    {
      name: "RSA-OAEP"
    },
    publicKey,
    rawAesKey
  );

  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const plaintext = new TextEncoder().encode(JSON.stringify(payload));
  const encryptedBuffer = new Uint8Array(
    await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv
      },
      aesKey,
      plaintext
    )
  );

  const tag = encryptedBuffer.slice(encryptedBuffer.length - 16);
  const ciphertext = encryptedBuffer.slice(0, encryptedBuffer.length - 16);

  return {
    encryptedKey: toBase64(encryptedKey),
    iv: toBase64(iv),
    ciphertext: toBase64(ciphertext),
    tag: toBase64(tag)
  };
}
