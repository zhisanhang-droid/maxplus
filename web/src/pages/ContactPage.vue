<script setup lang="ts">
import { computed } from "vue";
import InquiryForm from "../components/InquiryForm.vue";
import PageBanner from "../components/PageBanner.vue";
import { usePublicData } from "../composables/usePublicData";
import { usePageMeta } from "../composables/usePageMeta";

const { siteSettings } = usePublicData();

const contactChannels = computed(() => {
  if (!siteSettings.value) {
    return [
      { label: "Sales Email", value: "hello@maxplus-sport.com", href: "mailto:hello@maxplus-sport.com" },
      { label: "Support Email", value: "support@maxplus-sport.com", href: "mailto:support@maxplus-sport.com" }
    ];
  }

  return [
    {
      label: "Sales Email",
      value: siteSettings.value.brand.salesEmail,
      href: `mailto:${siteSettings.value.brand.salesEmail}`
    },
    {
      label: "Support Email",
      value: siteSettings.value.brand.supportEmail,
      href: `mailto:${siteSettings.value.brand.supportEmail}`
    },
    {
      label: "Phone",
      value: siteSettings.value.brand.phone,
      href: `tel:${siteSettings.value.brand.phone.replace(/[^\d+]/g, "")}`
    }
  ];
});

const socialChannels = computed(() =>
  siteSettings.value?.socials?.length
    ? siteSettings.value.socials.map((item) => ({
        label: item.name,
        value: item.url.replace(/^https?:\/\//, ""),
        href: item.url
      }))
    : [
        { label: "Instagram", value: "@maxplus.sport", href: "/" },
        { label: "YouTube", value: "MaxPlus Tutorials", href: "/" },
        { label: "TikTok", value: "@maxplusgear", href: "/" }
      ]
);

usePageMeta({
  title: "Contact | MaxPlus Sporting Goods",
  description: "Contact MaxPlus for wholesale cooperation, business support, and catalog questions."
});
</script>

<template>
  <PageBanner eyebrow="Contact" title="Contact" />

  <section class="section contact-page">
    <div class="shell contact-page__layout">
      <div class="contact-page__info">
        <article
          v-for="item in contactChannels"
          :key="item.label"
          class="contact-page__card reveal"
          v-reveal
        >
          <span>{{ item.label }}</span>
          <a :href="item.href">{{ item.value }}</a>
        </article>

        <article class="contact-page__card reveal" v-reveal>
          <span>Map</span>
          <p>U.S.-focused distribution planning with responsive support for quote and shipping coordination.</p>
        </article>

        <article class="contact-page__card reveal" v-reveal>
          <span>Social</span>
          <div class="contact-page__socials">
            <a v-for="item in socialChannels" :key="item.label" :href="item.href">
              {{ item.label }} / {{ item.value }}
            </a>
          </div>
        </article>
      </div>

      <div class="contact-page__forms">
        <InquiryForm
          eyebrow="Wholesale"
          title="Wholesale cooperation"
          submit-label="Send Wholesale Inquiry"
          demo-status="Demo mode only. The wholesale cooperation form is styled and ready for later integration."
          source="wholesale"
          source-label="Lead Source"
          source-value="Contact / Wholesale"
          message-placeholder="Tell us about your store, distribution region, and target product lines."
        />

        <InquiryForm
          eyebrow="Business Support"
          title="General business inquiry"
          submit-label="Send Message"
          demo-status="Demo mode only. The contact form is styled and ready for later integration."
          source="contact"
          source-label="Lead Source"
          source-value="Contact / Business"
          message-placeholder="Tell us your question, support request, or content collaboration idea."
        />
      </div>
    </div>
  </section>
</template>
