import Link from 'next/link'
import { getLocale, getTranslations } from 'next-intl/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Home, Wrench } from 'lucide-react'

export default async function GlobalNotFound() {
  const locale = await getLocale()
  const t = await getTranslations('errors')

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-lg w-full hover:shadow-lg transition-shadow animate-build-up">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="text-6xl mb-4">🏗️</div>
            <h1 className="text-4xl font-bold mb-2">404 - İnşaat Alanı!</h1>
            <div className="text-muted-foreground mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="animate-pulse">⚠️</span>
                <span>BARET TAKMA ZORUNLU ALAN</span>
                <span className="animate-pulse">⚠️</span>
              </div>
              <p>
                Ups! Bu sayfa hala yapım aşamasında görünüyor. Ekibimiz
                projeleri yanlış yere koymuş olmalı!
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-sm">
              <div className="flex items-center gap-2 mb-1">
                <Wrench className="h-4 w-4 text-yellow-600" />
                <span className="font-medium">Şantiye Şefi Diyor Ki:</span>
              </div>
              <p className="text-yellow-700 dark:text-yellow-300">
                {t('foreman.reassurance')}
              </p>
            </div>

            <div className="pt-4">
              <Button asChild className="group">
                <Link href={`/${locale}/dashboard`}>
                  <Home className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  Operasyon Merkezine Dön
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-8 text-xs text-muted-foreground">
            <p>📝 Bu eksik sayfayı şantiye şefinize bildirin</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
