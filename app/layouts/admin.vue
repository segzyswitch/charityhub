<template>

  <div>
		<slot />
  </div>
</template>
<script setup lang="ts">
useHead({
  link: [
    { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" },
    { rel: "stylesheet", href: "/assets/main.css" },
    { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css" }
  ],
  script: [
    { src: "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" }
  ]
})
</script>