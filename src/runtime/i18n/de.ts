import { defineGdprLocale } from '#imports'

export default () => defineGdprLocale('de', {
    languageName: 'Deutsch',
    dropdown: {
        button: 'Sprache'
    },
    banner: {
        title: 'Wir schätzen Ihre Privatsphäre',
        text: 'Wir verwenden Cookies, um sicherzustellen, dass wir Ihnen die bestmögliche Erfahrung auf unserer Website bieten. Wenn Sie diese Website weiterhin nutzen, gehen wir davon aus, dass Sie damit einverstanden sind.',
        accept: 'Akzeptieren und Schließen',
        decline: 'Ablehnen'
    }
})