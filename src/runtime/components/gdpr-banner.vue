<template>
    <div v-if="banner" class="gdpr-banner">
        <div class="gdpr-banner__modal">
            <div class="gdpr-banner__header">
                <div></div>
                <language-dropdown />
            </div>
            <div v-if="activeView === 'main'" class="gdpr-banner__main">
                <div class="gdpr-banner__content">
                    <div class="gdpr-banner__text">
                        <h1 class="gdpr-banner__text__title">{{ t('title') }}</h1>
                        <p class="gdpr-banner__text__p">
                        {{ t('description') }}
                        </p>
                    </div>
                </div>
                <div class="gdpr-banner__cta">
                    <div class="gdpr-banner__cta__link">
                        <a @click="setView('settings')">{{ t('main.consentSettings') }}</a>
                    </div>
                </div>
            </div>
            <div v-if="activeView === 'settings'" class="gdpr-banner__settings">
                <slot name="settings">
                    <template v-for="consentRule of getConsentRules()">
                        <slot name="consent-rule" :consent-rule="consentRule">
                            <strong>{{ consentRule.name }}</strong>
                        </slot>
                    </template>
                </slot>
            </div>
            <div class="gdpr-banner__footer">
                <button class="gdpr-banner__footer__button" @click="decline">
                    {{ t('footer.declineButton') }}
                </button>
                <button class="gdpr-banner__footer__button" @click="accept">
                {{ t('footer.acceptButton') }}
                </button>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import LanguageDropdown from './language-dropdown.vue'
import { ref, useTexts } from '#imports'
import { useGdpr } from '../composables/useGdpr'

const { t } = useTexts('gdpr')

const { accept, decline, banner, getConsentRules } = useGdpr()

const activeView = ref('main')

const setView = (view: 'main' | 'settings') => {
    activeView.value = view
}

</script>
<style scoped>
    .gdpr-banner {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1000;
        display: flex;
        justify-content: center;
        align-items: flex-end;
    }
    .gdpr-banner__modal {
        width: 80%;
        max-width: 800px;
        background-color: #fff;
        margin-bottom: 50px;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    }
    .gdpr-banner__header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 20px 0 20px;
    }
    .gdpr-banner__content {
        font-size: 1rem;
        padding: 20px;
        min-height: fit-content;
        max-height: auto;
        overflow-y: auto;
    }
    .gdpr-banner__text__title {
        font-size: 1.3rem;
        margin-bottom: 20px;
    }
    .gdpr-banner__text__p {
        font-size: 0.9em;
        line-height: 1.25;
    }
    .gdpr-banner__cta{
        padding-left: 20px;
        padding-top: 8px;
        padding-bottom: 8px;
    }
    .gdpr-banner__cta__link {
        font-size: 0.8em;
        text-align: left;
    }
    .gdpr-banner__footer {
        display: flex;
        gap: 10px;
        justify-content: space-between;
        padding: 16px;
        border-top: 1px solid #ccc;
    }
    .gdpr-banner__footer__button {
        appearance: button;
        backface-visibility: hidden;
        background-color: #405cf5;
        border-radius: 6px;
        border-width: 0;
        box-shadow: rgba(50, 50, 93, .1) 0 0 0 1px inset,rgba(50, 50, 93, .1) 0 2px 5px 0,rgba(0, 0, 0, .07) 0 1px 1px 0;
        box-sizing: border-box;
        color: #fff;
        cursor: pointer;
        font-family: -apple-system,system-ui,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif;
        font-size: 100%;
        height: 44px;
        line-height: 1.15;
        margin: 12px 0 0;
        outline: none;
        overflow: hidden;
        padding: 0 25px;
        position: relative;
        text-align: center;
        text-transform: none;
        transform: translateZ(0);
        transition: all .2s,box-shadow .08s ease-in;
        user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
        width: 100%;
    }
    .gdpr-banner__footer__button:focus {
        box-shadow: rgba(50, 50, 93, .1) 0 0 0 1px inset, rgba(50, 50, 93, .2) 0 6px 15px 0, rgba(0, 0, 0, .1) 0 2px 2px 0, rgba(50, 151, 211, .3) 0 0 0 4px;
    }
</style>