<script setup lang="ts">
interface Props {
  eyebrow: string;
  title: string;
  text?: string;
}

withDefaults(defineProps<Props>(), {
  text: ""
});
</script>

<template>
  <div class="section-heading reveal" v-reveal>
    <p class="eyebrow">{{ eyebrow }}</p>
    <h2>{{ title }}</h2>
    <p v-if="text">{{ text }}</p>
  </div>
</template>
