import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n/config'

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Never redirect to locale prefix for default locale
  localePrefix: 'as-needed'
})

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    '/(tr|en)/:path*',

    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/tr/pathnames`)
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
}