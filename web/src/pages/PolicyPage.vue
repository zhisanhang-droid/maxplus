<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import PageBanner from "../components/PageBanner.vue";
import { usePageMeta } from "../composables/usePageMeta";
import { findPolicyByType } from "../data/catalog";

const route = useRoute();

const policy = computed(() => findPolicyByType(String(route.params.type ?? "")));

usePageMeta(
  computed(() => ({
    title: policy.value ? `${policy.value.title} | MaxPlus` : "Policy | MaxPlus Sporting Goods",
    description: policy.value
      ? policy.value.intro
      : "Review MaxPlus privacy, shipping, refund, and terms information."
  }))
);
</script>

<template>
  <PageBanner
    :eyebrow="policy?.eyebrow ?? 'Policy'"
    :title="policy?.title ?? 'Policy Not Found'"
  />

  <section class="section policy-zone">
    <div class="shell">
      <div v-if="policy" class="policy-layout">
        <div class="policy-intro reveal" v-reveal>
          <p>{{ policy.intro }}</p>
          <span>{{ policy.updatedAt }}</span>
        </div>

        <article
          v-for="section in policy.sections"
          :key="section.title"
          class="policy-card reveal"
          v-reveal
        >
          <h3>{{ section.title }}</h3>
          <ul>
            <li v-for="item in section.items" :key="item">{{ item }}</li>
          </ul>
        </article>
      </div>

      <div v-else class="catalog-empty reveal is-visible">
        <h3>This policy page is not available.</h3>
        <p>Use the footer policy links to open a valid document.</p>
      </div>
    </div>
  </section>
</template>
