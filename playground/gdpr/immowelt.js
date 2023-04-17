export default defineConsentRule({
    name: 'Google Analytics',
    category: 'analytics',
    onAccept: async (nuxtApp) => {
        console.log('googleAnalytics accepted', nuxtApp)
    },
    onDecline: function () {
        console.log('googleAnalytics declined')
    }
})