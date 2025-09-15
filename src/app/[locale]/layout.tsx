import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales, Locale } from '@/i18n/config'
import { LocaleProvider } from '@/components/providers/locale-provider'

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return locales.map(locale => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  // Get messages for the locale
  const messages = await getMessages()

  return (
    <LocaleProvider messages={messages} locale={locale}>
      {children}
    </LocaleProvider>
  )
}
