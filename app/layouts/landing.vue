<script setup lang="ts">
// import '@/assets/css/A.bootstrap.min.css+owl.carousel.css+owl.theme.default.css+font-awesome.min.css+style.css,Mcc.jW_7sYDfOu.css.pagespeed.cf.0u7UUq5tp-.css';
import '@/assets/css/bootstrap.min.css+owl.carousel.css+owl.theme.default.css+font-awesome.min.css+style.css.pagespeed.cc.jW_7sYDfOu.css';
// import "@/assets/css/landing.css";
import "@/assets/js/jquery.min.js";
import "@/assets/js/bootstrap.min.js+owl.carousel.min.js.pagespeed.jc.6INv6TP5LI.js";
import "@/assets/js/jquery.stellar.min.js+main.js.pagespeed.jc.TaD_OS7Wkn.js";
// import "@/assets/js/extras.js";

useHead({
  link: [
    // { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" },
    { rel: "stylesheet", href: "/assets/landing.css" },
    // { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css" }
  ],
  script: [
    // { src: "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" }
  ]
})
</script>


<template>

  <div>
		<slot />
  </div>
</template>