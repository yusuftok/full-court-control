'use client'

import * as React from 'react'
import { NextIntlClientProvider } from 'next-intl'

export function LocaleProvider({
  children,
  messages,
  locale,
}: {
  children: React.ReactNode
  messages: Record<string, unknown>
  locale: string
}) {
  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      {children}
    </NextIntlClientProvider>
  )
}
