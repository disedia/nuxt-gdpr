import { fileURLToPath } from 'url'
import { defineNuxtModule, createResolver, addComponent, addImports, addTemplate } from '@nuxt/kit'
import type { I18nLocales } from './runtime/composables/locals'

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
  consentTimeout: number | null,
  /**
  * Sets your default locale
  */
  defaultLocale: I18nLocales | string,
  /**
   * Activates locales for gdpr banner so the user can switch between them
   */
  locales: (string|I18nLocales)[],
  /**
   * Defines constent rules
   */
  consentRules: ConsentRule[],
  /**
   * Defines locales for the consent banner and the consent rules
   **/
  defineLocales: Record<string, Record<string, string>>
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
    consentTimeout: null,
    consentRules: [],
    defineLocales: {}
  },
  setup (options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))

    // Transpile runtime
    nuxt.options.build.transpile.push(runtimeDir)
    addImports([{
      from: resolve(runtimeDir, 'composables','gdpr.ts'),
      name: 'useGdpr'
    },{
      from: resolve(runtimeDir, 'composables','locals.ts'),
      name: 'useGdprLocals'
    },{
      from: resolve(runtimeDir, 'composables','locals.ts'),
      name: 'defineGdprLocales'
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
export default function registerLocals(){
  ${options.locales.map(l => `${l}()`).join('\n')}
}
        `
      }
    })
  }
})
