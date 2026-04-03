<script setup lang="ts">
import { ref } from "vue";
import type { HeaderContent } from "../types/content";
import BrandLogo from "./BrandLogo.vue";

defineProps<{
  header: HeaderContent;
}>();
const isMenuOpen = ref(false);

const toggleMenu = (): void => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = (): void => {
  isMenuOpen.value = false;
};
</script>

<template>
  <header class="site-header">
    <nav class="nav shell" :aria-label="header.navLabel">
      <BrandLogo :sub-label="header.logoSub" :ariaLabel="header.logoLabel" />

      <button
        class="nav-toggle"
        type="button"
        :aria-expanded="isMenuOpen"
        aria-controls="sporting-nav-menu"
        @click="toggleMenu"
      >
        {{ header.toggleLabel }}
      </button>

      <div :class="['nav__menu', { 'is-open': isMenuOpen }]" id="sporting-nav-menu">
        <RouterLink
          v-for="link in header.links"
          :key="link.href"
          :to="link.href"
          class="nav__link"
          @click="closeMenu"
        >
          {{ link.label }}
        </RouterLink>
      </div>

      <RouterLink class="button button--primary nav__cta" to="/buy">
        {{ header.ctaLabel }}
      </RouterLink>
    </nav>
  </header>
</template>
