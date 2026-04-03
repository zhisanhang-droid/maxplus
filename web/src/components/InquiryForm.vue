<script setup lang="ts">
import { reactive, ref } from "vue";
import { apiPost } from "../services/http";

interface InquiryFormState {
  name: string;
  email: string;
  company: string;
  message: string;
}

const props = withDefaults(
  defineProps<{
    eyebrow?: string;
    title: string;
    description?: string;
    submitLabel: string;
    demoStatus: string;
    source?: "product" | "contact" | "wholesale";
    sourceLabel?: string;
    sourceValue?: string;
    messagePlaceholder?: string;
  }>(),
  {
    eyebrow: "Inquiry",
    description: "",
    source: "contact",
    sourceLabel: "",
    sourceValue: "",
    messagePlaceholder: "Tell us what you need."
  }
);

const form = reactive<InquiryFormState>({
  name: "",
  email: "",
  company: "",
  message: ""
});
const status = ref("");
const isSubmitting = ref(false);

const reset = () => {
  form.name = "";
  form.email = "";
  form.company = "";
  form.message = "";
};

const submit = async () => {
  status.value = "";
  isSubmitting.value = true;

  try {
    await apiPost(
      "/public/inquiry",
      {
        source: props.source,
        name: form.name,
        email: form.email,
        company: form.company,
        message: form.message,
        sourceDetail: props.sourceValue
      },
      {
        secure: true
      }
    );
    status.value = "Thanks. Your request has been submitted.";
    reset();
  } catch (error) {
    status.value = error instanceof Error ? error.message : "Unable to submit right now.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <form class="inquiry-form reveal" v-reveal @submit.prevent="submit">
    <div class="inquiry-form__header">
      <p class="eyebrow">{{ eyebrow }}</p>
      <h3>{{ title }}</h3>
      <p v-if="description">{{ description }}</p>
    </div>

    <div v-if="sourceLabel && sourceValue" class="inquiry-form__source">
      <span>{{ sourceLabel }}</span>
      <strong>{{ sourceValue }}</strong>
    </div>

    <div class="field-row">
      <label>
        <span>Name</span>
        <input v-model="form.name" type="text" name="name" placeholder="Your name" required />
      </label>

      <label>
        <span>Email</span>
        <input
          v-model="form.email"
          type="email"
          name="email"
          placeholder="name@email.com"
          required
        />
      </label>
    </div>

    <label>
      <span>Company</span>
      <input
        v-model="form.company"
        type="text"
        name="company"
        placeholder="Company / Store / Team"
        required
      />
    </label>

    <label>
      <span>Message</span>
      <textarea
        v-model="form.message"
        name="message"
        rows="5"
        :placeholder="messagePlaceholder"
        required
      ></textarea>
    </label>

    <button class="button button--primary" type="submit" :disabled="isSubmitting">
      {{ isSubmitting ? "Submitting..." : submitLabel }}
    </button>

    <p class="form-status" aria-live="polite">{{ status }}</p>
  </form>
</template>
