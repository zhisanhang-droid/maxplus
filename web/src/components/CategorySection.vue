<script setup lang="ts">
import type { CategoriesContent } from "../types/content";

defineProps<{
  categories: CategoriesContent;
}>();
</script>

<template>
  <section class="section category-zone" id="categories">
    <div class="shell category-layout">
      <div class="category-copy reveal" v-reveal>
        <p class="eyebrow">{{ categories.eyebrow }}</p>
        <h2>{{ categories.title }}</h2>
        <p v-if="categories.text">{{ categories.text }}</p>
      </div>

      <div class="category-grid">
        <RouterLink
          v-for="item in categories.items"
          :key="item.title"
          :to="item.href"
          class="category-card reveal"
          v-reveal
        >
          <strong>{{ item.title }}</strong>
          <span>{{ item.text }}</span>
        </RouterLink>
      </div>
    </div>
  </section>
</template>
