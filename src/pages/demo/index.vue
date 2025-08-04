<template>
  <div class="demo-page">
    <div class="page-header">
      <h1 class="page-title">SurviveTheRim Demo</h1>
      <p class="page-description">
        Interactive demos showcasing Vue.js and Nuxt.js features
      </p>
    </div>

    <div class="demo-grid">
      <!-- Random Generators Section -->
      <section class="demo-section">
        <h2 class="section-title">Random Generators</h2>
        <div class="generators-grid">
          <DemoRandomGenerator
            title="Colonist Name"
            type="Name"
            :items="colonistNames"
            :generate-delay="800"
          />

          <DemoRandomGenerator
            title="Random Incident"
            type="Incident"
            :items="incidents"
            :generate-delay="1200"
          />

          <DemoRandomGenerator
            title="Base Name"
            type="Base Name"
            :items="baseNames"
            :generate-delay="600"
          />
        </div>
      </section>

      <!-- Colony Management Section -->
      <section class="demo-section">
        <h2 class="section-title">Colony Management</h2>

        <div class="colony-controls">
          <BaseButton @click="generateNewColonists" :loading="isGenerating">
            Generate New Colony
          </BaseButton>

          <BaseButton
            variant="secondary"
            @click="addRandomColonist"
            :disabled="colonists.length >= 10"
          >
            Add Colonist ({{ colonists.length }}/10)
          </BaseButton>
        </div>

        <div v-if="colonists.length > 0" class="colonists-grid">
          <RimWorldColonistCard
            v-for="colonist in colonists"
            :key="colonist.id"
            :colonist="colonist"
            @assign-task="handleAssignTask"
            @view-details="handleViewDetails"
          />
        </div>
      </section>

      <!-- Interactive Stats Section -->
      <section class="demo-section">
        <h2 class="section-title">Colony Statistics</h2>

        <div class="stats-grid">
          <BaseCard variant="bordered">
            <template #header>
              <h3 class="text-lg font-semibold">Colony Overview</h3>
            </template>

            <div class="stats-content">
              <div class="stat-item">
                <span class="stat-label">Total Colonists</span>
                <span class="stat-value">{{ colonists.length }}</span>
              </div>

              <div class="stat-item">
                <span class="stat-label">Average Health</span>
                <span class="stat-value">{{ averageHealth }}%</span>
              </div>

              <div class="stat-item">
                <span class="stat-label">Happy Colonists</span>
                <span class="stat-value">{{ happyColonists }}</span>
              </div>

              <div class="stat-item">
                <span class="stat-label">Top Skill</span>
                <span class="stat-value">{{ topSkill || "N/A" }}</span>
              </div>
            </div>
          </BaseCard>

          <BaseCard variant="bordered">
            <template #header>
              <h3 class="text-lg font-semibold">Mood Distribution</h3>
            </template>

            <div class="mood-chart">
              <div
                v-for="mood in moodDistribution"
                :key="mood.name"
                class="mood-bar"
              >
                <span class="mood-name">{{ mood.name }}</span>
                <div class="mood-bar-container">
                  <div
                    class="mood-bar-fill"
                    :style="{ width: `${mood.percentage}%` }"
                    :class="getMoodBarClass(mood.name)"
                  ></div>
                </div>
                <span class="mood-count">{{ mood.count }}</span>
              </div>
            </div>
          </BaseCard>
        </div>
      </section>
    </div>

    <!-- Modal for colonist details -->
    <div
      v-if="selectedColonist"
      class="modal-overlay"
      @click="selectedColonist = null"
    >
      <div class="modal-content" @click.stop>
        <BaseCard variant="elevated">
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="text-xl font-bold">
                {{ selectedColonist.name }} Details
              </h3>
              <button @click="selectedColonist = null" class="close-btn">
                &times;
              </button>
            </div>
          </template>

          <div class="colonist-details">
            <p><strong>Age:</strong> {{ selectedColonist.age }} years old</p>
            <p><strong>Health:</strong> {{ selectedColonist.health }}%</p>
            <p><strong>Mood:</strong> {{ selectedColonist.mood }}</p>

            <div class="skills-detail">
              <h4 class="font-semibold mb-2">All Skills:</h4>
              <div class="skills-list">
                <div
                  v-for="skill in selectedColonist.skills"
                  :key="skill.name"
                  class="skill-row"
                >
                  <span>{{ skill.name }}</span>
                  <span class="font-mono">Level {{ skill.level }}</span>
                </div>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const {
  colonistNames,
  incidents,
  baseNames,
  generateMultipleColonists,
  generateColonist,
} = useRimWorldData();

// Page metadata
useHead({
  title: "Demo - SurviveTheRim",
  meta: [
    {
      name: "description",
      content: "Interactive demos showcasing Vue.js and Nuxt.js features",
    },
  ],
});

interface Colonist {
  id: number
  name: string
  age: number
  health: number
  mood: string
  skills: Array<{ name: string; level: number }>
  traits: string[]
}

// Reactive state
const colonists = ref<Colonist[]>([]);
const isGenerating = ref(false);
const selectedColonist = ref<Colonist | null>(null);

// Computed properties
const averageHealth = computed(() => {
  if (colonists.value.length === 0) return 0;
  const total = colonists.value.reduce(
    (sum, colonist) => sum + colonist.health,
    0
  );
  return Math.round(total / colonists.value.length);
});

const happyColonists = computed(
  () => colonists.value.filter((c) => c.mood === "Happy").length
);

const topSkill = computed(() => {
  if (colonists.value.length === 0) return null;

  const skillCounts: Record<string, number> = {};
  colonists.value.forEach((colonist) => {
    colonist.skills.forEach((skill) => {
      skillCounts[skill.name] = (skillCounts[skill.name] || 0) + skill.level;
    });
  });

  if (Object.keys(skillCounts).length === 0) return null;

  const topSkillName = Object.keys(skillCounts).reduce(
    (a, b) => (skillCounts[a] > skillCounts[b] ? a : b)
  );

  return topSkillName;
});

const moodDistribution = computed(() => {
  const moods = ["Happy", "Content", "Stressed", "Breaking"];
  const total = colonists.value.length;

  return moods.map((mood) => {
    const count = colonists.value.filter((c) => c.mood === mood).length;
    const percentage = total > 0 ? (count / total) * 100 : 0;

    return { name: mood, count, percentage };
  });
});

// Methods
const generateNewColonists = async () => {
  isGenerating.value = true;

  // Simulate loading
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const count = Math.floor(Math.random() * 4) + 3; // 3-6 colonists
  colonists.value = generateMultipleColonists(count);

  isGenerating.value = false;
};

const addRandomColonist = () => {
  if (colonists.value.length < 10) {
    colonists.value.push(generateColonist());
  }
};

const handleAssignTask = (colonist: Colonist) => {
  console.log("Assigning task to:", colonist.name);
  // In a real app, this would open a task assignment modal
};

const handleViewDetails = (colonist: Colonist) => {
  selectedColonist.value = colonist;
};

const getMoodBarClass = (mood: string) => {
  switch (mood) {
    case "Happy":
      return "bg-green-500";
    case "Content":
      return "bg-blue-500";
    case "Stressed":
      return "bg-yellow-500";
    case "Breaking":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

// Initialize with some colonists
onMounted(() => {
  generateNewColonists();
});
</script>

<style scoped>
.demo-page {
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

.demo-grid {
  @apply max-w-7xl mx-auto px-4 space-y-12;
}

.demo-section {
  @apply space-y-6;
}

.section-title {
  @apply text-2xl font-bold text-gray-800 mb-6;
}

.generators-grid {
  @apply grid grid-cols-1 md:grid-cols-3 gap-6;
}

.colony-controls {
  @apply flex gap-4 mb-8 justify-center;
}

.colonists-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6;
}

.stats-grid {
  @apply grid grid-cols-1 lg:grid-cols-2 gap-6;
}

.stats-content {
  @apply space-y-4;
}

.stat-item {
  @apply flex justify-between items-center;
}

.stat-label {
  @apply text-gray-600;
}

.stat-value {
  @apply font-bold text-lg;
}

.mood-chart {
  @apply space-y-3;
}

.mood-bar {
  @apply flex items-center gap-3;
}

.mood-name {
  @apply w-20 text-sm font-medium;
}

.mood-bar-container {
  @apply flex-1 h-4 bg-gray-200 rounded-full overflow-hidden;
}

.mood-bar-fill {
  @apply h-full transition-all duration-500;
}

.mood-count {
  @apply w-8 text-right text-sm font-mono;
}

.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4;
}

.modal-content {
  @apply max-w-md w-full max-h-screen overflow-y-auto;
}

.close-btn {
  @apply text-gray-500 hover:text-gray-700 text-2xl font-bold;
}

.colonist-details {
  @apply space-y-4;
}

.skills-detail {
  @apply space-y-2;
}

.skills-list {
  @apply space-y-1;
}

.skill-row {
  @apply flex justify-between;
}
</style>
