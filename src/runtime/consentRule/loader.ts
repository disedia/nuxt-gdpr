import type { NuxtApp } from '#app'

type ConsentRuleTexts = {
    title: string
    description: string
}

type ConsentRuleHelper = {

}

type ConsentRule = {
    name: string
    active?: boolean
    mandatory?: boolean
    category?: string
    texts?: ConsentRuleTexts | Record<string, ConsentRuleTexts> | null
    onServer?: (nuxtApp: NuxtApp) => Promise<void> | void
    onAccept?: (helper : ConsentRuleHelper) => Promise<void> | void
    onDecline?: (helper : ConsentRuleHelper) => Promise<void> | void
}

export function defineConsentRule(consentRule: ConsentRule) {
    return consentRule
}