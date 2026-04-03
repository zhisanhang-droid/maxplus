<script setup lang="ts">
import type { HighlightItem } from "../types/content";

defineProps<{
  highlights: HighlightItem[];
}>();
</script>

<template>
  <section class="section highlights">
    <div class="shell highlights__grid">
      <div
        v-for="item in highlights"
        :key="item.title"
        class="highlight-card reveal"
        v-reveal
      >
        <strong>{{ item.title }}</strong>
        <span>{{ item.text }}</span>
      </div>
    </div>
  </section>
</template>
