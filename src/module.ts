import { fileURLToPath } from 'url'
import { defu } from 'defu'
import { defineNuxtModule, createResolver, addComponent, addImports, extendViteConfig, addPlugin } from '@nuxt/kit'
import { generateTemplate } from './template'
import type { LanguageCode, Language } from './types'
import { checkDefaults } from './utils'

export type ConsentRuleBanner = {
  title: string,
  description: string,
}

export interface ConsentRule {
  name: string,
  banner: ConsentRuleBanner
}

export interface ModuleOptions {
  /** 
   * Define a timeout for the consent banner to be shown again if user has declined it.
   * If not set, the banner will be shown on every page load.
   * */
  consentTimeout: number | null
  /**
  * Sets your default locale
  */
  defaultLocale: LanguageCode | string
  /**
   * Sets your default language
   **/
  fallbackLocale: LanguageCode | string
  /**
   * Activates locales for gdpr banner so the user can switch between them
   */
  locales: Language[]
  /**
   * Directory where the gdpr module will look for consent rules and language files
   **/
  dir: string | null
  /**
   * Defines consent rules
   */
  consentRules: ConsentRule[]
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-gdpr',
    configKey: 'gdpr',
    compatibility: {
      nuxt: '^3.0.0-rc.11'
    }
  },
  defaults: {
    defaultLocale: 'en',
    fallbackLocale: 'en',
    locales: [],
    dir: 'gdpr',
    consentTimeout: null,
    consentRules: []
  },
  setup (options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))

    //add default locale if not set by user and check if everything is set correctly
    checkDefaults(options)

    nuxt.options.runtimeConfig.gdpr = defu(nuxt.options.runtimeConfig.gdpr, {
      consentTimeout: options.consentTimeout,
      defaultLocale: options.defaultLocale,
      fallbackLocale: options.fallbackLocale,
      locales: options.locales,
    })

    // Transpile runtime
    nuxt.options.build.transpile.push(runtimeDir)
    addImports([{
      from: resolve(runtimeDir, 'composables','gdpr.ts'),
      name: 'useGdpr'
    },{
      from: resolve(runtimeDir, 'composables','locales.ts'),
      name: 'useGdprLocals'
    },{
      from: resolve(runtimeDir, 'lang','loader.ts'),
      name: 'defineGdprLocale'
    }])
    addComponent({
      name: 'GdprBanner',
      filePath: resolve(runtimeDir, 'components', 'gdpr-banner.vue'),
      mode: 'client'
    })
    
    //DX: transform defineGdprLocale to a function that can be imported async
    extendViteConfig((config) => {
      const plugin = {
        name: 'nuxt-gdpr',
        transform: (code, id) => {
          if (options.locales.some(locale => id.endsWith(locale.code + '.ts'))) {
            return code.replace('defineGdprLocale(', '() => defineGdprLocale(')
          }
        }
      }
      config.plugins = config.plugins || []
      config.plugins.unshift(plugin)
    })

    generateTemplate({
      defaultLocale: options.defaultLocale,
      fallbackLocale: options.fallbackLocale,
      locales: options.locales
    })

    addPlugin({
      src: resolve(runtimeDir, 'plugins', 'gdpr.plugin.ts')
    })

  }
})
