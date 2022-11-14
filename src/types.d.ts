/**
 * ISO 639-1 language codes
 */
 export type LanguageCode = 'en' | 'de'

 export type Language = {
    code: LanguageCode | string,
    name: string
 }

 type Banner = {
     title: string
     text: string
     accept: string
     decline: string
 }
 
 type Dropdown = {
     button: string
 }

 export type GdprLocaleTexts = {
    languageName: string
    dropdown: Dropdown
    banner: Banner
}

export type GdprState = {
    _initialized: boolean
    accepted: boolean
    consentRequested: boolean
    banner: boolean
    consentRules: ConsentRule[]
    activeLocale: LanguageCode | string
    locales: Language[]
    texts: GdprLocaleTexts | {}
}