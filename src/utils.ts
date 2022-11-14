import { stat } from 'fs/promises'
import { useLogger } from '@nuxt/kit'
import { defaultLocales } from './runtime/lang/defaults'

export const logger = useLogger('nuxt-gdpr')

export function checkDefaults(options){
    if(!options.locales.some(l => l.code === options.defaultLocale)){
        const lang = defaultLocales.find(l => l.code === options.defaultLocale)
        if(lang){
            options.locales.push(lang)
        }
        else{
            logger.error(`Default locale ${options.defaultLocale} not found in locales. Please add it to the locales array or remove the defaultLocale option.`)
        }
    }
    //Check if all locale files are present

}