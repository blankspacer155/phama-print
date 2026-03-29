// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite"
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  vite: {
    plugins: [
      tailwindcss(),
    ],
     optimizeDeps: {
      exclude: ['vee-validate'],
    },
  },

  css: [ '@/assets/css/global.css'],
  modules: ['nuxt-headlessui', '@vee-validate/nuxt', '@nuxt/icon'],
  build: {
    transpile: ['@vuepic/vue-datepicker']
  },
  app: {
    baseURL: '/phama-print/', // Must match your repo name exactly
    buildAssetsDir: 'assets',
  },
  ssr: false, // Required for localStorage-based apps
})