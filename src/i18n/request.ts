import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ locale }) => {
  // Fallback to 'tr' if locale is undefined
  const resolvedLocale = locale || 'tr'
  
  return {
    locale: resolvedLocale,
    messages: (await import(`./locales/${resolvedLocale}.json`)).default
  }
})