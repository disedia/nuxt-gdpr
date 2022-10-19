
import { ModuleOptions } from './module'

declare module '@nuxt/schema' {
  interface NuxtConfig { ['gdpr']?: Partial<ModuleOptions> }
  interface NuxtOptions { ['gdpr']?: ModuleOptions }
}


export { default } from './module'
