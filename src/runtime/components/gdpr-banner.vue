<template>
    <div v-if="banner" class="gdpr-banner">
        <div class="gdpr-banner__content">
            <div class="gdpr-banner__content__text">
                <p>
                {{ t('gdpr_banner.text') }}
                </p>
            </div>
            <div class="gdpr-banner__content__buttons">
                <button class="gdpr-banner__content__buttons__button" @click="acceptGdpr">
                {{ t('gdpr_banner.accept') }}
                </button>
                <button class="gdpr-banner__content__buttons__button" @click="declineGdpr">
                {{ t('gdpr_banner.decline') }}
                </button>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useGdprLocale } from '../composables/locals'
import { useGdpr } from '../composables/gdpr'

const { t } = useGdprLocale()

const { accept, decline, banner } = useGdpr()

const acceptGdpr = () => {
    accept()
}

const declineGdpr = () => {
    decline()
}

</script>
<style scoped>
    .gdpr-banner {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        display: flex;
        justify-content: center;
        align-items: flex-end;
    }
    .gdpr-banner__content {
        width: 80%;
        max-width: 800px;
        background-color: #fff;
        padding: 20px;
        margin-bottom: 50px;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    }
    .gdpr-banner__content__text {
        font-size: 1rem;
        margin-bottom: 20px;
    }
    .gdpr-banner__content__buttons {
        display: flex;
        justify-content: flex-end;
    }
    .gdpr-banner__content__buttons__button {
        margin-left: 10px;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        background-color: #000;
        color: #fff;
        font-size: 1.2rem;
        cursor: pointer;
    }

</style>