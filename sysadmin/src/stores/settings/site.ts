import type {
  FooterSettings,
  MailerSettingsState,
  SiteSettingsState,
  SiteThemeState
} from "../../types/admin";

export function createDefaultSiteTheme(): SiteThemeState {
  return {
    preset: "default",
    effectsEnabled: true
  };
}

export function normalizeSiteTheme(value?: Partial<SiteThemeState> | null): SiteThemeState {
  const fallback = createDefaultSiteTheme();
  const source = value ?? {};

  return {
    preset: source.preset === "christmas" ? "christmas" : fallback.preset,
    effectsEnabled: source.effectsEnabled ?? fallback.effectsEnabled
  };
}

export function createDefaultMailerSettings(): MailerSettingsState {
  return {
    enabled: false,
    host: "",
    port: 587,
    secure: false,
    username: "",
    smtpPassword: "",
    hasPassword: false,
    clearPassword: false,
    fromEmail: "hello@maxplus-sport.com",
    fromName: "MaxPlus Sporting Goods",
    replyTo: "support@maxplus-sport.com",
    subjectTemplate: "Thanks for subscribing to {{brandName}}",
    htmlTemplate: "",
    textTemplate: ""
  };
}

export function normalizeMailerSettings(
  value?: Partial<MailerSettingsState> | null
): MailerSettingsState {
  const fallback = createDefaultMailerSettings();
  const source = value ?? {};

  return {
    enabled: source.enabled ?? fallback.enabled,
    host: source.host?.trim() || fallback.host,
    port:
      typeof source.port === "number" && source.port >= 1 && source.port <= 65535
        ? Math.round(source.port)
        : fallback.port,
    secure: source.secure ?? fallback.secure,
    username: source.username?.trim() || fallback.username,
    smtpPassword: source.smtpPassword || "",
    hasPassword: source.hasPassword ?? fallback.hasPassword,
    clearPassword: source.clearPassword ?? false,
    fromEmail: source.fromEmail?.trim() || fallback.fromEmail,
    fromName: source.fromName?.trim() || fallback.fromName,
    replyTo: source.replyTo?.trim() || fallback.replyTo,
    subjectTemplate: source.subjectTemplate?.trim() || fallback.subjectTemplate,
    htmlTemplate: source.htmlTemplate || fallback.htmlTemplate,
    textTemplate: source.textTemplate || fallback.textTemplate
  };
}

export function createDefaultFooterSettings(): FooterSettings {
  return { text: "", meta1: "", meta2: "", maxWidth: 813, paddingY: 16, contactPaddingBottom: 48 };
}

export function normalizeFooterSettings(value?: Partial<FooterSettings> | null): FooterSettings {
  const fallback = createDefaultFooterSettings();
  const source = value ?? {};
  const rawWidth = Number(source.maxWidth);
  const rawPaddingY = Number(source.paddingY);
  const rawContactPb = Number(source.contactPaddingBottom);
  return {
    text: source.text?.trim() ?? fallback.text,
    meta1: source.meta1?.trim() ?? fallback.meta1,
    meta2: source.meta2?.trim() ?? fallback.meta2,
    maxWidth: rawWidth >= 400 && rawWidth <= 1220 ? rawWidth : fallback.maxWidth,
    paddingY: rawPaddingY >= 4 && rawPaddingY <= 60 ? rawPaddingY : fallback.paddingY,
    contactPaddingBottom: rawContactPb >= 0 && rawContactPb <= 120 ? rawContactPb : fallback.contactPaddingBottom
  };
}

export function createDefaultSiteSettings(): SiteSettingsState {
  return {
    brand: {
      brandName: "",
      siteTitle: "",
      siteDescription: "",
      supportEmail: "",
      salesEmail: "",
      phone: "",
      whatsapp: "",
      defaultLanguage: "",
      defaultCurrency: "",
      timezone: "",
      address: "",
      defaultBuyLabel: "Go To Buy",
      defaultBuyUrl: ""
    },
    socials: [],
    notifications: {
      inquiryRecipients: "",
      subscriberRecipients: "",
      enableEmailNotice: false,
      enableSlackNotice: false
    },
    theme: createDefaultSiteTheme(),
    mailer: createDefaultMailerSettings(),
    footer: createDefaultFooterSettings()
  };
}

export function normalizeSiteSettings(
  value?: Partial<SiteSettingsState> | null
): SiteSettingsState {
  const fallback = createDefaultSiteSettings();
  const source = value ?? {};

  return {
    brand: {
      ...fallback.brand,
      ...(source.brand ?? {})
    },
    socials: Array.isArray(source.socials)
      ? source.socials.map((item) => ({
          name: item?.name || "",
          url: item?.url || ""
        }))
      : fallback.socials,
    notifications: {
      ...fallback.notifications,
      ...(source.notifications ?? {})
    },
    theme: normalizeSiteTheme(source.theme),
    mailer: normalizeMailerSettings(source.mailer),
    footer: normalizeFooterSettings(source.footer)
  };
}
