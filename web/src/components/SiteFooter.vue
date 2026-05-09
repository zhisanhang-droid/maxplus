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
  <footer class="site-footer">
    <div class="shell footer-layout">
      <div class="footer-brand">
        <BrandLogo
          :sub-label="header.logoSub"
          :ariaLabel="header.logoLabel"
          footer
        />

        <p>{{ footer.text }}</p>
      </div>

    </div>

    <div class="shell footer-meta">
      <span>{{ footer.meta1 }}</span>
      <span>{{ footer.meta2 }}</span>
    </div>
  </footer>
</template>
