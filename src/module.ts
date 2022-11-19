import { defineNuxtModule, createResolver, addComponent, addImports, addPlugin } from '@nuxt/kit'
import { defu } from 'defu'
import { generateTemplate } from './template'
import type { ModuleOptions } from './types'
import { checkDefaultLocales, resolveGdprFiles } from './utils'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-gdpr',
    configKey: 'gdpr',
    compatibility: {
      nuxt: '^3.0.0'
    }
  },
  defaults: {
    defaultLocale: 'en',
    locales: [],
    consentTimeout: null,
    consentRules: []
  },
  async setup (options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    // Handle locale defaults and resolve files
    checkDefaultLocales(options)
    const gdprFiles = resolveGdprFiles(nuxt.options.rootDir, options)

    //create runtimeConfig
    nuxt.options.runtimeConfig.gdpr = defu(nuxt.options.runtimeConfig.gdpr, {
      consentTimeout: options.consentTimeout,
      defaultLocale: options.defaultLocale,
      locales: [ {
            code: gdprFiles.defaultLocale?.code,
            name: gdprFiles.defaultLocale?.name,
        }, ...gdprFiles.locales.map(locale => {
            return {
                name: locale.name,
                code: locale.code
            }
      })],
      consentRules: gdprFiles.consentRules.map(rule => rule.name)
    })

    // Transpile runtime
    nuxt.options.build.transpile.push(resolve('runtime'))

    // add auto imports
    addImports([{
      from: resolve('runtime/composables/gdpr.ts'),
      name: 'useGdpr'
    },{
      from: resolve('runtime/composables/locales.ts'),
      name: 'useGdprLocals'
    },{
      from: resolve('runtime/lang/loader.ts'),
      name: 'defineGdprLocale'
    },{
      from: resolve('runtime/consentRule/loader.ts'),
      name: 'defineConsentRule'
    }])

    //add components
    addComponent({
      name: 'GdprBanner',
      filePath: resolve('runtime/components/gdpr-banner.vue'),
      mode: 'client'
    })
  
    //generate template to import gdpr files
    generateTemplate(gdprFiles)

    addPlugin({
      src: resolve('runtime/plugins/gdpr.plugin.ts')
    })

  }
})
