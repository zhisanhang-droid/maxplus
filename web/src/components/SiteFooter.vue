<script setup lang="ts">
import type { FooterContent, HeaderContent } from "../types/content";
import BrandLogo from "./BrandLogo.vue";

defineProps<{
  footer: FooterContent;
  header: HeaderContent;
}>();

const isInternalLink = (href: string) => href.startsWith("/");
</script>

<template>
  <footer class="site-footer" :style="footer.maxWidth ? `--footer-shell-max: ${footer.maxWidth}px` : ''">
    <div class="shell footer-layout">
      <div class="footer-brand">
        <BrandLogo
          :sub-label="header.logoSub"
          :ariaLabel="header.logoLabel"
          footer
        />

        <p>{{ footer.text }}</p>
      </div>

      <div class="footer-links">
        <div>
          <strong>{{ footer.contactTitle }}</strong>
          <template v-for="link in footer.contactLinks" :key="link.label">
            <a v-if="!isInternalLink(link.href)" :href="link.href" target="_blank" rel="noopener">{{ link.label }}</a>
            <RouterLink v-else :to="link.href">{{ link.label }}</RouterLink>
          </template>
        </div>
        <div>
          <strong>{{ footer.socialTitle }}</strong>
          <template v-for="link in footer.socialLinks" :key="link.label">
            <a v-if="!isInternalLink(link.href)" :href="link.href" target="_blank" rel="noopener">{{ link.label }}</a>
            <RouterLink v-else :to="link.href">{{ link.label }}</RouterLink>
          </template>
        </div>
      </div>

    </div>

    <div class="shell footer-meta">
      <span>{{ footer.meta1 }}</span>
      <span>{{ footer.meta2 }}</span>
    </div>
  </footer>
</template>
