import { API_BASE_URL } from "./config";
import { buildSecureEnvelope } from "./security";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  errorCode?: string | null;
  details?: unknown;
  data: T;
}

interface PostOptions {
  secure?: boolean;
}

export async function apiPost<T>(
  path: string,
  payload: unknown,
  options: PostOptions = {}
): Promise<T> {
  try {
    const body = options.secure ? { envelope: await buildSecureEnvelope(payload) } : payload ?? {};
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    const contentType = response.headers.get("content-type") || "";
    const result = contentType.includes("application/json")
      ? ((await response.json()) as ApiResponse<T>)
      : ({
          success: response.ok,
          message: await response.text(),
          data: null as T
        } satisfies ApiResponse<T>);

    if (!response.ok || !result.success) {
      if (result.errorCode === "CORS_NOT_ALLOWED") {
        throw new Error(`${result.message} This origin is not currently allowed by the backend.`);
      }

      throw new Error(result.message || "Request failed.");
    }

    return result.data;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Network request failed. Possible reasons: backend not started, wrong API URL, blocked port, or browser CORS interception."
      );
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unknown request error.");
  }
}
