"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, Search, User } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { MobileMenuButton } from "./sidebar"
import { SearchDropdown } from "@/components/ui/search-dropdown"
import { searchItems, SearchItem } from "@/lib/global-search"

interface HeaderProps {
  className?: string
  onMobileMenuToggle?: () => void
}

export function Header({ className, onMobileMenuToggle }: HeaderProps) {
  const router = useRouter()
  const [notificationCount] = React.useState(3) // Mock notification count
  const [searchFocused, setSearchFocused] = React.useState(false)
  const [bellShakeCount, setBellShakeCount] = React.useState(0)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [searchResults, setSearchResults] = React.useState<SearchItem[]>([])
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [showResults, setShowResults] = React.useState(false)
  const searchRef = React.useRef<HTMLInputElement>(null)
  
  const handleBellClick = () => {
    setBellShakeCount(prev => prev + 1)
    // Reset shake animation after it completes
    setTimeout(() => setBellShakeCount(0), 600)
  }

  // Search functionality
  React.useEffect(() => {
    const results = searchItems(searchQuery)
    setSearchResults(results)
    setSelectedIndex(0)
    setShowResults(searchQuery.trim().length > 0 && searchFocused)
  }, [searchQuery, searchFocused])

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || searchResults.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % searchResults.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => (prev - 1 + searchResults.length) % searchResults.length)
        break
      case 'Enter':
        e.preventDefault()
        if (searchResults[selectedIndex]) {
          router.push(searchResults[selectedIndex].url)
          handleCloseSearch()
        }
        break
      case 'Escape':
        handleCloseSearch()
        break
    }
  }

  const handleCloseSearch = () => {
    setShowResults(false)
    setSearchQuery("")
    setSearchFocused(false)
    searchRef.current?.blur()
  }

  const handleSearchSelect = (item: SearchItem) => {
    router.push(item.url)
    handleCloseSearch()
  }

  return (
    <header className={cn("h-16 glass shadow-glass sticky top-0 z-50", className)}>
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
                ref={searchRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder={searchFocused ? "Projeler, görevler, kişiler, şablonlar..." : "Aradığınız her şey burada..."}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => {
                  // Delay blur to allow clicking on dropdown items
                  setTimeout(() => {
                    setSearchFocused(false)
                    setShowResults(false)
                  }, 200)
                }}
                className={cn(
                  "w-[28rem] h-10 pl-10 pr-12 rounded-xl bg-background/90 backdrop-blur-sm border-2 border-muted/40 transition-colors duration-300",
                  "text-sm placeholder:text-muted-foreground shadow-sm",
                  "modern-focus hover:border-primary/40 focus:border-primary/60"
                )}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
                <Search className="size-4 text-muted-foreground/60" />
              </div>
              
              <SearchDropdown
                results={searchResults}
                isOpen={showResults}
                onClose={handleCloseSearch}
                onSelect={handleSearchSelect}
                selectedIndex={selectedIndex}
                className="w-[28rem]"
              />
            </div>
          </div>
        </div>

        {/* Right side - Notifications + User */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative modern-hover group rounded-xl"
            onClick={handleBellClick}
            title={notificationCount > 0 ? `${notificationCount} acil şantiye uyarısı! 🚨` : "Hiç uyarı yok, harika! 👍"}
          >
            <Bell 
              className={cn(
                "size-4 transition-transform",
                bellShakeCount > 0 && "animate-construction-cheer"
              )} 
              style={{ 
                animation: notificationCount > 0 ? 'pulse 2s ease-in-out infinite' : 'none' 
              }} 
            />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 size-5 gradient-danger text-white text-xs rounded-full flex items-center justify-center animate-tada" style={{ animation: 'glow 3s ease-in-out infinite' }}>
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            )}
            <span className="sr-only">Şantiye Uyarıları</span>
          </Button>

          {/* User Avatar */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative modern-hover group rounded-xl"
            title="Selam şef! İyi çalışmalar 👷"
          >
            <User className="size-4 group-hover:scale-110 group-hover:animate-construction-cheer transition-transform" />
            <span className="sr-only">Şantiye Şefi Menüsü</span>
            {/* Funny status indicator */}
            <span className="absolute -bottom-1 -right-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
              👷
            </span>
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