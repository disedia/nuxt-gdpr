import { fileURLToPath } from 'url'
import { defineNuxtModule, createResolver, addComponent, addImports } from '@nuxt/kit'

export type ConsentRuleBanner = {
  title: string,
  description: string,
}

export interface ConsentRule {
  name: string,
  banner: ConsentRuleBanner
}

export interface ModuleOptions {
  storage: 'cookie' | 'localstorage',
  locale: string | string[],
  consentRules: ConsentRule[],
  locales: Record<string, Record<string, string>>
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-gdpr',
    configKey: 'gdpr',
    compatibility: {
      nuxt: '^3.0.0-rc.3'
    }
  },
  defaults: {
    storage: 'localstorage',
    locale: 'en',
    consentRules: [],
    locales: {}
  },
  setup (options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))

    // Transpile runtime
    nuxt.options.build.transpile.push(runtimeDir)
    addImports([{
      from: resolve(runtimeDir, 'composables/gdpr.ts'),
      name: 'useGdpr'
    }])
    addComponent({
      name: 'GdprBanner',
      filePath: `${resolve(runtimeDir, 'components')}/gdpr-banner.vue`
    })
  }
})
