import { useState } from '#app'
import { onBeforeMount, computed } from 'vue'

type GdprState = {
    accepted: boolean,
    consentRequested: boolean,
    banner: boolean
}
type Storage = {
    accepted: boolean,
}

const getFromStorage = () => {
    const storageString = localStorage.getItem('gdpr')
    let storageValue = {} as Storage
    if (storageString) {
        storageValue = JSON.parse(storageString)
    }
    return storageValue
}

const saveToStorage = (key: keyof GdprState, value: any) => {
    const storageValue = getFromStorage()
    localStorage.setItem('gdpr', JSON.stringify({ ...storageValue, [key]: value }))
}

export function useGdpr(){

    const _gdrpInitialized = useState<boolean>('gdpr-initialized', () => (false))

    const gdrpState = useState<GdprState>('gdpr', () => ({
        accepted: false,
        consentRequested: false,
        banner: true
    }))

    const banner = computed(() => gdrpState.value.banner)
    const accepted = computed(() => gdrpState.value.accepted)
    const consentRequested = computed(() => gdrpState.value.consentRequested)

    onBeforeMount(()=>{
        if(!_gdrpInitialized.value){
            const storageGdrp = getFromStorage()
            if(Object.keys(storageGdrp).length === 0){
                gdrpState.value.banner = true
                gdrpState.value.consentRequested = true
            }else{
                gdrpState.value.consentRequested = true
                gdrpState.value.banner = false
                gdrpState.value.accepted = storageGdrp.accepted
            }
            _gdrpInitialized.value = true
        }
    })

    const accept = () => {
        gdrpState.value = {
            accepted: true,
            consentRequested: true,
            banner: false
        }
        saveToStorage('accepted', true)
    }

    const decline = () => {
        gdrpState.value = {
            accepted: false,
            consentRequested: true,
            banner: false
        }
        saveToStorage('accepted', false)
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

