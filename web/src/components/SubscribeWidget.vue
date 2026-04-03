<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { apiPost } from "../services/http";
import type { SubscribeContent } from "../types/content";

interface SubscribeFormState {
  email: string;
  orderNumber: string;
}

const props = defineProps<{
  subscribe: SubscribeContent;
}>();

const isOpen = ref(false);
const isSubmitting = ref(false);
const status = ref("");
const form = reactive<SubscribeFormState>({
  email: "",
  orderNumber: ""
});

const reset = () => {
  form.email = "";
  form.orderNumber = "";
};

const togglePanel = (): void => {
  isOpen.value = !isOpen.value;
};

const closePanel = (): void => {
  isOpen.value = false;
};

const submit = async () => {
  status.value = "";
  isSubmitting.value = true;

  try {
    await apiPost(
      "/public/subscribe",
      {
        email: form.email,
        orderNumber: form.orderNumber,
        source: "Website Subscribe Widget"
      },
      {
        secure: true
      }
    );
    status.value = "Subscription received. Thank you.";
    reset();
  } catch (error) {
    status.value = error instanceof Error ? error.message : "Unable to subscribe right now.";
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  if (!window.matchMedia("(max-width: 820px)").matches) {
    return;
  }

  try {
    const storageKey = "maxplus-mobile-subscribe-shown";

    if (window.sessionStorage.getItem(storageKey)) {
      return;
    }

    isOpen.value = true;
    window.sessionStorage.setItem(storageKey, "1");
  } catch {
    isOpen.value = true;
  }
});
</script>

<template>
  <div :class="['subscribe-widget', { 'is-open': isOpen }]" id="newsletter-sporting">
    <button
      v-if="isOpen"
      class="subscribe-widget__backdrop"
      type="button"
      aria-label="Close subscribe dialog"
      @click="closePanel"
    ></button>

    <button
      class="subscribe-widget__toggle"
      type="button"
      :aria-expanded="isOpen"
      aria-controls="subscribe-panel-sporting"
      @click="togglePanel"
    >
      {{ subscribe.toggleLabel }}
    </button>

    <div class="subscribe-widget__panel" id="subscribe-panel-sporting">
      <button
        class="subscribe-widget__close"
        type="button"
        aria-label="Close subscribe dialog"
        @click="closePanel"
      >
        ×
      </button>

      <div class="subscribe-widget__dialog">
        <div class="subscribe-widget__benefit-copy">
          <p class="eyebrow">{{ subscribe.eyebrow }}</p>
          <h3 class="subscribe-widget__title">{{ subscribe.title }}</h3>
          <p class="subscribe-widget__benefits-title">{{ subscribe.benefitsTitle }}</p>

          <ul class="subscribe-widget__benefits">
            <li v-for="benefit in subscribe.benefits" :key="benefit">
              {{ benefit }}
            </li>
          </ul>
        </div>

        <form class="subscribe-form" @submit.prevent="submit">
          <label class="sr-only" for="subscribe-email-sporting">
            {{ subscribe.emailLabel }}
          </label>

          <input
            id="subscribe-email-sporting"
            v-model="form.email"
            type="email"
            name="email"
            :placeholder="subscribe.emailPlaceholder"
            required
          />

          <label class="sr-only" for="subscribe-order-sporting">
            {{ subscribe.orderLabel }}
          </label>

          <input
            id="subscribe-order-sporting"
            v-model="form.orderNumber"
            type="text"
            name="orderNumber"
            :placeholder="subscribe.orderPlaceholder"
            required
          />

          <button class="button button--primary" type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? "Submitting..." : subscribe.buttonLabel }}
          </button>

          <p class="form-status" aria-live="polite">{{ status }}</p>
        </form>
      </div>
    </div>
  </div>
</template>
