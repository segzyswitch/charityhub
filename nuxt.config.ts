// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Charity Hub - Online Charity & Fundraising Platform',
      meta: [
        { name: 'description', content: 'Online Charity & Fundraising Platform' }
      ],
      link: [
        // { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400%7CSource+Sans+Pro:700' },
        // { rel: 'icon', href: '/bima-logo.png' },
        // { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css' },
      ],
    }
  },
  runtimeConfig: {
    // server-only (never exposed to client)

    // public (safe to expose to client)
    public: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      measurementId: process.env.MEASUREMENT_ID,
      stripePublicKey: process.env.STRIPE_PUBLIC_KEY
    }
  }
})
