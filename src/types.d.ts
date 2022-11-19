/**
 * ISO 639-1 language codes
 */
 export type DefaultLanguageCode = 'en' | 'de'

 export type Language = {
    code: DefaultLanguageCode | string
    name: string
    src: string
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

 export type ConsentRuleState = {
    active: boolean
    mandatory?: boolean
    category?: string
 }

 export type GdprLocaleTexts = {
    dropdown: Dropdown
    banner: Banner
 }

export type GdprState = {
    _initialized: boolean
    accepted: boolean
    consentRequested: boolean
    banner: boolean
    consentRules: Record<string, boolean>
    activeLocale: DefaultLanguageCode | string
    locales: Language[]
    localeTexts: any
}

export type ConsentRuleBanner = {
    title: string,
    description: string,
}
  
export interface ConsentRule {
    name: string,
    src: string,
}

export type GdprFiles = {
    defaultLocale: Language
    locales: Language[] = []
    consentRules: ConsentRule[] = []
}

  
export interface ModuleOptions {
    /** 
     * Define a timeout for the consent banner to be shown again if user has declined it.
     * If not set, the banner will be shown on every page load.
     * */
    consentTimeout: number | null
    /**
    * Sets your default locale
    */
    defaultLocale: LanguageCode | string
    /**
     * Define locales
     */
    locales: (Language|DefaultLanguageCode)[]
    /**
     * Define consent rules
     */
    consentRules: ConsentRule[]
}