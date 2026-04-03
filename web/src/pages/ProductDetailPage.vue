<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import CatalogProductGrid from "../components/CatalogProductGrid.vue";
import InquiryForm from "../components/InquiryForm.vue";
import PageBanner from "../components/PageBanner.vue";
import { usePublicData } from "../composables/usePublicData";
import { usePageMeta } from "../composables/usePageMeta";
import { useStructuredData } from "../composables/useStructuredData";

const route = useRoute();
const { findCategoryBySlug, findProductBySlug, getRelatedProducts } = usePublicData();

const product = computed(() => findProductBySlug(String(route.params.slug ?? "")));
const category = computed(() =>
  product.value ? findCategoryBySlug(product.value.categorySlug) : undefined
);
const relatedProducts = computed(() =>
  product.value ? getRelatedProducts(product.value) : []
);

usePageMeta(
  computed(() => ({
    title: product.value ? `${product.value.title} | MaxPlus Sporting Goods` : "Product | MaxPlus",
    description: product.value
      ? product.value.summary
      : "Review MaxPlus product details, specs, and inquiry options."
  }))
);

useStructuredData(
  computed(() => {
    if (!product.value) {
      return null;
    }

    return {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.value.title,
      sku: product.value.sku,
      description: product.value.summary,
      category: product.value.categoryLabel,
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        price: Number(product.value.price.replace("$", "")),
        availability:
          product.value.stockStatus === "In Stock"
            ? "https://schema.org/InStock"
            : "https://schema.org/LimitedAvailability"
      }
    };
  })
);
</script>

<template>
  <PageBanner
    :eyebrow="product?.tag ?? 'Product'"
    :title="product?.title ?? 'Product Not Found'"
  />

  <template v-if="product">
    <section class="section product-detail">
      <div class="shell product-detail__layout">
        <div class="product-detail__media reveal" v-reveal>
          <div :class="['product-card__visual', 'product-detail__hero', product.visualClass]"></div>

          <div class="product-detail__gallery">
            <div
              v-for="item in product.galleryClasses"
              :key="item"
              :class="['catalog-gallery__item', item]"
            ></div>
          </div>
        </div>

        <div class="product-detail__summary reveal" v-reveal>
          <RouterLink class="product-detail__breadcrumb" :to="`/categories/${product.categorySlug}`">
            {{ product.categoryLabel }}
          </RouterLink>

          <h2>{{ product.title }}</h2>
          <p>{{ product.description }}</p>

          <div class="product-detail__price">
            <strong>{{ product.price }}</strong>
            <span>{{ product.referencePrice }}</span>
          </div>

          <div class="product-detail__meta">
            <span>SKU: {{ product.sku }}</span>
            <span>{{ product.stockStatus }}</span>
            <span>MOQ: {{ product.orderMinimum }}</span>
            <span>Lead Time: {{ product.leadTime }}</span>
          </div>

          <div class="product-detail__actions">
            <a class="button button--primary" href="#product-inquiry">Get Quote</a>
            <RouterLink class="button button--ghost product-detail__ghost" to="/contact">
              Contact Us
            </RouterLink>
          </div>

          <ul class="product-detail__highlights">
            <li v-for="item in product.highlights" :key="item">{{ item }}</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="section product-detail__info">
      <div class="shell product-detail__info-grid">
        <article class="detail-card reveal" v-reveal>
          <p class="eyebrow">Specifications</p>
          <div class="detail-card__rows">
            <div v-for="item in product.specifications" :key="item.label" class="detail-card__row">
              <span>{{ item.label }}</span>
              <strong>{{ item.value }}</strong>
            </div>
          </div>
        </article>

        <article class="detail-card reveal" v-reveal>
          <p class="eyebrow">Applications</p>
          <ul class="detail-card__list">
            <li v-for="item in product.applications" :key="item">{{ item }}</li>
          </ul>
        </article>

        <article class="detail-card reveal" v-reveal>
          <p class="eyebrow">Shipping</p>
          <p>{{ product.shipping }}</p>
          <p class="detail-card__support">{{ product.support }}</p>
        </article>
      </div>
    </section>

    <section class="section product-inquiry" id="product-inquiry">
      <div class="shell product-inquiry__layout">
        <div class="product-inquiry__copy reveal" v-reveal>
          <p class="eyebrow">Product Inquiry</p>
          <h2>Use this form for quote and product-specific questions.</h2>
          <p>
            Category:
            <RouterLink :to="`/categories/${product.categorySlug}`">
              {{ category?.title ?? product.categoryLabel }}
            </RouterLink>
          </p>
        </div>

        <InquiryForm
          title="Request quote or product details"
          submit-label="Send Product Inquiry"
          demo-status="Demo mode only. The product inquiry form is styled and ready for later integration."
          source="product"
          source-label="Product"
          :source-value="product.title"
          message-placeholder="Tell us quantity, branding need, target market, or shipping questions."
        />
      </div>
    </section>

    <section v-if="relatedProducts.length" class="section catalog-zone">
      <div class="shell">
        <div class="section-heading reveal" v-reveal>
          <p class="eyebrow">Related Products</p>
          <h2>More products in the same buying conversation.</h2>
        </div>

        <CatalogProductGrid :products="relatedProducts" />
      </div>
    </section>
  </template>

  <section v-else class="section">
    <div class="shell">
      <div class="catalog-empty reveal is-visible">
        <h3>This product is not available.</h3>
        <p>Open the products page to browse the current catalog.</p>
      </div>
    </div>
  </section>
</template>
