import { defineNuxtModule, createResolver, addComponent, addImports, addPlugin, logger, installModule } from '@nuxt/kit'
import { defu } from 'defu'
import { generateTemplate } from './template'
import type { ModuleOptions } from './types'
import { resolveGdprFiles } from './utils'
import { ensurePackageInstalled } from './packages'

type TextsDir = {
  cwd: string
  dir: string
}  

declare module '@nuxt/schema' {
  interface NuxtHooks {
    'texts:extend': (textsDirs: TextsDir[]) => void
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-gdpr',
    configKey: 'gdpr',
    compatibility: {
      nuxt: '^3.0.0'
    }
  },
  defaults: {
    consentTimeout: null,
    defaultLocale: 'en',
    dir: 'gdpr',
  },
  async setup (options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    //add hooks for dependency modules, must be called before modules are initialized
    //@ts-ignore
    nuxt.hook('texts:extend', function (textsDirs){
      textsDirs.push({
        cwd:resolve('runtime'),
        dir: 'texts'
      })
    })

    //install dependencies if not installed
    const requiredPackages = ['nuxt-texts', '@nuxtjs/tailwindcss']
    const gdprIndex = nuxt.options.modules.indexOf('nuxt-gdpr')
    for (const pkg of requiredPackages) {
      const installed = await ensurePackageInstalled(nuxt.options.rootDir, pkg, nuxt.options.modulesDir)
      if (!installed) {
        throw new Error(`Package ${pkg} is required for nuxt-gdpr to work`)
      }
      //check if module is installed after nuxt-gdpr
      if(nuxt.options.modules?.includes(pkg)){
        const moduleIndex = nuxt.options.modules.indexOf(pkg)
        if(moduleIndex < gdprIndex){
          throw new Error(`nuxt-gdpr must be listed before ${pkg} in nuxt.config`)
        }
      }else{
        //install module if not installed
        const pkgOptions = {} as any
        if(pkg === 'nuxt-texts' && options.defaultLocale){
          pkgOptions.defaultLocale = options.defaultLocale
        }
        await installModule(pkg, pkgOptions, nuxt)
      }
    }

    // Handle locale defaults and resolve files
    const consentRules = await resolveGdprFiles(nuxt.options.rootDir, options)

    //create runtimeConfig
    nuxt.options.runtimeConfig.gdpr = defu(nuxt.options.runtimeConfig.gdpr, {
      consentTimeout: options.consentTimeout,
      consentRules: consentRules.map(rule => rule.name)
    })

    // Transpile runtime
    nuxt.options.build.transpile.push(resolve('runtime'))

    //generate template to import gdpr files
    generateTemplate(consentRules)

    // add auto imports
    addImports([{
      from: resolve('runtime/composables/gdpr.ts'),
      name: 'useGdpr'
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

    addPlugin({
      src: resolve('runtime/plugins/gdpr.plugin.ts')
    })

  }
})
