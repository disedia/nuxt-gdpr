import { fileURLToPath } from 'url'
import { defu } from 'defu'
import { defineNuxtModule, createResolver, addComponent, addImports, addTemplate } from '@nuxt/kit'
import type { LanguageCodes } from './runtime/composables/locales'

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
  defaultLocale: LanguageCodes | string
  /**
   * Activates locales for gdpr banner so the user can switch between them
   */
  locales: (string|LanguageCodes)[]
    /**
   * Directory where the gdpr module will look for locales
   * Files must be named like the locale code (ISO 639-1 language codes) and can be of type .ts, .js or .json
   **/
  localesDir: string | null
  /**
   * Defines constent rules
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
    locales: [],
    localesDir: null,
    consentTimeout: null,
    consentRules: []
  },
  setup (options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))

    nuxt.options.runtimeConfig.public.gdpr = defu(nuxt.options.runtimeConfig.public.gdpr, {
      consentTimeout: options.consentTimeout,
      defaultLocale: options.defaultLocale
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
      from: resolve(runtimeDir, 'composables','locales.ts'),
      name: 'defineGdprLocale'
    }])
    addComponent({
      name: 'GdprBanner',
      filePath: resolve(runtimeDir, 'components', 'gdpr-banner.vue'),
      mode: 'client'
    })
    //add I18n locales
    if(options.locales.indexOf(options.defaultLocale)===-1){
      options.locales.push(options.defaultLocale)
    }
    addTemplate({
      write: true,
      filename: 'gdrpI18n.ts',
      getContents() {
        return `${options.locales.map(l => `import ${l} from '${resolve(runtimeDir, 'i18n', l)}'`).join('\n')}
export default function registerLocales(){
  ${options.locales.map(l => `${l}()`).join('\n')}
  return true
}
        `
      }
    })
  }
})
