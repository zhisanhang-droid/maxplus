<script setup lang="ts">
defineProps<{
  label: string;
  value: string | number;
  hint: string;
}>();
</script>

<template>
  <section class="stat-card">
    <span class="stat-card__label">{{ label }}</span>
    <strong class="stat-card__value">{{ value }}</strong>
    <p class="stat-card__hint">{{ hint }}</p>
  </section>
</template>
