<template>
    <div ref="dropdown" class="gdpr-banner__dropdown">
        <a @click="toggleDropdown" class="gdpr-banner__dropdown__button">
            <span class="gdpr-banner__dropdown__button__text">{{ t('dropdown.button') }} ({{activeLanguage}})</span>
            <span class="gdpr-banner__dropdown__button__icon">
                <svg width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M12 14.975q-.2 0-.387-.075q-.188-.075-.313-.2l-4.6-4.6q-.275-.275-.275-.7q0-.425.275-.7q.275-.275.7-.275q.425 0 .7.275l3.9 3.9l3.9-3.9q.275-.275.7-.275q.425 0 .7.275q.275.275.275.7q0 .425-.275.7l-4.6 4.6q-.15.15-.325.212q-.175.063-.375.063Z"/></svg>
            </span>
        </a>
        <div v-if="isDropdown" class="gdpr-banner__dropdown__content">
            <div v-for="lang in getLanguages()" @click="changeLanguage(lang)" class="gdpr-banner__dropdown__content__item">
                {{ lang }}
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
    import { ref } from 'vue'
    import { onClickOutside } from '@vueuse/core'
    import { useGdprLocale } from '../composables/locales'
    import type { LanguageCodes } from '../composables/locales'

    const { t, getLanguages, setLanguage, activeLanguage } = useGdprLocale()

    const isDropdown = ref(false)
    const dropdown = ref<HTMLElement | null>(null)

    onClickOutside(dropdown, () => {
        if(isDropdown.value) {
            isDropdown.value = false
        }
    })

    const toggleDropdown = () => {
        isDropdown.value = !isDropdown.value
    }

    const changeLanguage = (lang: LanguageCodes) => {
        setLanguage(lang)
        toggleDropdown()
    }
</script>
<style scoped>
    .gdpr-banner__dropdown__button {
        appearance: none;
        background-color: #FAFBFC;
        border: 1px solid rgba(27, 31, 35, 0.15);
        border-radius: 6px;
        box-shadow: rgba(27, 31, 35, 0.04) 0 1px 0, rgba(255, 255, 255, 0.25) 0 1px 0 inset;
        box-sizing: border-box;
        color: #24292E;
        cursor: pointer;
        display: inline-block;
        font-family: -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
        list-style: none;
        padding: 6px 16px;
        position: relative;
        transition: background-color 0.2s cubic-bezier(0.3, 0, 0.5, 1);
        user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
        vertical-align: middle;
        white-space: nowrap;
        word-wrap: break-word;
    }

    .gdpr-banner__dropdown__button:hover {
        background-color: #F3F4F6;
        text-decoration: none;
        transition-duration: 0.1s;
    }

    .gdpr-banner__dropdown__button:disabled {
        background-color: #FAFBFC;
        border-color: rgba(27, 31, 35, 0.15);
        color: #959DA5;
        cursor: default;
    }

    .gdpr-banner__dropdown__button:active {
        background-color: #EDEFF2;
        box-shadow: rgba(225, 228, 232, 0.2) 0 1px 0 inset;
        transition: none 0s;
    }

    .gdpr-banner__dropdown__button:focus {
        outline: 1px transparent;
    }

    .gdpr-banner__dropdown__button:before {
        display: none;
    }

    .gdpr-banner__dropdown__button:-webkit-details-marker {
        display: none;
    }
    .gdpr-banner__dropdown {
        position: relative;
        display: inline-block;
    }
    .gdpr-banner__dropdown__button{
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border: 1px solid rgb(89, 89, 89);
        padding: 4px;
    }
    .gdpr-banner__dropdown__button__text {
        margin-right: 10px;
    }

    .gdpr-banner__dropdown__content {
        position: absolute;
        background-color: #f9f9f9;
        border: 1px solid #f1f1f1;
        border-radius: 5px;
        min-width: 160px;
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
        z-index: 1;
    }
    .gdpr-banner__dropdown__content__item {
        cursor: pointer;
        color: black;
        padding: 12px 16px;
        text-decoration: none;
        display: block;
    }
    .gdpr-banner__dropdown__content__item:hover {
        background-color: #f1f1f1;
    }
</style>