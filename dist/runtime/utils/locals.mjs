const locales = {
  en: {
    gdpr_banner: {
      text: "This website uses cookies to ensure you get the best experience on our website.",
      accept: "Accept",
      decline: "Decline"
    }
  },
  de: {
    gdpr_banner: {
      text: "Diese Website verwendet Cookies, um sicherzustellen, dass Sie die beste Erfahrung auf unserer Website erhalten.",
      accept: "Akzeptieren",
      decline: "Ablehnen"
    }
  }
};
export function useGdprLocale() {
  const t = (key) => {
    return key.split(".").reduce((o, k) => (o || {})[k], locales.de);
  };
  return {
    t
  };
}
