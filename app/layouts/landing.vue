<script setup lang="ts">
useHead({
  link: [
    { rel: "stylesheet", href: "/assets/css/bootstrap.carousel.owl.font-awesome.style.pagespeed.css" },
    // { rel: "stylesheet", href: "/assets/css/A.bootstrap.owl.font-awesome.min.css+style.css,Mcc.jW_7sYDfOu.css.pagespeed.cf.0u7UUq5tp-.css" },
    { rel: "stylesheet", href: "/assets/landing.css" },
    // { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css" }
  ],
  script: [
    { src: "/assets/js/jquery.min.js" },
    { src: "/assets/js/bootstrap.min.js+owl.carousel.min.js.pagespeed.jc.6INv6TP5LI.js" },
    { src: "/assets/js/jquery.stellar.min.js+main.js.pagespeed.jc.TaD_OS7Wkn.js" }
  ]
})
</script>


<template>

  <div>
		<slot />
  </div>
</template>