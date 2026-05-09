<script setup lang="ts">
import { computed } from "vue";
import type { VideoContent } from "../types/content";
import SectionHeading from "./SectionHeading.vue";
import { resolveVideoSource } from "../utils/video";

const props = defineProps<{
  videos: VideoContent;
}>();

const getMediaStyle = (imageUrl?: string) => ({
  backgroundImage: `linear-gradient(180deg, rgba(8, 18, 31, 0.12), rgba(8, 18, 31, 0.52)), url(${imageUrl})`
});

const featuredVideoSource = computed(() =>
  resolveVideoSource(props.videos.featured.videoUrl ?? "")
);
</script>

<template>
  <section class="section video-showcase" id="videos">
    <div class="shell">
      <div class="video-showcase__header">
        <SectionHeading
          :eyebrow="videos.eyebrow"
          :title="videos.title"
          :text="videos.text"
        >
          <template #action>
            <RouterLink class="button video-showcase__more" to="/videos">
              {{ videos.moreLabel }}
            </RouterLink>
          </template>
        </SectionHeading>
      </div>

      <div class="video-showcase__layout video-showcase__layout--single">
        <div class="video-feature reveal" v-reveal>
          <video
            v-if="featuredVideoSource.kind === 'file'"
            class="video-feature__native-player"
            controls
            :poster="videos.featured.coverImage"
          >
            <source :src="featuredVideoSource.src" />
          </video>
          <RouterLink v-else :to="videos.featured.href" class="video-feature__thumb-link">
            <div
              v-if="videos.featured.coverImage"
              class="video-feature__media video-feature__media--photo"
              :style="getMediaStyle(videos.featured.coverImage)"
            >
              <span class="video-feature__eyebrow">{{ videos.featured.eyebrow }}</span>
              <span class="video-feature__play" aria-hidden="true">▶</span>
              <span class="video-feature__duration">{{ videos.featured.duration }}</span>
            </div>
            <div v-else :class="['video-feature__media', videos.featured.visualClass]">
              <span class="video-feature__eyebrow">{{ videos.featured.eyebrow }}</span>
              <span class="video-feature__play" aria-hidden="true">▶</span>
              <span class="video-feature__duration">{{ videos.featured.duration }}</span>
            </div>
          </RouterLink>

          <div class="video-feature__body">
            <h3>{{ videos.featured.title }}</h3>
            <RouterLink :to="videos.featured.href" class="video-feature__cta">{{ videos.featured.ctaLabel }}</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
