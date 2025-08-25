"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Building2, 
  Command, 
  Wrench, 
  Users, 
  Settings,
  Menu,
  X,
  FolderTree
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navigationItems = [
  {
    title: "Operasyon Merkezi",
    href: "/dashboard",
    icon: Command,
    emoji: "🏗️"
  },
  {
    title: "Projeler",
    href: "/projects",
    icon: Building2,
    emoji: "🏢"
  },
  {
    title: "İşler",
    href: "/tasks",
    icon: Wrench,
    emoji: "🔨"
  },
  {
    title: "Ekip",
    href: "/subcontractors",
    icon: Users,
    emoji: "👷"
  },
  {
    title: "Şablonlar",
    href: "/settings/templates",
    icon: FolderTree,
    emoji: "📋"
  },
  {
    title: "Ayarlar",
    href: "/settings",
    icon: Settings,
    emoji: "⚙️"
  }
]

interface SidebarProps {
  className?: string
  isMobile?: boolean
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ className, isMobile = false, isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [logoClickCount, setLogoClickCount] = React.useState(0)
  const [showEasterEgg, setShowEasterEgg] = React.useState(false)
  
  const handleLogoClick = () => {
    setLogoClickCount(prev => prev + 1)
    if (logoClickCount === 4) { // 5 clicks total (0-4)
      setShowEasterEgg(true)
      setTimeout(() => {
        setShowEasterEgg(false)
        setLogoClickCount(0)
      }, 3000)
    }
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo and Brand */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={handleLogoClick}>
          <div className={cn(
            "size-8 gradient-primary rounded-xl flex items-center justify-center modern-hover",
            showEasterEgg && "mega-celebration animate-tada"
          )} style={{ animation: 'float 6s ease-in-out infinite' }}>
            <Building2 className="size-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm group-hover:text-primary transition-colors">
              {showEasterEgg ? "Süper İnşaat Üstadı! 🏆" : "Full Court Control Pro"}
            </span>
            <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
              {showEasterEgg ? "Gizli modu keşfettin! 🎉" : "İnşaat Yönetim Platformu"}
            </span>
          </div>
        </div>
        {isMobile && onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="size-4" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navigationItems.map((item) => {
          // More specific active check to prevent multiple items being active
          const isActive = pathname === item.href || 
            (pathname.startsWith(item.href + "/") && 
             !navigationItems.some(otherItem => 
               otherItem.href !== item.href && 
               otherItem.href.startsWith(item.href) && 
               pathname.startsWith(otherItem.href)
             ))
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={isMobile ? onClose : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 group",
                "modern-hover modern-focus",
                isActive
                  ? "gradient-primary text-primary-foreground shadow-soft animate-spring-in"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/10"
              )}
            >
              <Icon className="size-4 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="flex items-center gap-2">
                {item.title}
                {item.emoji && (
                  <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-xs transform group-hover:scale-125 group-hover:animate-bounce">
                    {item.emoji}
                  </span>
                )}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-default">
          © 2025 Full Court Control Pro tarafından geliştirildi
        </div>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <>
        {/* Mobile overlay */}
        {isOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
            onClick={onClose}
          />
        )}
        {/* Mobile sidebar */}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-72 glass shadow-glass transition-transform duration-200 ease-in-out lg:hidden",
            isOpen ? "translate-x-0" : "-translate-x-full",
            className
          )}
        >
          {sidebarContent}
        </div>
      </>
    )
  }

  return (
    <div className={cn("w-72 h-full glass shadow-glass", className)}>
      {sidebarContent}
    </div>
  )
}

// Mobile menu trigger
interface MobileMenuButtonProps {
  onClick: () => void
  className?: string
}

export function MobileMenuButton({ onClick, className }: MobileMenuButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={cn("lg:hidden", className)}
    >
      <Menu className="size-4" />
      <span className="sr-only">Menüyü aç/kapat</span>
    </Button>
  )
}