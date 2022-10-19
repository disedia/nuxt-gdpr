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
    storage: 'localstorage',
  }
})
