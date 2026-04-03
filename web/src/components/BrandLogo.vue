<script setup lang="ts">
interface Props {
  subLabel: string;
  ariaLabel: string;
  footer?: boolean;
}

withDefaults(defineProps<Props>(), {
  footer: false
});
</script>

<template>
  <RouterLink :class="['logo', { 'logo--footer': footer }]" to="/" :aria-label="ariaLabel">
    <span class="logo__mark">MP</span>
    <span class="logo__text">
      <strong>MAXPLUS</strong>
      <small>{{ subLabel }}</small>
    </span>
  </RouterLink>
</template>
