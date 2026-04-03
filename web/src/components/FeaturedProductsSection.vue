<script setup lang="ts">
import type { FeaturedContent } from "../types/content";
import SectionHeading from "./SectionHeading.vue";

defineProps<{
  featured: FeaturedContent;
}>();
</script>

<template>
  <section class="section featured-products" id="products">
    <div class="shell">
      <SectionHeading
        :eyebrow="featured.eyebrow"
        :title="featured.title"
        :text="featured.text"
      />

      <div class="product-grid">
        <article
          v-for="item in featured.items"
          :key="item.title"
          class="product-card reveal"
          v-reveal
        >
          <div :class="['product-card__visual', item.visualClass]"></div>

          <div class="product-card__content">
            <span class="product-card__tag">{{ item.tag }}</span>
            <h3>{{ item.title }}</h3>
            <p>{{ item.text }}</p>

            <div class="product-card__meta">
              <strong>{{ item.price }}</strong>
              <RouterLink :to="item.href">{{ featured.detailsLabel }}</RouterLink>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
