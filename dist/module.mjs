import { fileURLToPath } from 'url';
import { defineNuxtModule, createResolver, addImports, addComponent } from '@nuxt/kit';

const module = defineNuxtModule({
  meta: {
    name: "nuxt-gdpr",
    configKey: "gdpr",
    compatibility: {
      nuxt: "^3.0.0-rc.3"
    }
  },
  defaults: {
    storage: "localstorage",
    locale: "en",
    consentRules: [],
    locales: {}
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);
    const runtimeDir = fileURLToPath(new URL("./runtime", import.meta.url));
    nuxt.options.build.transpile.push(runtimeDir);
    addImports([{
      from: resolve(runtimeDir, "composables/gdpr.ts"),
      name: "useGdpr"
    }]);
    addComponent({
      name: "GdprBanner",
      filePath: `${resolve(runtimeDir, "components")}/gdpr-banner.vue`
    });
  }
});

export { module as default };
