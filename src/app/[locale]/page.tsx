'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import {
  Building2,
  BarChart3,
  Rocket,
  Users,
  KeyRound,
  Sparkles,
} from 'lucide-react'

export default function Home() {
  const t = useTranslations('common')
  const locale = useLocale()
  return (
    <div className="min-h-screen flex items-center justify-center glass-background overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 gradient-primary rounded-full opacity-20 animate-float-tools"></div>
        <div
          className="absolute -bottom-40 -left-40 w-60 h-60 bg-secondary rounded-full opacity-30 animate-float-tools"
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className="absolute top-1/2 left-1/4 w-32 h-32 bg-accent rounded-full opacity-10 animate-float-tools"
          style={{ animationDelay: '4s' }}
        ></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center p-8">
        {/* Hero Logo */}
        <div className="flex justify-center mb-6">
          <div
            className="size-20 gradient-primary rounded-2xl flex items-center justify-center modern-hover shadow-glass"
            style={{ animation: 'float 6s ease-in-out infinite' }}
          >
            <Building2 className="size-10 text-white" />
          </div>
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent animate-spring-in">
          Full Court Control Pro
        </h1>

        {/* Hero Subtitle */}
        <p
          className="text-xl md:text-2xl text-muted-foreground mb-4 animate-fade-up"
          style={{ animationDelay: '0.2s' }}
        >
          Modern İnşaat Proje Yönetim Platformu
        </p>

        {/* Feature Badges */}
        <div
          className="flex flex-wrap justify-center gap-2 mb-8 animate-fade-up"
          style={{ animationDelay: '0.4s' }}
        >
          <span className="glass px-3 py-1 rounded-full text-sm text-muted-foreground border border-white/10">
            ⚡ Hızlı Kurulum
          </span>
          <span className="glass px-3 py-1 rounded-full text-sm text-muted-foreground border border-white/10">
            📊 Gerçek Zamanlı İzleme
          </span>
          <span className="glass px-3 py-1 rounded-full text-sm text-muted-foreground border border-white/10">
            🔒 Güvenli & Modern
          </span>
        </div>

        {/* Demo Navigation Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto animate-fade-up"
          style={{ animationDelay: '0.6s' }}
        >
          <Link
            href={`/${locale}/dashboard`}
            className="group glass rounded-2xl p-6 modern-hover border border-white/10 transition-all duration-300 hover:scale-105 flex flex-col items-center gap-3"
          >
            <div className="size-12 gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <BarChart3 className="size-6 text-white" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                İzleme ve Operasyon Merkezi
              </h3>
              <p className="text-sm text-muted-foreground">
                Sahadaki tüm faaliyetlerin kuşbakışı görünümü
              </p>
            </div>
            <div className="opacity-0 group-hover:opacity-100 text-xs text-primary font-medium transition-opacity">
              Keşfetmeye Başla →
            </div>
          </Link>

          <Link
            href={`/${locale}/projects`}
            className="group glass rounded-2xl p-6 modern-hover border border-white/10 transition-all duration-300 hover:scale-105 flex flex-col items-center gap-3"
          >
            <div className="size-12 gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Building2 className="size-6 text-white" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                Projeler
              </h3>
              <p className="text-sm text-muted-foreground">
                İnşaat projelerinizi başlangıçtan teslime yönetin
              </p>
            </div>
            <div className="opacity-0 group-hover:opacity-100 text-xs text-primary font-medium transition-opacity">
              Projeleri Görüntüle →
            </div>
          </Link>

          <Link
            href={`/${locale}/advanced-demo`}
            className="group glass rounded-2xl p-6 modern-hover border border-white/10 transition-all duration-300 hover:scale-105 flex flex-col items-center gap-3"
          >
            <div className="size-12 gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Rocket className="size-6 text-white" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                Gelişmiş Demo
              </h3>
              <p className="text-sm text-muted-foreground">
                Tüm özellikleri keşfet - tam kapasiteli deneyim
              </p>
            </div>
            <div className="opacity-0 group-hover:opacity-100 text-xs text-primary font-medium transition-opacity">
              {t('tryDemo')} →
            </div>
          </Link>

          <Link
            href={`/${locale}/templates`}
            className="group glass rounded-2xl p-6 modern-hover border border-white/10 transition-all duration-300 hover:scale-105 flex flex-col items-center gap-3"
          >
            <div className="size-12 gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="size-6 text-white" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                Bölüm Şablonları
              </h3>
              <p className="text-sm text-muted-foreground">
                Yeniden kullanılabilir proje şablonları oluştur
              </p>
            </div>
            <div className="opacity-0 group-hover:opacity-100 text-xs text-primary font-medium transition-opacity">
              Şablonları İncele →
            </div>
          </Link>

          <Link
            href={`/${locale}/divisions`}
            className="group glass rounded-2xl p-6 modern-hover border border-white/10 transition-all duration-300 hover:scale-105 flex flex-col items-center gap-3"
          >
            <div className="size-12 gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="size-6 text-white" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                Proje Bölümleri
              </h3>
              <p className="text-sm text-muted-foreground">
                İnşaat hiyerarşisini tanımla ve yönet
              </p>
            </div>
            <div className="opacity-0 group-hover:opacity-100 text-xs text-primary font-medium transition-opacity">
              Bölümlere Bak →
            </div>
          </Link>

          <Link
            href={`/${locale}/auth/signin`}
            className="group glass rounded-2xl p-6 modern-hover border border-white/10 transition-all duration-300 hover:scale-105 flex flex-col items-center gap-3"
          >
            <div className="size-12 gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <KeyRound className="size-6 text-white" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                Giriş Yap
              </h3>
              <p className="text-sm text-muted-foreground">
                Kişiselleştirilmiş deneyim için giriş yapın
              </p>
            </div>
            <div className="opacity-0 group-hover:opacity-100 text-xs text-primary font-medium transition-opacity">
              Giriş Ekranına Git →
            </div>
          </Link>
        </div>

        {/* Bottom Info */}
        <div
          className="mt-12 animate-fade-up"
          style={{ animationDelay: '0.8s' }}
        >
          <p className="text-sm text-muted-foreground glass px-4 py-2 rounded-full border border-white/10 inline-block">
            🎯 Tüm demolar örnek verilerle çalışır - backend gerektirmez!
          </p>
        </div>
      </div>
    </div>
  )
}
