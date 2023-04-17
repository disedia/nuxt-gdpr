import { useLogger, createResolver } from '@nuxt/kit'
import { globby } from 'globby'
import type { ModuleOptions, GdprFiles } from './types'

const logger = useLogger('module:nuxt-gdpr')

export async function resolveGdprFiles(rootDir: string, options: ModuleOptions) {
    const gdprFiles = await globby(`${options.dir}/**/*.{ts,js}`, { cwd: rootDir })
    const { resolve } = createResolver(rootDir)

    //get name and src of consent rules
    const consentRules = gdprFiles.map(file => {
        const path = file.split("/")
        // get file name without extension
        let fileName = path.pop()
        fileName = fileName?.split('.').shift()
        return {
            key: fileName,
            name: fileName?.replace(/[^a-zA-Z0-9]/g, ''),
            src: resolve(file).split('.').shift()
        }
    })

    return consentRules
}