<script setup lang="ts">
import { computed, ref, watch } from "vue";
import PageBanner from "../components/PageBanner.vue";
import { usePublicData } from "../composables/usePublicData";
import { usePageMeta } from "../composables/usePageMeta";
const { categories: catalogCategories, videos: tutorialVideos } = usePublicData();

const activeCategory = ref("all");
const activeTopic = ref("all");

const categoryOptions = computed(() =>
  catalogCategories.value.filter((category) =>
    tutorialVideos.value.some((video) => video.categorySlug === category.slug)
  )
);

const topicOptions = computed(() => {
  const source = tutorialVideos.value.filter((video) =>
    activeCategory.value === "all" ? true : video.categorySlug === activeCategory.value
  );

  return Array.from(
    new Map(
      source.map((video) => [
        video.topicSlug,
        { slug: video.topicSlug, label: video.topicLabel }
      ])
    ).values()
  );
});

const filteredVideos = computed(() =>
  tutorialVideos.value.filter((video) => {
    if (activeCategory.value !== "all" && video.categorySlug !== activeCategory.value) {
      return false;
    }

    if (activeTopic.value !== "all" && video.topicSlug !== activeTopic.value) {
      return false;
    }

    return true;
  })
);

const featuredVideo = computed(() => filteredVideos.value[0] ?? null);
const libraryVideos = computed(() => filteredVideos.value.slice(1));

const activeCategoryLabel = computed(() => {
  if (activeCategory.value === "all") {
    return "All Categories";
  }

  return categoryOptions.value.find((item) => item.slug === activeCategory.value)?.title ?? "All Categories";
});

const getCategoryLabel = (slug: string) =>
  categoryOptions.value.find((item) => item.slug === slug)?.title ?? "Videos";

watch(activeCategory, () => {
  activeTopic.value = "all";
});

usePageMeta({
  title: "Videos | MaxPlus Sporting Goods",
  description: "Watch MaxPlus tutorial videos with expandable category and secondary topic filtering."
});
</script>

<template>
  <PageBanner eyebrow="Tutorials" title="Videos" />

  <section class="section video-library">
    <div class="shell">
      <div class="video-library__filters reveal" v-reveal>
        <div class="video-library__filter-group">
          <span>Category</span>
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

        <div class="video-library__filter-group">
          <span>Topic</span>
          <div class="video-library__chips">
            <button
              type="button"
              :class="['video-library__chip', { 'is-active': activeTopic === 'all' }]"
              @click="activeTopic = 'all'"
            >
              All Topics
            </button>

            <button
              v-for="item in topicOptions"
              :key="item.slug"
              type="button"
              :class="['video-library__chip', { 'is-active': activeTopic === item.slug }]"
              @click="activeTopic = item.slug"
            >
              {{ item.label }}
            </button>
          </div>
        </div>

        <div class="video-library__meta">
          <strong>{{ filteredVideos.length }}</strong>
          <span>{{ activeCategoryLabel }}</span>
        </div>
      </div>

      <template v-if="featuredVideo">
        <div class="video-library__hero">
          <article class="video-feature reveal" v-reveal>
            <div :class="['video-feature__media', featuredVideo.visualClass]">
              <span class="video-feature__eyebrow">{{ featuredVideo.tag }}</span>
              <span class="video-feature__play" aria-hidden="true">▶</span>
              <span class="video-feature__duration">{{ featuredVideo.duration }}</span>
            </div>

            <div class="video-feature__body">
              <div>
                <div class="video-library__labels">
                  <span class="video-card__tag">{{ getCategoryLabel(featuredVideo.categorySlug) }}</span>
                  <span class="video-library__topic">{{ featuredVideo.topicLabel }}</span>
                </div>
                <h3>{{ featuredVideo.title }}</h3>
                <p>{{ featuredVideo.summary }}</p>
              </div>

              <RouterLink class="video-feature__cta" to="/buy">
                Use In Wholesale Flow
              </RouterLink>
            </div>
          </article>
        </div>

        <div v-if="libraryVideos.length" class="video-library__grid">
          <article
            v-for="item in libraryVideos"
            :key="item.slug"
            class="video-card reveal"
            v-reveal
          >
            <div :class="['video-card__media', item.visualClass]">
              <span class="video-card__play" aria-hidden="true">▶</span>
              <span class="video-card__duration">{{ item.duration }}</span>
            </div>

            <div class="video-card__body">
              <div class="video-library__labels">
                <p class="video-card__tag">
                  {{ getCategoryLabel(item.categorySlug) }}
                </p>
                <span class="video-library__topic">{{ item.topicLabel }}</span>
              </div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.summary }}</p>
            </div>
          </article>
        </div>
      </template>

      <div v-else class="catalog-empty reveal is-visible">
        <h3>No videos in this filter.</h3>
        <p>Try another category or topic to find the corresponding tutorial.</p>
      </div>
    </div>
  </section>
</template>
