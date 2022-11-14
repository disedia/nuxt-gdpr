import { defineNuxtPlugin, useRuntimeConfig, useState } from '#app'
import { registerLocale } from '#build/gdrp.loader'
import { getCookie } from 'typescript-cookie'
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
    // Register default locale only if not already registered on server (e.g. ssr=false)
    if(process.server || (process.client && !gdrpState.value._initialized)){
        const defaultLang = await registerLocale(gdrpState.value.activeLocale)
        defaultLang()
        gdrpState.value._initialized = true
    }
    // Get gdpr cookie
    if(process.client){
       const cookie = getCookie('gdpr')
        // Set gdpr state
        if(cookie){
            gdrpState.value.accepted = JSON.parse(cookie).accepted
            gdrpState.value.consentRequested = true
            gdrpState.value.banner = false
        }
    }
})