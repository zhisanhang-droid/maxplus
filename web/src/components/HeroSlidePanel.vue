<script setup lang="ts">
import type { HeroPanel } from "../types/content";

defineProps<{
  panel: HeroPanel;
}>();
</script>

<template>
  <div v-if="panel.type === 'stack'" class="hero-panel-card">
    <div class="hero-panel-card__eyebrow">{{ panel.eyebrow }}</div>

    <div class="hero-stack">
      <div
        v-for="item in panel.items"
        :key="item.label"
        :class="['hero-stack__card', item.className]"
      >
        {{ item.label }}
      </div>
    </div>
  </div>

  <div v-else-if="panel.type === 'metrics'" class="hero-metrics">
    <div v-for="item in panel.items" :key="item.title" class="hero-metric">
      <strong>{{ item.title }}</strong>
      <span>{{ item.body }}</span>
    </div>
  </div>

  <div v-else class="quote-card">
    <p>{{ panel.quote }}</p>
    <span>{{ panel.caption }}</span>
  </div>
</template>
