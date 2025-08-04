<template>
  <div class="components-demo">
    <div class="page-header">
      <h1 class="page-title">Component Library Demo</h1>
      <p class="page-description">
        Showcase of reusable components with interactive examples
      </p>
    </div>

    <div class="demo-sections">
      <!-- Buttons Section -->
      <section class="demo-section">
        <h2 class="section-title">Buttons</h2>
        <BaseCard variant="bordered">
          <div class="component-showcase">
            <div class="showcase-group">
              <h3 class="showcase-title">Variants</h3>
              <div class="button-row">
                <BaseButton variant="primary">Primary</BaseButton>
                <BaseButton variant="secondary">Secondary</BaseButton>
                <BaseButton variant="success">Success</BaseButton>
                <BaseButton variant="danger">Danger</BaseButton>
              </div>
            </div>

            <div class="showcase-group">
              <h3 class="showcase-title">Sizes</h3>
              <div class="button-row">
                <BaseButton size="small">Small</BaseButton>
                <BaseButton size="medium">Medium</BaseButton>
                <BaseButton size="large">Large</BaseButton>
              </div>
            </div>

            <div class="showcase-group">
              <h3 class="showcase-title">States</h3>
              <div class="button-row">
                <BaseButton
                  :loading="loadingStates.button1"
                  @click="simulateLoading('button1')"
                >
                  {{ loadingStates.button1 ? "Loading..." : "Click to Load" }}
                </BaseButton>
                <BaseButton disabled>Disabled</BaseButton>
                <BaseButton variant="danger" @click="showAlert"
                  >Alert Button</BaseButton
                >
              </div>
            </div>
          </div>
        </BaseCard>
      </section>

      <!-- Cards Section -->
      <section class="demo-section">
        <h2 class="section-title">Cards</h2>
        <div class="cards-grid">
          <BaseCard variant="default">
            <template #header>
              <h3 class="card-title">Default Card</h3>
            </template>
            <p>This is a default card with subtle shadow.</p>
            <template #footer>
              <BaseButton size="small">Action</BaseButton>
            </template>
          </BaseCard>

          <BaseCard variant="elevated">
            <template #header>
              <h3 class="card-title">Elevated Card</h3>
            </template>
            <p>This card has more prominent shadow for emphasis.</p>
            <template #footer>
              <BaseButton size="small" variant="secondary"
                >Secondary</BaseButton
              >
            </template>
          </BaseCard>

          <BaseCard variant="bordered">
            <template #header>
              <h3 class="card-title">Bordered Card</h3>
            </template>
            <p>This card uses borders instead of shadows.</p>
            <template #footer>
              <BaseButton size="small" variant="success">Success</BaseButton>
            </template>
          </BaseCard>
        </div>
      </section>

      <!-- Interactive Form Section -->
      <section class="demo-section">
        <h2 class="section-title">Interactive Form</h2>
        <BaseCard variant="bordered">
          <template #header>
            <h3 class="card-title">Contact Form Demo</h3>
          </template>

          <form @submit.prevent="submitForm" class="demo-form">
            <div class="form-row">
              <BaseInput
                v-model="form.name"
                label="Name"
                placeholder="Enter your name"
                :error-message="errors.name"
                required
              />

              <BaseInput
                v-model="form.email"
                label="Email"
                type="email"
                placeholder="Enter your email"
                :error-message="errors.email"
                required
              />
            </div>

            <BaseInput
              v-model="form.message"
              label="Message"
              placeholder="Enter your message"
              :error-message="errors.message"
              required
            />

            <div class="form-actions">
              <BaseButton
                type="submit"
                :loading="isSubmitting"
                :disabled="!isFormValid"
              >
                {{ isSubmitting ? "Submitting..." : "Submit Form" }}
              </BaseButton>

              <BaseButton type="button" variant="secondary" @click="resetForm">
                Reset
              </BaseButton>
            </div>

            <div v-if="submissionResult" class="submission-result">
              <div
                :class="
                  submissionResult.success ? 'success-message' : 'error-message'
                "
              >
                {{ submissionResult.message }}
              </div>
            </div>
          </form>
        </BaseCard>
      </section>

      <!-- Dynamic Content Section -->
      <section class="demo-section">
        <h2 class="section-title">Dynamic Content</h2>
        <div class="dynamic-grid">
          <BaseCard variant="elevated">
            <template #header>
              <h3 class="card-title">Counter Demo</h3>
            </template>

            <div class="counter-demo">
              <div class="counter-display">
                <span class="counter-value">{{ counter }}</span>
              </div>

              <div class="counter-controls">
                <BaseButton
                  size="small"
                  @click="counter--"
                  :disabled="counter <= 0"
                >
                  -
                </BaseButton>
                <BaseButton
                  size="small"
                  variant="secondary"
                  @click="counter = 0"
                >
                  Reset
                </BaseButton>
                <BaseButton size="small" @click="counter++"> + </BaseButton>
              </div>
            </div>
          </BaseCard>

          <BaseCard variant="elevated">
            <template #header>
              <h3 class="card-title">Toggle Demo</h3>
            </template>

            <div class="toggle-demo">
              <div class="toggle-list">
                <div
                  v-for="(item, index) in toggleItems"
                  :key="index"
                  class="toggle-item"
                >
                  <label class="toggle-label">
                    <input
                      v-model="item.enabled"
                      type="checkbox"
                      class="toggle-checkbox"
                    />
                    <span class="toggle-text">{{ item.name }}</span>
                  </label>
                </div>
              </div>

              <div class="toggle-summary">
                <p>{{ enabledCount }} of {{ toggleItems.length }} enabled</p>
              </div>
            </div>
          </BaseCard>

          <BaseCard variant="elevated">
            <template #header>
              <h3 class="card-title">Random Quote</h3>
            </template>

            <div class="quote-demo">
              <blockquote class="quote-text">"{{ currentQuote }}"</blockquote>

              <BaseButton @click="generateQuote" size="small">
                New Quote
              </BaseButton>
            </div>
          </BaseCard>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
// Page metadata
useHead({
  title: "Components Demo - SurviveTheRim",
  meta: [
    {
      name: "description",
      content: "Interactive component library demonstration",
    },
  ],
});

// Form state
const form = reactive({
  name: "",
  email: "",
  message: "",
});

const errors = reactive({
  name: "",
  email: "",
  message: "",
});

const isSubmitting = ref(false);
const submissionResult = ref<{success: boolean; message: string} | null>(null);

// Button loading states
const loadingStates = reactive<Record<string, boolean>>({
  button1: false,
});

// Counter demo
const counter = ref(0);

// Toggle demo
const toggleItems = ref([
  { name: "Enable notifications", enabled: true },
  { name: "Dark mode", enabled: false },
  { name: "Auto-save", enabled: true },
  { name: "Sound effects", enabled: false },
]);

// Quote demo
const quotes = [
  "The best way to predict the future is to create it.",
  "Innovation distinguishes between a leader and a follower.",
  "Your limitation—it's only your imagination.",
  "Push yourself, because no one else is going to do it for you.",
  "Sometimes later becomes never. Do it now.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
  "Success doesn't just find you. You have to go out and get it.",
];

const currentQuote = ref(quotes[0]);

// Computed properties
const isFormValid = computed(() => {
  return (
    form.name.trim() &&
    form.email.trim() &&
    form.message.trim() &&
    !errors.name &&
    !errors.email &&
    !errors.message
  );
});

const enabledCount = computed(
  () => toggleItems.value.filter((item) => item.enabled).length
);

// Methods
const validateForm = () => {
  errors.name = form.name.trim() ? "" : "Name is required";
  errors.email = form.email.trim()
    ? /\S+@\S+\.\S+/.test(form.email)
      ? ""
      : "Invalid email format"
    : "Email is required";
  errors.message = form.message.trim() ? "" : "Message is required";
};

const submitForm = async () => {
  validateForm();

  if (!isFormValid.value) return;

  isSubmitting.value = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate random success/failure
    const success = Math.random() > 0.3;

    submissionResult.value = {
      success,
      message: success
        ? "Form submitted successfully!"
        : "Something went wrong. Please try again.",
    };

    if (success) {
      resetForm();
    }
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  form.name = "";
  form.email = "";
  form.message = "";
  errors.name = "";
  errors.email = "";
  errors.message = "";
  submissionResult.value = null;
};

const simulateLoading = async (buttonKey: string) => {
  loadingStates[buttonKey] = true;
  await new Promise((resolve) => setTimeout(resolve, 2000));
  loadingStates[buttonKey] = false;
};

const showAlert = () => {
  alert("Alert button clicked!");
};

const generateQuote = () => {
  const currentIndex = quotes.indexOf(currentQuote.value);
  let newIndex = Math.floor(Math.random() * quotes.length);

  // Ensure we don't get the same quote
  while (newIndex === currentIndex) {
    newIndex = Math.floor(Math.random() * quotes.length);
  }

  currentQuote.value = quotes[newIndex];
};

// Watch form changes for validation
watch(() => form.name, validateForm);
watch(() => form.email, validateForm);
watch(() => form.message, validateForm);
</script>

<style scoped>
.components-demo {
  @apply min-h-screen bg-gray-50 py-8;
}

.page-header {
  @apply text-center mb-12;
}

.page-title {
  @apply text-4xl font-bold text-gray-900 mb-4;
}

.page-description {
  @apply text-xl text-gray-600 max-w-2xl mx-auto;
}

.demo-sections {
  @apply max-w-6xl mx-auto px-4 space-y-12;
}

.demo-section {
  @apply space-y-6;
}

.section-title {
  @apply text-2xl font-bold text-gray-800;
}

.component-showcase {
  @apply space-y-8;
}

.showcase-group {
  @apply space-y-4;
}

.showcase-title {
  @apply text-lg font-semibold text-gray-700;
}

.button-row {
  @apply flex flex-wrap gap-3;
}

.cards-grid {
  @apply grid grid-cols-1 md:grid-cols-3 gap-6;
}

.card-title {
  @apply text-lg font-semibold;
}

.demo-form {
  @apply space-y-6;
}

.form-row {
  @apply grid grid-cols-1 md:grid-cols-2 gap-4;
}

.form-actions {
  @apply flex gap-3;
}

.submission-result {
  @apply mt-4;
}

.success-message {
  @apply p-3 bg-green-100 text-green-800 rounded-lg;
}

.error-message {
  @apply p-3 bg-red-100 text-red-800 rounded-lg;
}

.dynamic-grid {
  @apply grid grid-cols-1 md:grid-cols-3 gap-6;
}

.counter-demo {
  @apply text-center space-y-4;
}

.counter-display {
  @apply text-center;
}

.counter-value {
  @apply text-4xl font-bold text-blue-600;
}

.counter-controls {
  @apply flex justify-center gap-2;
}

.toggle-demo {
  @apply space-y-4;
}

.toggle-list {
  @apply space-y-3;
}

.toggle-item {
  @apply flex items-center;
}

.toggle-label {
  @apply flex items-center gap-2 cursor-pointer;
}

.toggle-checkbox {
  @apply w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500;
}

.toggle-text {
  @apply text-sm font-medium text-gray-700;
}

.toggle-summary {
  @apply text-sm text-gray-600 pt-2 border-t border-gray-200;
}

.quote-demo {
  @apply text-center space-y-4;
}

.quote-text {
  @apply text-lg italic text-gray-700 leading-relaxed;
}
</style>
