<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import { apiPost } from "../services/http";
import SubscribeClassicButton from "./SubscribeClassicButton.vue";
import SubscribeGiftButton from "./SubscribeGiftButton.vue";
import type { SubscribeContent } from "../types/content";

const props = defineProps<{
  subscribe: SubscribeContent;
}>();

const isOpen = ref(false);
const isSubmitting = ref(false);
const status = ref("");
const formValues = reactive<Record<string, string>>({});

const widgetRef = ref<HTMLDivElement | null>(null);
const isDraggingWidget = ref(false);
const dragStyle = ref<Record<string, string>>({});
let dragStart = { mouseX: 0, mouseY: 0, elX: 0, elY: 0 };
let hasDragMoved = false;

const moveDrag = (event: MouseEvent | TouchEvent) => {
  const clientX = "touches" in event ? event.touches[0].clientX : event.clientX;
  const clientY = "touches" in event ? event.touches[0].clientY : event.clientY;
  const dx = clientX - dragStart.mouseX;
  const dy = clientY - dragStart.mouseY;

  if (!hasDragMoved && Math.abs(dx) < 5 && Math.abs(dy) < 5) {
    return;
  }

  hasDragMoved = true;
  isDraggingWidget.value = true;
  event.preventDefault();

  const el = widgetRef.value;
  let x = dragStart.elX + dx;
  let y = dragStart.elY + dy;

  if (el) {
    x = Math.max(0, Math.min(window.innerWidth - el.offsetWidth, x));
    y = Math.max(0, Math.min(window.innerHeight - el.offsetHeight, y));
  }

  dragStyle.value = { left: `${x}px`, top: `${y}px`, right: "auto", bottom: "auto" };
};

const endDrag = () => {
  isDraggingWidget.value = false;
  document.removeEventListener("mousemove", moveDrag);
  document.removeEventListener("mouseup", endDrag);
  document.removeEventListener("touchmove", moveDrag);
  document.removeEventListener("touchend", endDrag);
};

const startDrag = (event: MouseEvent | TouchEvent) => {
  if (isOpen.value) {
    return;
  }

  const el = widgetRef.value;

  if (!el) {
    return;
  }

  const clientX = "touches" in event ? event.touches[0].clientX : event.clientX;
  const clientY = "touches" in event ? event.touches[0].clientY : event.clientY;
  const rect = el.getBoundingClientRect();

  dragStart = { mouseX: clientX, mouseY: clientY, elX: rect.left, elY: rect.top };
  hasDragMoved = false;

  document.addEventListener("mousemove", moveDrag);
  document.addEventListener("mouseup", endDrag);
  document.addEventListener("touchmove", moveDrag, { passive: false });
  document.addEventListener("touchend", endDrag);
};

const suppressClickIfDragged = (event: MouseEvent) => {
  if (hasDragMoved) {
    event.stopPropagation();
    hasDragMoved = false;
  }
};

const enabledFields = computed(() =>
  props.subscribe.formFields.filter((field) => field.enabled)
);

const reset = () => {
  enabledFields.value.forEach((field) => {
    formValues[field.key] = "";
  });
};

const panelId = "subscribe-panel-sporting";
const isClassicButton = computed(() => props.subscribe.stylePreset === "classic-button");
const giftStylePreset = computed(() =>
  props.subscribe.stylePreset === "classic-button" ? "classic-gift" : props.subscribe.stylePreset
);

const openPanel = (): void => {
  status.value = "";
  isOpen.value = true;
};

const closePanel = (): void => {
  isOpen.value = false;
};

const syncFormState = () => {
  const activeKeys = new Set(enabledFields.value.map((field) => field.key));

  Object.keys(formValues).forEach((key) => {
    if (!activeKeys.has(key)) {
      delete formValues[key];
    }
  });

  enabledFields.value.forEach((field) => {
    if (!(field.key in formValues)) {
      formValues[field.key] = "";
    }
  });
};

const resolveInputType = (type: string) => {
  if (type === "email" || type === "tel") {
    return type;
  }

  return "text";
};

const submit = async () => {
  status.value = "";
  isSubmitting.value = true;

  try {
    await apiPost(
      "/public/subscribe",
      {
        source: props.subscribe.sourceLabel,
        formFields: enabledFields.value.map((field) => ({
          key: field.key,
          label: field.label,
          value: formValues[field.key] || "",
          type: field.type
        }))
      },
      {
        secure: true
      }
    );
    status.value = props.subscribe.successMessage;
    reset();
  } catch (error) {
    status.value = error instanceof Error ? error.message : "Unable to subscribe right now.";
  } finally {
    isSubmitting.value = false;
  }
};

watch(enabledFields, syncFormState, {
  deep: true,
  immediate: true
});

onBeforeUnmount(() => {
  endDrag();
});

onMounted(() => {
  syncFormState();

  if (!props.subscribe.enabled) {
    return;
  }

  if (!window.matchMedia("(max-width: 820px)").matches) {
    return;
  }

  try {
    const storageKey = "maxplus-mobile-subscribe-shown";

    if (window.sessionStorage.getItem(storageKey)) {
      return;
    }

    openPanel();
    window.sessionStorage.setItem(storageKey, "1");
  } catch {
    openPanel();
  }
});
</script>

<template>
  <div
    v-if="subscribe.enabled"
    ref="widgetRef"
    :class="[
      'subscribe-widget',
      `subscribe-widget--${subscribe.stylePreset}`,
      { 'is-open': isOpen, 'is-dragging': isDraggingWidget }
    ]"
    :style="{ ...dragStyle, '--subscribe-idle-opacity': subscribe.buttonOpacity ?? 0.72 }"
    id="newsletter-sporting"
  >
    <SubscribeClassicButton
      v-if="isClassicButton"
      :controls-id="panelId"
      :label="subscribe.toggleLabel"
      :open="isOpen"
      @open="openPanel"
      @close="closePanel"
    />

    <div
      v-else-if="subscribe.buttonImage"
      class="subscribe-gift-drag-handle"
      @mousedown="startDrag"
      @touchstart.passive="startDrag"
      @click.capture="suppressClickIfDragged"
    >
      <button
        type="button"
        class="subscribe-image-button"
        :aria-controls="panelId"
        :aria-expanded="isOpen"
        :aria-label="isOpen ? 'Close subscribe dialog' : subscribe.toggleLabel"
        @click="isOpen ? closePanel() : openPanel()"
      >
        <img class="subscribe-image-button__img" :src="subscribe.buttonImage" :alt="subscribe.toggleLabel" />
        <span class="subscribe-image-button__hint">{{ subscribe.toggleLabel }}</span>
      </button>
    </div>

    <div
      v-else
      class="subscribe-gift-drag-handle"
      @mousedown="startDrag"
      @touchstart.passive="startDrag"
      @click.capture="suppressClickIfDragged"
    >
      <SubscribeGiftButton
        :controls-id="panelId"
        :label="subscribe.toggleLabel"
        :open="isOpen"
        :style-preset="giftStylePreset"
        @open="openPanel"
        @close="closePanel"
      />
    </div>

    <button
      v-if="isOpen"
      class="subscribe-widget__backdrop"
      type="button"
      aria-label="Close subscribe dialog"
      @click="closePanel"
    ></button>

    <div class="subscribe-widget__panel" :id="panelId">
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
          <p v-if="subscribe.text" class="subscribe-widget__text">{{ subscribe.text }}</p>
          <p class="subscribe-widget__benefits-title">{{ subscribe.benefitsTitle }}</p>

          <ul class="subscribe-widget__benefits">
            <li v-for="benefit in subscribe.benefits" :key="benefit">
              {{ benefit }}
            </li>
          </ul>
        </div>

        <form class="subscribe-form" @submit.prevent="submit">
          <template v-for="field in enabledFields" :key="field.id">
            <label class="sr-only" :for="field.id">
              {{ field.label }}
            </label>

            <select
              v-if="field.type === 'select'"
              :id="field.id"
              v-model="formValues[field.key]"
              :name="field.key"
              :required="field.required"
            >
              <option value="">
                {{ field.placeholder || field.label }}
              </option>
              <option v-for="option in field.options" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>

            <textarea
              v-else-if="field.type === 'textarea'"
              :id="field.id"
              v-model="formValues[field.key]"
              :name="field.key"
              :placeholder="field.placeholder"
              :required="field.required"
              rows="4"
            ></textarea>

            <input
              v-else
              :id="field.id"
              v-model="formValues[field.key]"
              :type="resolveInputType(field.type)"
              :name="field.key"
              :placeholder="field.placeholder"
              :required="field.required"
            />
          </template>

          <button class="button button--primary" type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? "Submitting..." : subscribe.submitLabel }}
          </button>

          <p class="form-status" aria-live="polite">{{ status }}</p>
        </form>
      </div>
    </div>
  </div>
</template>
