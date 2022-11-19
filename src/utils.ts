import { createResolver, useLogger } from '@nuxt/kit'
import { defaultLocales } from './runtime/lang/defaults'
import type { ModuleOptions, GdprFiles } from './types'

const logger = useLogger('module:nuxt-gdpr')

export function checkDefaultLocales(options: ModuleOptions){
    const isInDefaultLocales = defaultLocales.some(l => l.code === options.defaultLocale)
    const isInConfigLocales = options.locales.some(l => {
        if(typeof l === 'string'){
            return l === options.defaultLocale
        }else{
            return l.code === options.defaultLocale
        }
    })
    if(!isInDefaultLocales && !isInConfigLocales){
        logger.warn(`Could not find default locale '${options.defaultLocale}'.`)
        options.defaultLocale = 'en'
        options.locales.push('en')
    }
    if(isInDefaultLocales && !isInConfigLocales){
        options.locales.push(options.defaultLocale)
    }
}

export function resolveGdprFiles(rootDir: string, options: ModuleOptions) {
    const { resolve } = createResolver(rootDir)
    const { resolve: resolveDefault } = createResolver(import.meta.url)

    const gdprFiles = {
        defaultLocale: {
            name: '',
            code: '',
            src: ''
        },
        locales: [],
        consentRules: []
    } as GdprFiles
    for (const locale of options.locales) {
        // locale is a string and so it must be a default locale from module
        if (typeof locale === 'string') {
            const defaultLocale = defaultLocales.find(l => l.code === locale)
            if(defaultLocale){
                const resolvedLocale = {
                    name: defaultLocale.name,
                    src: resolveDefault('runtime/lang/defaults', locale),
                    code: defaultLocale.code,
                }
                if(options.defaultLocale === locale){
                    gdprFiles.defaultLocale = resolvedLocale
                }else{
                    gdprFiles.locales.push(resolvedLocale)
                }
            }else{
                logger.warn(`Locale ${locale} is not a default locale and will be ignored.`)
            }
        }
        else {
            if (!locale.code || !locale.src || !locale.name) {
                logger.warn(`Locale "${locale?.name}" is missing a property and will be ignored. Please add a code, src and name property to the locale object.`);
            }else{
                const resolvedLocale = {
                    name: locale.name,
                    src: resolve(locale.src),
                    code: locale.code,
                }
                if(options.defaultLocale === locale.code){
                    gdprFiles.defaultLocale = resolvedLocale
                }else{
                    gdprFiles.locales.push(resolvedLocale)
                }
            }
        }
    }
    for (const consentRule of options.consentRules) {
        if (typeof consentRule === 'string') {
            logger.error(`Consent rule "${consentRule}" is not a valid consent rule. Please add a src property to the consent rule object.`)
        }
        else {
            if (!consentRule.name || !consentRule.src) {
                logger.warn(`Consent rule ${consentRule} does not have a all nessessary properties. Please add a name and src property to the consent rule object.`);
            }else{
                gdprFiles.consentRules.push({
                    name: consentRule.name,
                    src: resolve(consentRule.src)
                })
            }
        }
    }
    return gdprFiles
}