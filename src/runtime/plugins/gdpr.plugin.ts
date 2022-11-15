import { defineNuxtPlugin, useRuntimeConfig, useState } from '#app'
import { registerLocale } from '#build/gdrp.loader'
import { loadData, subscribe } from '../localStorage'

import type { GdprState } from '../../types'

export default defineNuxtPlugin(async (nuxtApp) => {
    const {gdpr: gdprConfig} = useRuntimeConfig()
    // Init gdpr state
    const gdrpState = useState<GdprState>('gdpr', () => ({
        _initialized: false,
        accepted: false,
        consentRequested: false,
        banner: true,
        consentRules: [],
        activeLocale: gdprConfig.defaultLocale,
        locales: gdprConfig.locales,
        texts: {}
    }))
    // Register default locale and consent rules server side or client side if ssr is disabled
    if(process.server || (process.client && !gdrpState.value._initialized)){
        //Register default locale
        const defaultLang = await registerLocale(gdrpState.value.activeLocale)
        defaultLang()
        //Register constent rules

        gdrpState.value._initialized = true
    }
    // Get gdpr data from local storage
    if(process.client){
        subscribe(gdrpState)
        const data = loadData()
        // Set gdpr state if empty
        if(Object.keys(data).length !== 0){
            gdrpState.value.accepted = data?.accepted
            gdrpState.value.consentRequested = true
            gdrpState.value.banner = false
            if(gdrpState.value.accepted){
                // Run registered rules on client if consent is already given

            }
        }
    }
})