"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Command } from "lucide-react"
import { cn } from "@/lib/utils"
import { SearchItem, groupSearchResults } from "@/lib/global-search"

interface SearchDropdownProps {
  results: SearchItem[]
  isOpen: boolean
  onClose: () => void
  onSelect: (item: SearchItem) => void
  selectedIndex: number
  className?: string
}

export function SearchDropdown({ 
  results, 
  isOpen, 
  onClose, 
  onSelect, 
  selectedIndex,
  className 
}: SearchDropdownProps) {
  const router = useRouter()
  
  if (!isOpen || results.length === 0) {
    return null
  }

  const groupedResults = groupSearchResults(results)

  const handleItemClick = (item: SearchItem) => {
    onSelect(item)
    onClose()
  }

  // Calculate flat index for keyboard navigation
  let flatIndex = 0

  return (
    <div className={cn(
      "absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-sm border-2 border-muted/40 rounded-xl shadow-lg z-50 overflow-hidden",
      "animate-fade-up",
      className
    )}>
      <div className="max-h-80 overflow-y-auto">
        {Object.entries(groupedResults).map(([category, items]) => (
          <div key={category} className="p-2">
            <div className="text-xs font-medium text-muted-foreground px-3 py-1 uppercase tracking-wide">
              {category}
            </div>
            {items.map((item) => {
              const isSelected = flatIndex === selectedIndex
              const currentFlatIndex = flatIndex++
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                    "hover:bg-muted/50 focus:bg-muted/50 focus:outline-none",
                    isSelected && "bg-primary/10 border-l-2 border-primary"
                  )}
                >
                  <div className="flex items-center justify-center size-8 glass rounded-lg">
                    <span className="text-sm">{item.emoji}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {item.name}
                    </div>
                    {item.description && (
                      <div className="text-xs text-muted-foreground truncate">
                        {item.description}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center">
                    <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-xs bg-muted rounded border">
                      ↵
                    </kbd>
                  </div>
                </button>
              )
            })}
          </div>
        ))}
      </div>
      
      {/* Footer */}
      <div className="border-t border-muted/40 p-2 bg-muted/20">
        <div className="flex items-center justify-center text-xs text-muted-foreground px-3 py-1">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-background rounded border">↑↓</kbd>
              Gezin
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-background rounded border">↵</kbd>
              Seç
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-background rounded border">Esc</kbd>
              Kapat
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}