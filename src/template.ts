import { addTemplate, createResolver } from '@nuxt/kit'
import type { LanguageCode, Language } from './types'

type GenerateTemplateOptions = {
    defaultLocale: LanguageCode | string
    fallbackLocale: LanguageCode | string
    locales: Language[]
    langDir?: string | null
}

export function generateTemplate (options: GenerateTemplateOptions) {
    const { resolve } = createResolver(import.meta.url)
    addTemplate({
        write: true,
        filename: 'gdrp.loader.ts',
        getContents() {
          return `
export async function registerLocale(lang): Promise<() => Function> {
    ${options.locales.map(l => `
    if(lang === '${l.code}'){
        return await import('${resolve('runtime/lang/defaults', l.code)}').then(module=>module?.default);
    }`).join('\n')
    }
    return await import('${resolve('runtime/lang/defaults', options.fallbackLocale)}').then(module=>module?.default);
}`
        }
    })
}