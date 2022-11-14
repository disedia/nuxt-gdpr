import { useState } from '#app'
import type { GdprLocaleTexts, LanguageCode, GdprState } from '../../types'

export function defineGdprLocale(languageCode: LanguageCode, texts: GdprLocaleTexts) {
    const gdrpLocales = useState<GdprState>('gdpr')
    if(!gdrpLocales.value.texts[languageCode]){
        gdrpLocales.value.texts[languageCode] = texts
    }
}