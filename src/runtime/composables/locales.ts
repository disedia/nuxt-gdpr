import { useState, useRuntimeConfig } from '#app'
import registerLocales from '#build/gdrpI18n'
import { computed } from 'vue'
import type { Ref } from 'vue'

/**
 * ISO 639-1 language codes
 */
export type LanguageCodes = 'en' | 'de'

type GdprBanner = {
    title: string
    text: string
    accept: string
    decline: string
}

type GdrpDropdown = {
    button: string
}

type GdrpLocaleState = {
    _initialized: boolean
    activeLanguage: LanguageCodes
    languages: LanguageCodes[]
    locales: Locales | {}
}

export type LocaleTypes = {
    languageName: string
    dropdown: GdrpDropdown
    banner: GdprBanner
}

type PathsToStringProps<T> = T extends string ? [] : {
    [K in Extract<keyof T, string>]: [K, ...PathsToStringProps<T[K]>]
}[Extract<keyof T, string>];

type Join<T extends string[], D extends string> =
    T extends [] ? never :
    T extends [infer F] ? F :
    T extends [infer F, ...infer R] ?
    F extends string ? 
    `${F}${D}${Join<Extract<R, string[]>, D>}` : never : string;    

type DottedLocales = Join<PathsToStringProps<LocaleTypes>, ".">


export type Locales = Record <LanguageCodes, LocaleTypes>


type UseGdprLocale = {
    t: (key: DottedLocales) => string
    activeLanguage: Ref<LanguageCodes>
    getLanguages: () => LanguageCodes[]
    setLanguage: (language: LanguageCodes) => void
}

export function defineGdprLocale(languageCode: LanguageCodes, locale: LocaleTypes){
    const gdrpLocales = useState<GdrpLocaleState>('gdpr-locales')
    gdrpLocales.value.languages.push(languageCode)
    gdrpLocales.value.locales[languageCode] = locale
}

export function useGdprLocale() : UseGdprLocale {
    const gdrpLocales = useState<GdrpLocaleState>('gdpr-locales', () => ({
        _initialized: false,
        activeLanguage: useRuntimeConfig().public.gdpr.defaultLocale,
        languages: [],
        locales: {}
    }))

    if(!gdrpLocales.value._initialized){
        registerLocales()
        gdrpLocales.value._initialized = true
    }

    const activeLanguage = computed(() => gdrpLocales.value.activeLanguage)
    const activeLocales = computed(() => gdrpLocales.value.locales[activeLanguage.value])

    const getLanguages = () => {
        return gdrpLocales.value.languages
    }

    const setLanguage = (languageCode: LanguageCodes) => {
        gdrpLocales.value.activeLanguage = languageCode
    }

    const t = (key: DottedLocales) => {
        return key.split('.').reduce((o, k) => (o || {})[k], activeLocales.value) as string
    }

    return {
        activeLanguage,
        getLanguages,
        setLanguage,
        t
    }
}