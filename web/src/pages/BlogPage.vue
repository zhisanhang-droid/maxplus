<script setup lang="ts">
import PageBanner from "../components/PageBanner.vue";
import { usePublicData } from "../composables/usePublicData";
import { usePageMeta } from "../composables/usePageMeta";
const { blogs: blogPosts } = usePublicData();

usePageMeta({
  title: "Blog | MaxPlus Sporting Goods",
  description: "Browse MaxPlus blog content for buying guides, training tips, and category planning ideas."
});
</script>

<template>
  <PageBanner eyebrow="Brand Blog" title="Blog" />

  <section class="section blog-zone">
    <div class="shell">
      <div class="blog-grid">
        <article
          v-for="post in blogPosts"
          :key="post.slug"
          class="blog-card reveal"
          v-reveal
        >
          <p class="blog-card__tag">{{ post.category }}</p>
          <h3>{{ post.title }}</h3>
          <p>{{ post.excerpt }}</p>
          <span class="blog-card__meta">{{ post.meta }}</span>
        </article>
      </div>
    </div>
  </section>
</template>
