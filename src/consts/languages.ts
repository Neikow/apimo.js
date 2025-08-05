export const API_LANGUAGES = [
  'fr',
  'it',
  'de',
  'es',
  'en',
  'nl',
  'zh',
  'ru',
  'sv',
  'ar',
  'he',
  'nb',
  'pt',
  'fa',
  'lb',
  'km',
  'tr',
  'lo',
] as const

export type ApiCulture = (typeof API_LANGUAGES)[number]
