<template>
  <div id="app" class="min-h-screen p-8 bg-gray-50">
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<style>
body {
  @apply m-0 p-0 font-sans leading-relaxed text-gray-800;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  @apply text-slate-700 mb-2;
}

a {
  @apply text-blue-600 no-underline hover:underline;
}

.container {
  @apply max-w-6xl mx-auto px-4;
}
</style>
