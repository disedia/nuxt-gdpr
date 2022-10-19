export function useGdpr() {
  const { t } = useGdprLocale();
  const { storage } = useGdprStorage();
  const { consentRules } = useGdprRules();
  const { consented, setConsented } = useGdprConsent(storage, consentRules);
  const { banner, showBanner, hideBanner } = useGdprBanner(consented, setConsented, t);
  const { consented: consentedRules, setConsented: setConsentedRules } = useGdprConsentRules(storage, consentRules);
  const { rules, showRules, hideRules } = useGdprRulesModal(consentedRules, setConsentedRules, t);
  const { show, hide } = useGdprModal(consented, showBanner, showRules);
  const { show: showBannerModal, hide: hideBannerModal } = useGdprBannerModal(consented, showBanner, hideBanner);
  const { show: showRulesModal, hide: hideRulesModal } = useGdprRulesModal(consented, showRules, hideRules);
  const { show: showBannerRulesModal, hide: hideBannerRulesModal } = useGdprBannerRulesModal(consented, showBanner, showRules, hideBanner, hideRules);
  return {
    banner,
    showBanner,
    hideBanner,
    rules,
    showRules,
    hideRules,
    show,
    hide,
    showBannerModal,
    hideBannerModal,
    showRulesModal,
    hideRulesModal,
    showBannerRulesModal,
    hideBannerRulesModal
  };
}
