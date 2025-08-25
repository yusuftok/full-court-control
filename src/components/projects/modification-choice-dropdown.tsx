'use client'

import * as React from 'react'
import { useState, useRef, useEffect } from 'react'
import { ChevronUp, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

type ModificationChoice = 'update' | 'save-new' | 'project-only'

interface ModificationChoiceDropdownProps {
  value: ModificationChoice | null
  onChange: (value: ModificationChoice) => void
  className?: string
}

const choiceOptions = [
  {
    value: 'update' as const,
    label: 'Ortak Şablonu Güncelle',
    description: 'Bundan sonrası için şablon güncellenir',
  },
  {
    value: 'save-new' as const,
    label: 'Yeni Şablon Olarak Kaydet',
    description: 'Değişiklikler yeni bir şablon olarak kaydedilecek',
  },
  {
    value: 'project-only' as const,
    label: 'Sadece Bu Proje İçin Kullan',
    description: 'Değişiklikler sadece bu projede uygulanacak',
  },
]

export function ModificationChoiceDropdown({
  value,
  onChange,
  className,
}: ModificationChoiceDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedOption = value
    ? choiceOptions.find(opt => opt.value === value)
    : null

  const handleSelect = (choice: ModificationChoice) => {
    onChange(choice)
    setIsOpen(false)
    setFocusedIndex(-1)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen) {
      if (
        event.key === 'Enter' ||
        event.key === ' ' ||
        event.key === 'ArrowDown'
      ) {
        event.preventDefault()
        setIsOpen(true)
        setFocusedIndex(0)
      }
      return
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setFocusedIndex(prev => (prev + 1) % choiceOptions.length)
        break
      case 'ArrowUp':
        event.preventDefault()
        setFocusedIndex(prev =>
          prev === 0 ? choiceOptions.length - 1 : prev - 1
        )
        break
      case 'Enter':
        event.preventDefault()
        if (focusedIndex >= 0) {
          handleSelect(choiceOptions[focusedIndex].value)
        }
        break
      case 'Escape':
        event.preventDefault()
        setIsOpen(false)
        setFocusedIndex(-1)
        break
    }
  }

  // Reset focused index when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setFocusedIndex(-1)
    }
  }, [isOpen])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Main Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        className={cn(
          'w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg border-2 text-left transition-all',
          value
            ? 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20'
            : 'border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/20 animate-pulse',
          'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/20'
        )}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <AlertTriangle
            className={cn(
              'w-5 h-5 flex-shrink-0',
              value ? 'text-green-600' : 'text-amber-600'
            )}
          />

          <div className="flex-1 min-w-0">
            {selectedOption ? (
              <>
                <div className="font-medium text-sm text-green-800 dark:text-green-200">
                  {selectedOption.label}
                </div>
                <div className="text-xs text-green-600 dark:text-green-400 mt-0.5">
                  {selectedOption.description}
                </div>
              </>
            ) : (
              <div className="font-medium text-sm text-amber-800 dark:text-amber-200">
                Değiştirilen şablon için karar verin...
              </div>
            )}
          </div>
        </div>

        <ChevronUp
          className={cn(
            'w-4 h-4 text-muted-foreground transition-transform',
            isOpen ? '' : 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown - Opens upward */}
      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-background border-2 border-muted/40 rounded-xl shadow-lg z-[9999] overflow-hidden">
          <div className="p-2 space-y-1">
            {choiceOptions.map((option, index) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  'w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors',
                  'hover:bg-muted/50 focus:bg-muted/50 focus:outline-none',
                  value === option.value &&
                    'bg-primary/10 border border-primary/20',
                  focusedIndex === index &&
                    'bg-primary/20 ring-2 ring-primary/50'
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{option.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {option.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
