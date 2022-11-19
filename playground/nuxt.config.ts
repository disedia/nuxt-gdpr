// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-gdpr'
  ],
  tailwindcss: {
    configPath: '~/playground/tailwind.config.js'
  },
  gdpr: {
    defaultLocale: 'en',
    locales: ['de', {
      name: 'Deutsch',
      code: 'deu',
      src: 'gdpr/i18n/deu.ts'
    }],
    consentRules: [{
      name: 'ga',
      src: 'gdpr/ga.ts'
    }]
  }
})
