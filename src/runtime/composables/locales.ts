import { useState } from '#app'
import { loadLocaleAsync } from '#build/gdpr.loader'
import { computed } from 'vue'
import type { Ref } from 'vue'
import type { GdprLocaleTexts, DefaultLanguageCode, GdprState, Language } from '../../types'


type PathsToStringProps<T> = T extends string ? [] : {
    [K in Extract<keyof T, string>]: [K, ...PathsToStringProps<T[K]>]
}[Extract<keyof T, string>];

type Join<T extends string[], D extends string> =
    T extends [] ? never :
    T extends [infer F] ? F :
    T extends [infer F, ...infer R] ?
    F extends string ? 
    `${F}${D}${Join<Extract<R, string[]>, D>}` : never : string;    

type DottedLocales = Join<PathsToStringProps<GdprLocaleTexts>, ".">


export type LocaleData = Record <DefaultLanguageCode, GdprLocaleTexts>


type UseGdprLocale = {
    t: (key: DottedLocales) => string
    activeLocale: Ref<DefaultLanguageCode | string>
    getLocales: () => Language[]
    setLocale: (languageCode: DefaultLanguageCode | string) => void
}

export function useGdprLocale() : UseGdprLocale {
    const gdrpState = useState<GdprState>('gdpr')

    const activeLocale = computed(() => gdrpState.value.activeLocale)
    const activeLocaleTexts = computed(() => gdrpState.value.localeTexts[activeLocale.value])

    const getLocales = () => {
        return gdrpState.value.locales
    }

    const setLocale = async (languageCode: DefaultLanguageCode | string) => {
        if(!gdrpState.value.localeTexts[languageCode]){
            gdrpState.value.localeTexts[languageCode] = await loadLocaleAsync(languageCode)
        }
        gdrpState.value.activeLocale = languageCode
    }

    const t = (key: DottedLocales) => {
        return key.split('.').reduce((o, k) => (o || {})[k], activeLocaleTexts.value) as string
    }

    return {
        activeLocale,
        getLocales,
        setLocale,
        t
    }
}