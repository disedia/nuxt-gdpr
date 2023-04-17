import type { NuxtApp } from '#app'

 type MainTexts = {
    title: string
    description: string
    languageDropdown: string
    consentSettings: string
 }

 type FooterTexts = {
    acceptButton: string
    declineButton: string
 }

 export type GdprLocaleTexts = {
    main: MainTexts
    footer: FooterTexts
 }

 export type ConsentRuleState = {
    active: boolean
    mandatory?: boolean
    category?: string
 }


export type GdprState = {
    _initialized: boolean
    accepted: boolean
    consentRequested: boolean
    banner: boolean
    consentRules: Record<string, boolean>
}

export type ConsentRuleBanner = {
    title: string
    description: string
}
  
export type ConsentRuleConfig = {
    key?: string
    name: string
    src: string
}

type ConsentRuleTexts = {
    title: string
    description: string
}

export type ConsentRule = {
    name: string
    active?: boolean
    mandatory?: boolean
    category?: string
    texts?: ConsentRuleTexts | Record<string, ConsentRuleTexts> | null
    onServer?: (nuxtApp: NuxtApp) => Promise<void> | void
    onAccept?: (nuxtApp: NuxtApp) => Promise<void> | void
    onDecline?: (nuxtApp: NuxtApp) => Promise<void> | void
}

export type GdprFiles = {
    defaultLocale: Language
    locales: Language[] = []
    consentRules: ConsentRuleConfig[] = []
}

export type LoadConsentRule = (key: string) => ConsentRule

  
export interface ModuleOptions {
    /** 
     * Define a timeout for the consent banner to be shown again if user has declined it.
     * If not set, the banner will be shown on every page load.
     * */
    consentTimeout: number | null
    /**
     * Define consent rule dir
     */
    dir: string

    defaultLocale: Language
}