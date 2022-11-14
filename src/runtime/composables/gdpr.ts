import { useState } from '#app'
import { computed } from 'vue'
import { getCookie, setCookie } from 'typescript-cookie'
import type { GdprState } from '../../types'

export function useGdpr(){

    const gdrpState = useState<GdprState>('gdpr')

    const banner = computed(() => gdrpState.value.banner)
    const accepted = computed(() => gdrpState.value.accepted)
    const consentRequested = computed(() => gdrpState.value.consentRequested)

    const accept = () => {
        gdrpState.value.accepted = true
        gdrpState.value.banner = false
        gdrpState.value.consentRequested = true
        setCookie('gdpr', JSON.stringify({
            accepted: true,
        }))
    }

    const decline = () => {
        gdrpState.value.accepted = false
        gdrpState.value.banner = false
        gdrpState.value.consentRequested = true
        //TODO: add consentTimeout
        setCookie('gdpr', JSON.stringify({
            accepted: false,
        }))
    }

    const registerConsentRule = () => {
        
    }

    const changeConsentRuleState = () => {

    }


    return {
        accept,
        decline,
        banner,
        accepted,
        consentRequested
    }
}

