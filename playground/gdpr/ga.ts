
export default defineConsentRule({
    name: 'googleAnalytics',
    onServer: (nuxtApp) => {
        console.log('onServer')
    },
    onAccept: async (nuxtApp) => {
        console.log('googleAnalytics accepted', nuxtApp)
    },
    onDecline: function () {
        console.log('googleAnalytics declined')
    }
})