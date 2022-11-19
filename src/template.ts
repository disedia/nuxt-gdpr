import { addTemplate } from '@nuxt/kit'
import type { GdprFiles } from './types'


export function generateTemplate (files: GdprFiles) {

    addTemplate({
        write: true,
        filename: 'gdpr.loader.ts',
        getContents() {
          return `
import ${files.defaultLocale.code} from '${files.defaultLocale.src}'
${files.consentRules.map(rule => `import ${rule.name} from '${rule.src}'`).join('\n')}

export function loadDefaultLocale() {
    return ${files.defaultLocale.code}
}

export function loadConsentRule(rule: string) {
    ${files.consentRules.map(rule => `
    if(rule === '${rule.name}'){
        return ${rule.name}
    }`).join('\n')
    }
}

export async function loadLocaleAsync(lang: string): Promise<() => Function> {
    ${files.locales.map(l => `
    if(lang === '${l.code}'){
        return await import('${l.src}').then(module=>module?.default);
    }`).join('\n')
    }
}`
        }
    })
}