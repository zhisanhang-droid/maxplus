<script setup lang="ts">
import { reactive, ref } from "vue";
import { apiPost } from "../services/http";
import type { ContactContent } from "../types/content";

interface ContactFormState {
  name: string;
  email: string;
  interest: string;
  message: string;
}

const props = defineProps<{
  contact: ContactContent;
}>();

const form = reactive<ContactFormState>({
  name: "",
  email: "",
  interest: "",
  message: ""
});
const status = ref("");
const isSubmitting = ref(false);

const reset = () => {
  form.name = "";
  form.email = "";
  form.interest = "";
  form.message = "";
};

const submit = async () => {
  status.value = "";
  isSubmitting.value = true;

  try {
    await apiPost(
      "/public/inquiry",
      {
        source: "contact",
        name: form.name,
        email: form.email,
        interest: form.interest,
        message: form.message,
        sourceDetail: "Homepage Feedback"
      },
      {
        secure: true
      }
    );
    status.value = "Thanks. We will get back to you soon.";
    reset();
  } catch (error) {
    status.value = error instanceof Error ? error.message : "Unable to submit right now.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <section class="section contact-zone" id="feedback">
    <div class="shell contact-layout">
      <div class="contact-copy reveal" v-reveal>
        <p class="eyebrow">{{ contact.eyebrow }}</p>
        <h2>{{ contact.title }}</h2>
        <p v-if="contact.text">{{ contact.text }}</p>
      </div>

      <form class="contact-form reveal" v-reveal @submit.prevent="submit">
        <div class="field-row">
          <label>
            <span>{{ contact.fields.nameLabel }}</span>
            <input
              v-model="form.name"
              type="text"
              name="name"
              :placeholder="contact.fields.namePlaceholder"
              required
            />
          </label>

          <label>
            <span>{{ contact.fields.emailLabel }}</span>
            <input
              v-model="form.email"
              type="email"
              name="email"
              :placeholder="contact.fields.emailPlaceholder"
              required
            />
          </label>
        </div>

        <label>
          <span>{{ contact.fields.interestLabel }}</span>
          <select v-model="form.interest" name="interest" required>
            <option value="">{{ contact.fields.chooseOne }}</option>
            <option
              v-for="option in contact.interestOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </label>

        <label>
          <span>{{ contact.fields.messageLabel }}</span>
          <textarea
            v-model="form.message"
            name="message"
            rows="5"
            :placeholder="contact.fields.messagePlaceholder"
            required
          ></textarea>
        </label>

        <button class="button button--primary" type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? "Submitting..." : contact.fields.submitLabel }}
        </button>

        <p class="form-status" aria-live="polite">{{ status }}</p>
      </form>
    </div>
  </section>
</template>
