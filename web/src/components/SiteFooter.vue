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

      <div class="footer-links">
        <div>
          <strong>{{ footer.contactTitle }}</strong>
          <a v-for="item in footer.contactLinks" :key="item.label" :href="item.href">
            {{ item.label }}
          </a>
        </div>

        <div>
          <strong>{{ footer.socialTitle }}</strong>
          <a v-for="item in footer.socialLinks" :key="item.label" :href="item.href">
            {{ item.label }}
          </a>
        </div>

        <div>
          <strong>{{ footer.quickLinksTitle }}</strong>
          <template v-for="item in footer.quickLinks" :key="item.label">
            <RouterLink v-if="isInternalLink(item.href)" :to="item.href">
              {{ item.label }}
            </RouterLink>
            <a v-else :href="item.href">{{ item.label }}</a>
          </template>
        </div>

        <div>
          <strong>{{ footer.policyTitle }}</strong>
          <template v-for="item in footer.policyLinks" :key="item.label">
            <RouterLink v-if="isInternalLink(item.href)" :to="item.href">
              {{ item.label }}
            </RouterLink>
            <a v-else :href="item.href">{{ item.label }}</a>
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
