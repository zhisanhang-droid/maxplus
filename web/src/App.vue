<script setup lang="ts">
import { computed, onMounted } from "vue";
import CookieBanner from "./components/CookieBanner.vue";
import SiteFooter from "./components/SiteFooter.vue";
import SiteHeader from "./components/SiteHeader.vue";
import SubscribeWidget from "./components/SubscribeWidget.vue";
import { useDocumentMeta } from "./composables/useDocumentMeta";
import { usePublicData } from "./composables/usePublicData";

const publicData = usePublicData();
const content = computed(() => publicData.siteContent.value);

onMounted(() => {
  void publicData.loadPublicData();
});

useDocumentMeta(content);
</script>

<template>
  <SiteHeader :header="content.header" />

  <main>
    <RouterView />
  </main>

  <SiteFooter :footer="content.footer" :header="content.header" />
  <CookieBanner />
  <SubscribeWidget :subscribe="content.subscribe" />
</template>
