<script setup lang="ts">
import type { VideoContent } from "../types/content";
import SectionHeading from "./SectionHeading.vue";

defineProps<{
  videos: VideoContent;
}>();
</script>

<template>
  <section class="section video-showcase" id="videos">
    <div class="shell">
      <SectionHeading
        :eyebrow="videos.eyebrow"
        :title="videos.title"
        :text="videos.text"
      />

      <div class="video-showcase__layout">
        <RouterLink
          :to="videos.featured.href"
          class="video-feature reveal"
          v-reveal
        >
          <div :class="['video-feature__media', videos.featured.visualClass]">
            <span class="video-feature__eyebrow">{{ videos.featured.eyebrow }}</span>
            <span class="video-feature__play" aria-hidden="true">▶</span>
            <span class="video-feature__duration">{{ videos.featured.duration }}</span>
          </div>

          <div class="video-feature__body">
            <h3>{{ videos.featured.title }}</h3>
            <span class="video-feature__cta">{{ videos.featured.ctaLabel }}</span>
          </div>
        </RouterLink>

        <div class="video-list">
          <RouterLink
            v-for="item in videos.items"
            :key="item.title"
            :to="item.href"
            class="video-card reveal"
            v-reveal
          >
            <div :class="['video-card__media', item.visualClass]">
              <span class="video-card__play" aria-hidden="true">▶</span>
              <span class="video-card__duration">{{ item.duration }}</span>
            </div>

            <div class="video-card__body">
              <p class="video-card__tag">{{ item.tag }}</p>
              <h3>{{ item.title }}</h3>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>
