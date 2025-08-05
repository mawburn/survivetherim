<template>
  <div id="app" class="min-h-screen p-8 bg-gray-50">
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
  line-height: 1.6;
  color: #374151;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  color: #334155;
  margin-bottom: 0.5rem;
}

a {
  color: #2563eb;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.container {
  max-width: 1152px;
  margin: 0 auto;
  padding: 0 1rem;
}
</style>
