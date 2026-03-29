const savedLocale = localStorage.getItem('language') || 'uk'

window.i18n = VueI18n.createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'en',
  messages: {
    uk: window.locale_uk,
    en: window.locale_en,
  },
})
