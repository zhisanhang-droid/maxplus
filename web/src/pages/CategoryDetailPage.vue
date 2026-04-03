<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import CatalogProductGrid from "../components/CatalogProductGrid.vue";
import PageBanner from "../components/PageBanner.vue";
import { usePublicData } from "../composables/usePublicData";
import { usePageMeta } from "../composables/usePageMeta";

const route = useRoute();
const pageSize = 4;
const { findCategoryBySlug, getProductsByCategory } = usePublicData();

const selectedSport = ref("all");
const selectedAudience = ref("all");
const selectedUseCase = ref("all");
const selectedStock = ref("all");
const sortKey = ref("featured");
const currentPage = ref(1);

const category = computed(() => findCategoryBySlug(String(route.params.slug ?? "")));
const baseProducts = computed(() =>
  category.value ? getProductsByCategory(category.value.slug) : []
);

const sportOptions = computed(() => [...new Set(baseProducts.value.map((item) => item.sportType))]);
const audienceOptions = computed(() => [...new Set(baseProducts.value.map((item) => item.audience))]);
const useCaseOptions = computed(() => [...new Set(baseProducts.value.map((item) => item.useCase))]);
const stockOptions = computed(() => [...new Set(baseProducts.value.map((item) => item.stockStatus))]);

const filteredProducts = computed(() => {
  const filtered = baseProducts.value.filter((item) => {
    if (selectedSport.value !== "all" && item.sportType !== selectedSport.value) {
      return false;
    }

    if (selectedAudience.value !== "all" && item.audience !== selectedAudience.value) {
      return false;
    }

    if (selectedUseCase.value !== "all" && item.useCase !== selectedUseCase.value) {
      return false;
    }

    if (selectedStock.value !== "all" && item.stockStatus !== selectedStock.value) {
      return false;
    }

    return true;
  });

  const sorted = [...filtered];

  switch (sortKey.value) {
    case "price-asc":
      sorted.sort((a, b) => Number(a.price.replace("$", "")) - Number(b.price.replace("$", "")));
      break;
    case "price-desc":
      sorted.sort((a, b) => Number(b.price.replace("$", "")) - Number(a.price.replace("$", "")));
      break;
    case "latest":
      sorted.reverse();
      break;
    case "best-selling":
      sorted.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
      break;
    default:
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
  }

  return sorted;
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredProducts.value.length / pageSize)));
const visibleProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredProducts.value.slice(start, start + pageSize);
});

watch(
  [
    () => route.params.slug,
    selectedSport,
    selectedAudience,
    selectedUseCase,
    selectedStock,
    sortKey
  ],
  () => {
    currentPage.value = 1;
  }
);

usePageMeta(
  computed(() => ({
    title: category.value ? `${category.value.title} | MaxPlus Categories` : "Category | MaxPlus",
    description: category.value
      ? category.value.summary
      : "Browse MaxPlus product categories."
  }))
);
</script>

<template>
  <PageBanner
    :eyebrow="category?.eyebrow ?? 'Category'"
    :title="category?.bannerTitle ?? 'Category Not Found'"
  />

  <section class="section category-detail">
    <div class="shell" v-if="category">
      <div class="catalog-hero">
        <div class="catalog-hero__copy reveal" v-reveal>
          <p>{{ category.bannerText }}</p>

          <ul class="catalog-hero__highlights">
            <li v-for="item in category.highlights" :key="item">{{ item }}</li>
          </ul>
        </div>

        <div class="catalog-hero__aside reveal" v-reveal>
          <div :class="['catalog-hero__visual', category.visualClass]"></div>

          <div class="catalog-hero__stats">
            <article v-for="item in category.stats" :key="item.label">
              <strong>{{ item.value }}</strong>
              <span>{{ item.label }}</span>
            </article>
          </div>
        </div>
      </div>

      <div class="catalog-filter-card reveal" v-reveal>
        <div class="catalog-filter-card__grid">
          <label>
            <span>Sport Type</span>
            <select v-model="selectedSport">
              <option value="all">All</option>
              <option v-for="item in sportOptions" :key="item" :value="item">{{ item }}</option>
            </select>
          </label>

          <label>
            <span>Audience</span>
            <select v-model="selectedAudience">
              <option value="all">All</option>
              <option v-for="item in audienceOptions" :key="item" :value="item">{{ item }}</option>
            </select>
          </label>

          <label>
            <span>Use</span>
            <select v-model="selectedUseCase">
              <option value="all">All</option>
              <option v-for="item in useCaseOptions" :key="item" :value="item">{{ item }}</option>
            </select>
          </label>

          <label>
            <span>Stock</span>
            <select v-model="selectedStock">
              <option value="all">All</option>
              <option v-for="item in stockOptions" :key="item" :value="item">{{ item }}</option>
            </select>
          </label>

          <label>
            <span>Sort</span>
            <select v-model="sortKey">
              <option value="featured">Default</option>
              <option value="latest">Latest</option>
              <option value="price-asc">Price Low To High</option>
              <option value="price-desc">Price High To Low</option>
              <option value="best-selling">Best Selling</option>
            </select>
          </label>
        </div>
      </div>

      <CatalogProductGrid :products="visibleProducts" />

      <div v-if="filteredProducts.length > pageSize" class="pagination-row">
        <button
          class="button button--ghost pagination-row__button"
          type="button"
          :disabled="currentPage === 1"
          @click="currentPage -= 1"
        >
          Previous
        </button>

        <span>Page {{ currentPage }} / {{ totalPages }}</span>

        <button
          class="button button--ghost pagination-row__button"
          type="button"
          :disabled="currentPage === totalPages"
          @click="currentPage += 1"
        >
          Next
        </button>
      </div>
    </div>

    <div v-else class="shell">
      <div class="catalog-empty reveal is-visible">
        <h3>This category does not exist.</h3>
        <p>Open the products page to browse all current catalog items.</p>
      </div>
    </div>
  </section>
</template>
