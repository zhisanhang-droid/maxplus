<script setup lang="ts">
import CategorySection from "../components/CategorySection.vue";
import ContactSection from "../components/ContactSection.vue";
import FeaturedProductsSection from "../components/FeaturedProductsSection.vue";
import HeroSlider from "../components/HeroSlider.vue";
import ReviewsSection from "../components/ReviewsSection.vue";
import VideoSection from "../components/VideoSection.vue";
import { usePublicData } from "../composables/usePublicData";

const { siteContent } = usePublicData();
</script>

<template>
  <HeroSlider :hero="siteContent.hero" />
  <VideoSection :videos="siteContent.videos" />
  <FeaturedProductsSection :featured="siteContent.featured" />
  <CategorySection :categories="siteContent.categories" />
  <ReviewsSection :reviews="siteContent.reviews" />
  <ContactSection :contact="siteContent.contact" />
</template>
