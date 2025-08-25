"use client"

import * as React from "react"
import Link from "next/link"
import { Settings, FolderTree, User, Bell, Globe, Shield } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageContainer, PageHeader, PageContent } from "@/components/layout/page-container"
import { Breadcrumbs } from "@/components/navigation/breadcrumbs"

export default function SettingsPage() {
  const breadcrumbItems = [
    { label: "Ayarlar", href: "/settings" }
  ]

  const settingsCards = [
    {
      title: "Şablon Yönetimi",
      description: "İş bölüm şablonlarını yönetin ve yenilerini oluşturun",
      icon: FolderTree,
      href: "/settings/templates",
      color: "blue",
      available: true
    },
    {
      title: "Kullanıcı Tercihleri",
      description: "Profil bilgileri ve kişisel ayarlarınızı düzenleyin",
      icon: User,
      href: "/settings/profile",
      color: "green",
      available: false
    },
    {
      title: "Bildirim Ayarları",
      description: "E-posta ve push bildirimleri ayarlarınızı yönetin",
      icon: Bell,
      href: "/settings/notifications",
      color: "yellow",
      available: false
    },
    {
      title: "Dil ve Bölge",
      description: "Uygulama dili, zaman dilimi ve para birimi ayarları",
      icon: Globe,
      href: "/settings/localization",
      color: "purple",
      available: false
    },
    {
      title: "Güvenlik",
      description: "Şifre, iki faktörlü kimlik doğrulama ve güvenlik ayarları",
      icon: Shield,
      href: "/settings/security",
      color: "red",
      available: false
    }
  ]

  const getColorClasses = (color: string, available: boolean) => {
    if (!available) {
      return {
        border: "border-gray-200",
        bg: "bg-gray-50/50",
        icon: "text-gray-400",
        text: "text-gray-600"
      }
    }

    const colorMap = {
      blue: {
        border: "border-blue-200 border-l-4 border-l-blue-400",
        bg: "bg-gradient-to-r from-blue-50/30 to-transparent hover:from-blue-50/60",
        icon: "text-blue-600",
        text: "text-blue-800"
      },
      green: {
        border: "border-green-200 border-l-4 border-l-green-400",
        bg: "bg-gradient-to-r from-green-50/30 to-transparent hover:from-green-50/60",
        icon: "text-green-600",
        text: "text-green-800"
      },
      yellow: {
        border: "border-yellow-200 border-l-4 border-l-yellow-400",
        bg: "bg-gradient-to-r from-yellow-50/30 to-transparent hover:from-yellow-50/60",
        icon: "text-yellow-600",
        text: "text-yellow-800"
      },
      purple: {
        border: "border-purple-200 border-l-4 border-l-purple-400",
        bg: "bg-gradient-to-r from-purple-50/30 to-transparent hover:from-purple-50/60",
        icon: "text-purple-600",
        text: "text-purple-800"
      },
      red: {
        border: "border-red-200 border-l-4 border-l-red-400",
        bg: "bg-gradient-to-r from-red-50/30 to-transparent hover:from-red-50/60",
        icon: "text-red-600",
        text: "text-red-800"
      }
    }

    return colorMap[color as keyof typeof colorMap] || colorMap.blue
  }

  return (
    <PageContainer>
      <PageContent>
        <Breadcrumbs items={breadcrumbItems} className="mb-4" />
        
        <PageHeader
          title="Ayarlar ⚙️"
          description="Uygulama tercihlerinizi ve sistem ayarlarınızı yönetin"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-stagger">
          {settingsCards.map((setting, index) => {
            const colors = getColorClasses(setting.color, setting.available)
            const Icon = setting.icon
            
            if (!setting.available) {
              return (
                <Card 
                  key={setting.title}
                  className={`floating-card ${colors.border} ${colors.bg} transition-all duration-300 opacity-60 cursor-not-allowed`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`size-10 bg-gray-100 rounded-xl flex items-center justify-center`}>
                        <Icon className={`size-5 ${colors.icon}`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className={`text-heading-md ${colors.text} flex items-center gap-2`}>
                          {setting.title}
                          <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded-full text-xs font-bold">
                            YAKINDA
                          </span>
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">{setting.description}</p>
                  </CardContent>
                </Card>
              )
            }

            return (
              <Link key={setting.title} href={setting.href}>
                <Card 
                  className={`floating-card ${colors.border} ${colors.bg} transition-all duration-300 modern-hover cursor-pointer group`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`size-10 bg-gradient-to-br from-${setting.color}-100 to-${setting.color}-200 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                        <Icon className={`size-5 ${colors.icon}`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className={`text-heading-md ${colors.text} group-hover:text-primary transition-colors`}>
                          {setting.title}
                        </CardTitle>
                      </div>
                      <div className={`size-6 ${colors.icon} opacity-60 group-hover:translate-x-1 transition-transform`}>
                        →
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      {setting.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </PageContent>
    </PageContainer>
  )
}