import type { GdprState } from '../types'
import type { Ref } from 'vue'

type StorageData = {
    accepted?: boolean
}

export function loadData(): StorageData {
    const data = localStorage.getItem('gdpr')
    if(data){
        return JSON.parse(data)
    }
    return {}
}

export function saveData(data: StorageData){
    const storageData = loadData()
    localStorage.setItem('gdpr', JSON.stringify(Object.assign(storageData, data)))
}

export function subscribe(gdprState: Ref<GdprState>){
    window.addEventListener('storage', (event) => {
        if(event.key === 'gdpr'){
            if(event.isTrusted && event.newValue === null){
                gdprState.value.accepted = false
                gdprState.value.banner = true
                gdprState.value.consentRequested = false
            }
        }
    })
}