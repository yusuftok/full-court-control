"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Building2, 
  LayoutDashboard, 
  FolderTree, 
  ListTodo, 
  Users, 
  BarChart3, 
  FileText, 
  Settings,
  Menu,
  X,
  GitBranch
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navigationItems = [
  {
    title: "Komuta Merkezi",
    href: "/dashboard",
    icon: LayoutDashboard,
    emoji: "🏗️"
  },
  {
    title: "Aktif Şantiyeler",
    href: "/projects",
    icon: Building2,
    emoji: "🏢"
  },
  {
    title: "Proje Bölümleri",
    href: "/divisions",
    icon: GitBranch,
    emoji: "🏗️"
  },
  {
    title: "Bölüm Şablonları",
    href: "/templates",
    icon: FolderTree,
    emoji: "📋"
  },
  {
    title: "İş Emirleri",
    href: "/tasks",
    icon: ListTodo,
    emoji: "🔨"
  },
  {
    title: "Ekip Yönetimi",
    href: "/subcontractors",
    icon: Users,
    emoji: "👷"
  },
  {
    title: "Şantiye Metrikleri",
    href: "/analytics",
    icon: BarChart3,
    emoji: "📈"
  },
  {
    title: "Saha Raporları",
    href: "/reports",
    icon: FileText,
    emoji: "📄"
  },
  {
    title: "Araçlar",
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

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo and Brand */}
      <div className="h-16 flex items-center justify-between px-6 border-b">
        <div className="flex items-center gap-3 group">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center construction-hover group-hover:animate-hammer-swing">
            <Building2 className="size-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm group-hover:text-primary transition-colors">Full Court Control Pro</span>
            <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">İnşaat Yönetim Platformu</span>
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
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={isMobile ? onClose : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group",
                "hover:bg-accent hover:text-accent-foreground construction-hover",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 animate-build-up"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="size-4 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="flex items-center gap-2">
                {item.title}
                {item.emoji && (
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                    {item.emoji}
                  </span>
                )}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
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
            "fixed inset-y-0 left-0 z-50 w-72 bg-background border-r transition-transform duration-200 ease-in-out lg:hidden",
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
    <div className={cn("w-72 h-full bg-background border-r", className)}>
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