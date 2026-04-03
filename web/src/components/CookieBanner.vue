<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

interface CookiePreferences {
  essential: true;
  analytics: boolean;
  marketing: boolean;
}

const STORAGE_KEY = "maxplus-cookie-preferences";

const isBannerVisible = ref(false);
const isPreferencesOpen = ref(false);
const preferences = ref<CookiePreferences>({
  essential: true,
  analytics: false,
  marketing: false
});

const preferenceSummary = computed(() => {
  if (preferences.value.analytics && preferences.value.marketing) {
    return "Analytics + Marketing";
  }

  if (preferences.value.analytics) {
    return "Analytics";
  }

  if (preferences.value.marketing) {
    return "Marketing";
  }

  return "Essential only";
});

const savePreferences = () => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences.value));
  isBannerVisible.value = false;
  isPreferencesOpen.value = false;
};

const acceptAll = () => {
  preferences.value = {
    essential: true,
    analytics: true,
    marketing: true
  };
  savePreferences();
};

const openPreferences = () => {
  isPreferencesOpen.value = true;
};

const closePreferences = () => {
  isPreferencesOpen.value = false;
};

onMounted(() => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      isBannerVisible.value = true;
      return;
    }

    preferences.value = {
      ...preferences.value,
      ...JSON.parse(stored)
    };
  } catch {
    isBannerVisible.value = true;
  }
});
</script>

<template>
  <div class="cookie-layer">
    <div v-if="isBannerVisible" class="cookie-banner reveal is-visible">
      <div>
        <p class="eyebrow">Cookie Notice</p>
        <h3>We use cookies for site performance and lead experience.</h3>
        <p>Current preference: {{ preferenceSummary }}</p>
      </div>

      <div class="cookie-banner__actions">
        <button class="button button--ghost cookie-button" type="button" @click="openPreferences">
          Preferences
        </button>
        <button class="button button--primary" type="button" @click="acceptAll">
          Accept All
        </button>
      </div>
    </div>

    <div v-if="isPreferencesOpen" class="cookie-modal">
      <button class="cookie-modal__backdrop" type="button" aria-label="Close cookie preferences" @click="closePreferences"></button>

      <div class="cookie-modal__panel reveal is-visible">
        <button class="cookie-modal__close" type="button" aria-label="Close cookie preferences" @click="closePreferences">
          ×
        </button>

        <p class="eyebrow">Cookie Preferences</p>
        <h3>Choose how the site remembers your visit.</h3>

        <div class="cookie-option">
          <div>
            <strong>Essential</strong>
            <p>Required for basic site behavior and consent storage.</p>
          </div>
          <span class="cookie-option__fixed">Always On</span>
        </div>

        <label class="cookie-option">
          <div>
            <strong>Analytics</strong>
            <p>Helps measure page performance and content interest.</p>
          </div>
          <input v-model="preferences.analytics" type="checkbox" />
        </label>

        <label class="cookie-option">
          <div>
            <strong>Marketing</strong>
            <p>Used for future campaign personalization and subscriber follow-up.</p>
          </div>
          <input v-model="preferences.marketing" type="checkbox" />
        </label>

        <div class="cookie-modal__actions">
          <button class="button button--ghost cookie-button" type="button" @click="closePreferences">
            Cancel
          </button>
          <button class="button button--primary" type="button" @click="savePreferences">
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
