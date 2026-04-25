<script setup lang="ts">
import { computed, ref } from "vue";
import PageBanner from "../components/PageBanner.vue";
import { usePublicData } from "../composables/usePublicData";
import { usePageMeta } from "../composables/usePageMeta";

const { videoCategories, videos: tutorialVideos } = usePublicData();

const activeCategory = ref("all");

const categoryOptions = computed(() => {
  const usedSlugs = new Set(tutorialVideos.value.map((v) => v.categorySlug).filter(Boolean));
  return videoCategories.value.filter((c) => usedSlugs.has(c.slug));
});

const filteredVideos = computed(() =>
  activeCategory.value === "all"
    ? tutorialVideos.value
    : tutorialVideos.value.filter((v) => v.categorySlug === activeCategory.value)
);

const activeCategoryLabel = computed(() => {
  if (activeCategory.value === "all") return "All Categories";
  return categoryOptions.value.find((c) => c.slug === activeCategory.value)?.title ?? "All Categories";
});

const getCategoryLabel = (slug: string) => {
  const cat = videoCategories.value.find((c) => c.slug === slug);
  if (!cat) return "Videos";
  return cat.parentTitle ? `${cat.parentTitle} / ${cat.title}` : cat.title;
};

const getMediaStyle = (imageUrl?: string) => ({
  backgroundImage: `linear-gradient(180deg, rgba(8, 18, 31, 0.12), rgba(8, 18, 31, 0.52)), url(${imageUrl})`
});

const getVideoLink = (slug: string) => `/videos/${encodeURIComponent(slug)}`;

usePageMeta({
  title: "Videos | MaxPlus Sporting Goods",
  description: "Browse MaxPlus tutorial videos and filter by category."
});
</script>

<template>
  <PageBanner eyebrow="Tutorials" title="Videos" />

  <section class="section video-library">
    <div class="shell">
      <div class="video-library__filters reveal" v-reveal>
        <div class="video-library__filter-group">
          <div class="video-library__chips">
            <button
              type="button"
              :class="['video-library__chip', { 'is-active': activeCategory === 'all' }]"
              @click="activeCategory = 'all'"
            >
              All Videos
            </button>

            <button
              v-for="item in categoryOptions"
              :key="item.slug"
              type="button"
              :class="['video-library__chip', { 'is-active': activeCategory === item.slug }]"
              @click="activeCategory = item.slug"
            >
              {{ item.title }}
            </button>
          </div>
        </div>

        <div class="video-library__meta">
          <strong>{{ filteredVideos.length }}</strong>
          <span>{{ activeCategoryLabel }}</span>
        </div>
      </div>

      <div v-if="filteredVideos.length" class="video-library__grid">
        <RouterLink
          v-for="item in filteredVideos"
          :key="item.slug"
          :to="getVideoLink(item.slug)"
          class="video-card"
        >
          <div
            v-if="item.coverImage"
            class="video-card__media video-card__media--photo"
            :style="getMediaStyle(item.coverImage)"
          >
            <span class="video-card__play" aria-hidden="true">▶</span>
          </div>
          <div v-else :class="['video-card__media', item.visualClass]">
            <span class="video-card__play" aria-hidden="true">▶</span>
          </div>

          <div class="video-card__body">
            <div class="video-library__labels">
              <p class="video-card__tag">{{ getCategoryLabel(item.categorySlug) }}</p>
              <span v-if="item.topicLabel" class="video-library__topic">{{ item.topicLabel }}</span>
            </div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.summary }}</p>
            <span class="video-card__cta-link">Watch Video</span>
          </div>
        </RouterLink>
      </div>

      <div v-else class="catalog-empty reveal is-visible">
        <h3>No videos in this category.</h3>
        <p>Try another category to browse tutorials.</p>
      </div>
    </div>
  </section>
</template>
