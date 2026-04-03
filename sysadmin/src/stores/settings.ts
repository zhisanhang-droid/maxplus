import { ref } from "vue";
import { defineStore } from "pinia";
import type {
  AdminBootstrapPayload,
  HomeContentState,
  SeoSettingsState,
  SiteSettingsState
} from "../types/admin";
import { apiPost } from "../services/http";
import { useSessionStore } from "./session";

export const useSettingsStore = defineStore("settings", () => {
  const siteSettings = ref<SiteSettingsState>({
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
      address: ""
    },
    socials: [],
    notifications: {
      inquiryRecipients: "",
      subscriberRecipients: "",
      enableEmailNotice: false,
      enableSlackNotice: false
    }
  });
  const homeContent = ref<HomeContentState>({
    heroSlides: [],
    highlights: [],
    featuredProductSlugs: [],
    featuredVideoSlugs: [],
    sectionToggles: []
  });
  const seoSettings = ref<SeoSettingsState>({
    globalTitle: "",
    globalDescription: "",
    ogImage: "",
    sitemapEnabled: false,
    robotsIndex: false,
    productTemplate: "",
    categoryTemplate: "",
    blogTemplate: ""
  });

  const hydrate = (payload: Pick<AdminBootstrapPayload, "siteSettings" | "homeContent" | "seoSettings">) => {
    siteSettings.value = payload.siteSettings;
    homeContent.value = payload.homeContent;
    seoSettings.value = payload.seoSettings;
  };

  const getToken = () => {
    const sessionStore = useSessionStore();

    if (!sessionStore.token) {
      throw new Error("未登录或登录已过期。");
    }

    return sessionStore.token;
  };

  const saveSiteSettings = async () => {
    siteSettings.value = await apiPost<SiteSettingsState>("/admin/site/save", siteSettings.value, {
      token: getToken(),
      secure: true
    });
  };

  const saveHomeContent = async () => {
    homeContent.value = await apiPost<HomeContentState>("/admin/home/save", homeContent.value, {
      token: getToken()
    });
  };

  const saveSeoSettings = async () => {
    seoSettings.value = await apiPost<SeoSettingsState>("/admin/seo/save", seoSettings.value, {
      token: getToken()
    });
  };

  return {
    siteSettings,
    homeContent,
    seoSettings,
    hydrate,
    saveSiteSettings,
    saveHomeContent,
    saveSeoSettings
  };
});
