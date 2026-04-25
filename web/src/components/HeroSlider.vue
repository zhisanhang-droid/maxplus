<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useHeroSlider } from "../composables/useHeroSlider";
import type { HeroContent } from "../types/content";

const props = defineProps<{
  hero: HeroContent;
  holidayMode?: boolean;
}>();

const slideTotal = computed(() => props.hero.slides.length);
const isChristmasTheme = computed(() => Boolean(props.holidayMode));
const { activeIndex, setSlide, startAutoplay, stopAutoplay } = useHeroSlider(
  () => slideTotal.value
);

const getSlideMediaStyle = (image: string, position?: string) => ({
  backgroundImage: `url(${image})`,
  backgroundPosition: position ?? "center center"
});

function handleMouseEnter() {
  stopAutoplay();
}

function handleMouseLeave() {
  startAutoplay();
}

onMounted(() => {
  startAutoplay();
});
</script>

<template>
  <section :class="['hero-full', { 'hero-xmas': isChristmasTheme }]" id="home">
    <div
      :class="[
        'hero-slider',
        {
          'hero-slider--christmas': isChristmasTheme
        }
      ]"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <article
        v-for="(slide, index) in hero.slides"
        :key="slide.title"
        :class="[
          'hero-slide',
          `hero-slide--${slide.variant}`,
          {
            'is-active': activeIndex === index,
            'hero-slide--christmas': isChristmasTheme
          }
        ]"
      >
        <div class="hero-slide__media" :style="getSlideMediaStyle(slide.backgroundImage, slide.backgroundPosition)"></div>
        <div class="hero-slide__overlay"></div>
        <div v-if="isChristmasTheme" class="hero-slide__holiday-decor" aria-hidden="true">
          <span class="hero-slide__holiday-star"></span>
          <span class="hero-slide__holiday-tree"></span>
          <span class="hero-slide__holiday-bow"></span>
        </div>

        <div class="shell hero-slide__layout">
          <div class="hero-slide__copy">
            <div v-if="isChristmasTheme" class="hero-slide__holiday-kicker">
              <span class="hero-slide__holiday-badge">Christmas Edition</span>
              <span class="hero-slide__holiday-note">Gift-ready picks and festive seasonal offers.</span>
            </div>
            <p class="eyebrow">{{ slide.eyebrow }}</p>
            <h1>{{ slide.title }}</h1>
            <p class="hero-slide__text">{{ slide.text }}</p>

            <div class="hero-slide__actions">
              <RouterLink
                v-for="action in slide.actions"
                :key="action.label"
                :class="[
                  'button',
                  action.kind === 'ghost' ? 'button--ghost' : 'button--primary',
                  {
                    'button--xmas': isChristmasTheme && action.kind === 'primary'
                  }
                ]"
                :to="action.href"
              >
                {{ action.label }}
              </RouterLink>
            </div>
          </div>
        </div>
      </article>

      <div class="hero-controls shell">
        <button
          v-for="(label, index) in hero.dotLabels"
          :key="label"
          :class="['hero-dot', { 'is-active': activeIndex === index }]"
          type="button"
          :aria-label="label"
          @click="setSlide(index)"
        ></button>
      </div>
    </div>
  </section>
</template>
