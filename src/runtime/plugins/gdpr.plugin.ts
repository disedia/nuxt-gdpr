import { defineNuxtPlugin, useRuntimeConfig, useState } from '#app'
import { loadDefaultLocale, loadConsentRule } from '#build/gdpr.loader'
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
        consentRules: {},
        activeLocale: gdprConfig.defaultLocale,
        locales: gdprConfig.locales,
        localeTexts: {}
    }))
    // Register default locale and consent rules server side or client side if ssr is disabled
    if(process.server || (process.client && !gdrpState.value._initialized)){
        //Register default locale
        gdrpState.value.localeTexts[gdrpState.value.activeLocale] = loadDefaultLocale()
        //Register consent rules and run onServer hook
        gdprConfig.consentRules.map(async (rule: string) => {
            const consentRule = loadConsentRule(rule)
            gdrpState.value.consentRules[rule] = false
            if(process.server){
                await consentRule.onServer(nuxtApp)
            }
        })
        gdrpState.value._initialized = true
    }
    // Get gdpr data from local storage
    if(process.client){
        subscribe(gdrpState)
        const data = loadData()
        // Set gdpr state if empty
        if(Object.keys(data).length !== 0){
            gdrpState.value.accepted = data?.accepted || false
            gdrpState.value.consentRequested = true
            gdrpState.value.banner = false
            if(gdrpState.value.accepted){
                // Run registered rules on client if consent is already given
                for(const rule in gdrpState.value.consentRules){
                    const consentRule = loadConsentRule(rule)
                    if(consentRule.onAccept){
                        await consentRule.onAccept(nuxtApp)
                    }
                }
            }
        }
    }
})