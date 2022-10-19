import * as _nuxt_schema from '@nuxt/schema';

declare type ConsentRuleBanner = {
    title: string;
    description: string;
};
interface ConsentRule {
    name: string;
    banner: ConsentRuleBanner;
}
interface ModuleOptions {
    storage: 'cookie' | 'localstorage';
    locale: string | string[];
    consentRules: ConsentRule[];
    locales: Record<string, Record<string, string>>;
}
declare const _default: _nuxt_schema.NuxtModule<ModuleOptions>;

export { ConsentRule, ConsentRuleBanner, ModuleOptions, _default as default };
