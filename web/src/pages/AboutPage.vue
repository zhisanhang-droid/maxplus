<script setup lang="ts">
import HighlightsSection from "../components/HighlightsSection.vue";
import PageBanner from "../components/PageBanner.vue";
import { usePageMeta } from "../composables/usePageMeta";
import { aboutHighlights, aboutStats, aboutStory, catalogCategories } from "../data/catalog";

usePageMeta({
  title: "About MaxPlus | Sporting Goods Brand Story",
  description: "Learn how MaxPlus positions its sporting goods catalog for retail, wholesale, and category growth."
});
</script>

<template>
  <PageBanner eyebrow="Brand Story" title="About MaxPlus" />

  <section class="section story-zone">
    <div class="shell story-layout">
      <div class="story-copy reveal" v-reveal>
        <p v-for="paragraph in aboutStory" :key="paragraph">
          {{ paragraph }}
        </p>
      </div>

      <div class="story-stats">
        <article
          v-for="item in aboutStats"
          :key="item.label"
          class="story-stat reveal"
          v-reveal
        >
          <strong>{{ item.value }}</strong>
          <span>{{ item.label }}</span>
        </article>
      </div>
    </div>
  </section>

  <HighlightsSection :highlights="aboutHighlights" />

  <section class="section category-overview">
    <div class="shell">
      <div class="section-heading reveal" v-reveal>
        <p class="eyebrow">Product Families</p>
        <h2>Built to scale across multiple sports-driven buying needs.</h2>
      </div>

      <div class="category-overview__grid">
        <RouterLink
          v-for="category in catalogCategories"
          :key="category.slug"
          :to="`/categories/${category.slug}`"
          class="category-overview__card reveal"
          v-reveal
        >
          <p class="eyebrow">{{ category.eyebrow }}</p>
          <h3>{{ category.title }}</h3>
          <p>{{ category.summary }}</p>
        </RouterLink>
      </div>
    </div>
  </section>
</template>
