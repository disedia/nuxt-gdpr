import { useState, useNuxtApp } from '#app'
import { loadConsentRule } from '#build/gdpr.loader'
import { computed } from 'vue'
import type { GdprState, ConsentRule } from '../../types'
import { saveData } from '../utils/localStorage'

export function useGdpr(){

    const gdrpState = useState<GdprState>('gdpr')

    const banner = computed(() => gdrpState.value.banner)
    const accepted = computed(() => gdrpState.value.accepted)
    const consentRequested = computed(() => gdrpState.value.consentRequested)

    const accept = async () => {
        gdrpState.value.accepted = true
        gdrpState.value.banner = false
        gdrpState.value.consentRequested = true
        for(const rule in gdrpState.value.consentRules){
            const consentRule : ConsentRule = loadConsentRule(rule)
            if(consentRule.onAccept){
                await consentRule.onAccept(useNuxtApp())
            }
        }
        saveData({accepted: true})
    }

    const decline = () => {
        gdrpState.value.accepted = false
        gdrpState.value.banner = false
        gdrpState.value.consentRequested = true
        //TODO: add consentTimeout
        saveData({accepted: false})
    }

    const getConsentRules = () => {
        const rules = []
        for(const rule in gdrpState.value.consentRules){
            const consentRule : ConsentRule = loadConsentRule(rule)
            rules.push({
                name: consentRule.name,
            })
        }
        return rules
    }


    return {
        accept,
        decline,
        banner,
        accepted,
        consentRequested,
        getConsentRules
    }
}

