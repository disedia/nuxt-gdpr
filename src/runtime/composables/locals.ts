import registerLocals from '#build/gdrpI18n'

export type I18nLocales = 'en' | 'de'

type GdrpBanner = {
    text: string,
    accept: string,
    decline: string,
}

export type LocaleTypes = {
    gdpr_banner: GdrpBanner
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


export type Locales = Record <I18nLocales, LocaleTypes>

const locales = {} as Locales

type UseGdprLocale = {
    t: (key: DottedLocales) => string
}

const t = (key: DottedLocales) => {
    return key.split('.').reduce((o, k) => (o || {})[k], locales.en) as string
}

export function defineGdprLocales(localeCode: I18nLocales, locale: LocaleTypes){
    locales[localeCode] = locale
}

export function useGdprLocale() : UseGdprLocale {
    return {
        t
    }
}

registerLocals()