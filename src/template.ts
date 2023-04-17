import { addTemplate } from '@nuxt/kit'
import type { ConsentRuleConfig } from './types'


export function generateTemplate (consentRules: ConsentRuleConfig[]) {

    addTemplate({
        write: true,
        filename: 'gdpr.loader.ts',
        getContents() {
          return `
${consentRules.map(rule => `import ${rule.key} from '${rule.src}'`).join('\n')}

export function loadConsentRule(rule: string) : LoadConsentRule<ConsentRule> {
    ${consentRules.map(rule => `
    if(rule === '${rule.name}'){
        return ${rule.key}
    }`).join('\n')
    }
}`
        }
    })
}