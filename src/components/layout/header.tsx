"use client"

import * as React from "react"
import Link from "next/link"
import { Bell, Search, User } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { MobileMenuButton } from "./sidebar"

interface HeaderProps {
  className?: string
  onMobileMenuToggle?: () => void
}

export function Header({ className, onMobileMenuToggle }: HeaderProps) {
  const [notificationCount] = React.useState(3) // Mock notification count

  return (
    <header className={cn("h-16 border-b bg-background", className)}>
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left side - Mobile menu + Search */}
        <div className="flex items-center gap-4">
          {onMobileMenuToggle && (
            <MobileMenuButton onClick={onMobileMenuToggle} />
          )}
          
          {/* Search - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Şantiye, plan, ekip arayın... 🔍"
                className={cn(
                  "w-64 h-9 pl-10 pr-4 rounded-md border border-input transition-all",
                  "bg-background text-sm placeholder:text-muted-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                  "construction-hover focus:w-72"
                )}
              />
            </div>
          </div>
        </div>

        {/* Right side - Notifications + User */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative construction-hover group">
            <Bell className={cn("size-4 transition-transform", notificationCount > 0 && "animate-pulse")} />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 size-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center animate-construction-bounce">
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            )}
            <span className="sr-only">Şantiye Uyarıları</span>
          </Button>

          {/* User Avatar */}
          <Button variant="ghost" size="icon" className="relative construction-hover group">
            <User className="size-4 group-hover:scale-110 transition-transform" />
            <span className="sr-only">Şantiye Şefi Menüsü</span>
          </Button>

          {/* Mobile search */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="size-4" />
            <span className="sr-only">Arama</span>
          </Button>
        </div>
      </div>
    </header>
  )
}