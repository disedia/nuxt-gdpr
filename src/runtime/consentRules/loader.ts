import { useState } from '#app'
import type { GdprState } from '../../types'

type ConsentRuleTexts = {
    title: string
    description: string
}

type ConsentRuleHelper = {

}

type ConsentRule = {
    name: string
    texts: ConsentRuleTexts | Record<string, ConsentRuleTexts>
    onAccept: (helper : ConsentRuleHelper) => void
    onDecline: (helper : ConsentRuleHelper) => void
}

export function defineConsentRule(consentRule: ConsentRule) {
    const gdprState = useState<GdprState>('gdpr')

}