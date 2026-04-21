<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const props = withDefaults(
  defineProps<{
    brand?: string;
    duration?: number;
    impactTime?: number;
    persistAtEnd?: boolean;
    showSkip?: boolean;
  }>(),
  {
    brand: "MAXPLUS",
    duration: 3.55,
    impactTime: 1.52,
    persistAtEnd: false,
    showSkip: true
  }
);

const emit = defineEmits<{
  complete: [];
}>();

const flashOpacity = ref(0);
const shockwaveOpacity = ref(0);
const shockwaveProgress = ref(0);
const brandProgress = ref(0);
const hasSettled = ref(false);
const isReduced = ref(false);

let isFinished = false;
const timerIds: number[] = [];

const flashStyle = computed(() => ({
  opacity: flashOpacity.value.toFixed(3)
}));

const shockwaveStyle = computed(() => ({
  opacity: shockwaveOpacity.value.toFixed(3),
  transform: `translate(-50%, -50%) scale(${(0.62 + shockwaveProgress.value * 3.45).toFixed(3)})`
}));

const brandStyle = computed(() => {
  const reveal = easeOutCubic(clamp(brandProgress.value, 0, 1));

  return {
    opacity: reveal.toFixed(3),
    transform: `translate(-50%, -50%) translateY(${((1 - reveal) * 28).toFixed(2)}px) scale(${(0.88 + reveal * 0.12).toFixed(3)})`,
    filter: `blur(${((1 - reveal) * 10).toFixed(2)}px)`
  };
});

const brandParts = computed(() => {
  const brand = props.brand.trim();

  if (brand.toUpperCase() === "MAXPLUS") {
    return { lead: "MAX", tail: "PLUS" };
  }

  const splitIndex = Math.max(1, brand.length - 4);

  return { lead: brand.slice(0, splitIndex), tail: brand.slice(splitIndex) };
});

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

function schedule(callback: () => void, delay: number) {
  const timerId = window.setTimeout(callback, delay);
  timerIds.push(timerId);
}

function cancelScheduledTimers() {
  while (timerIds.length) {
    window.clearTimeout(timerIds.pop());
  }
}

function finishOpening() {
  if (isFinished) return;

  isFinished = true;
  hasSettled.value = true;

  if (!props.persistAtEnd) {
    cancelScheduledTimers();
  }

  emit("complete");
}

function handleSkip() {
  finishOpening();
}

onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    isReduced.value = true;
    flashOpacity.value = 0.14;
    schedule(() => {
      flashOpacity.value = 0;
      brandProgress.value = 1;
    }, 80);
    schedule(finishOpening, 1150);
    return;
  }

  schedule(() => {
    flashOpacity.value = 0.46;
    shockwaveOpacity.value = 0.42;
    shockwaveProgress.value = 0.6;
  }, 240);

  schedule(() => {
    flashOpacity.value = 0.08;
    shockwaveOpacity.value = 0.18;
    shockwaveProgress.value = 1.1;
  }, 420);

  schedule(() => {
    flashOpacity.value = 0;
    shockwaveOpacity.value = 0;
    shockwaveProgress.value = 1.5;
    brandProgress.value = 1;
  }, 500);

  schedule(finishOpening, 1780);
});

onBeforeUnmount(() => {
  cancelScheduledTimers();
});
</script>

<template>
  <div
    class="hero-opening hero-opening--fallback"
    :class="[
      isReduced ? 'hero-opening--reduced' : '',
      { 'hero-opening--persist': props.persistAtEnd, 'hero-opening--settled': hasSettled }
    ]"
  >
    <div class="hero-opening__background">
      <div class="hero-opening__arena"></div>
      <div class="hero-opening__spotlights"></div>
      <div class="hero-opening__crowd"></div>
      <div class="hero-opening__court"></div>
      <div class="hero-opening__net"></div>
    </div>

    <div v-if="!isReduced" class="hero-opening__fallback-ball"></div>
    <div class="hero-opening__shockwave" :style="shockwaveStyle"></div>
    <div class="hero-opening__flash" :style="flashStyle"></div>
    <div class="hero-opening__grain"></div>

    <div class="hero-opening__brand" :style="brandStyle">
      <span class="hero-opening__kicker">POWER • SPIN • CONTROL</span>
      <strong>
        <span class="hero-opening__brand-max">{{ brandParts.lead }}</span>
        <span class="hero-opening__brand-plus">{{ brandParts.tail }}</span>
      </strong>
    </div>

    <button
      v-if="props.showSkip && !hasSettled"
      class="hero-opening__skip"
      type="button"
      @click="handleSkip"
    >
      Skip Intro
    </button>
  </div>
</template>
