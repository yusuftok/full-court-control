'use client'

import * as React from 'react'
import { useState, useRef, useEffect } from 'react'
import { Layout, Plus, ChevronDown, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { DivisionTemplate } from '@/components/templates/template-types'
import { mockTemplates } from '@/components/templates/template-data'

interface TemplateSelectorProps {
  value: string | null // template ID or null for empty
  onChange: (value: string | null) => void
  placeholder?: string
  className?: string
}

export function TemplateSelector({
  value,
  onChange,
  placeholder = 'Şablon ara ve seç...',
  className,
}: TemplateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter templates based on search term
  const filteredTemplates = mockTemplates.filter(
    template =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Find selected template
  const selectedTemplate = value
    ? mockTemplates.find(t => t.id === value)
    : null

  const handleSelect = (template: DivisionTemplate | null) => {
    onChange(template?.id || null)
    setIsOpen(false)
    setSearchTerm('')
    setIsFocused(false)
  }

  const handleInputFocus = () => {
    setIsFocused(true)
    setIsOpen(true)
    setFocusedIndex(-1)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchTerm(newValue)
    setIsOpen(true)

    // If user clears input, also clear selection
    if (newValue === '') {
      onChange(null)
    }
  }

  const handleInputBlur = () => {
    // Delay to allow click on dropdown items
    setTimeout(() => {
      setIsFocused(false)
      if (!value && searchTerm) {
        setSearchTerm('')
      }
    }, 200)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    const allOptions = [
      { id: null, name: 'Boş Şablonla Başla' },
      ...filteredTemplates,
    ]

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setFocusedIndex(prev => (prev + 1) % allOptions.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIndex(prev => (prev === 0 ? allOptions.length - 1 : prev - 1))
        break
      case 'Enter':
        e.preventDefault()
        if (focusedIndex >= 0 && focusedIndex < allOptions.length) {
          const selectedOption = allOptions[focusedIndex]
          if (selectedOption.id === null) {
            handleSelect(null)
          } else {
            handleSelect(selectedOption as DivisionTemplate)
          }
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        setFocusedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setIsFocused(false)
        if (!value && searchTerm) {
          setSearchTerm('')
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [value, searchTerm])

  // Update display value
  const displayValue =
    isFocused || isOpen
      ? searchTerm
      : selectedTemplate
        ? selectedTemplate.name
        : searchTerm

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Main Input */}
      <div className="relative">
        <Layout className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            'pl-10 pr-10',
            (isFocused || isOpen) && 'ring-2 ring-primary/20'
          )}
        />
        <ChevronDown
          className={cn(
            'absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground transition-transform pointer-events-none',
            isOpen && 'rotate-180'
          )}
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background/95 backdrop-blur-sm border-2 border-muted/40 rounded-xl shadow-lg z-[9999] overflow-hidden">
          {/* Results */}
          <div className="max-h-64 overflow-y-auto">
            {/* Empty Template Option */}
            <div className="p-2">
              <button
                onClick={() => handleSelect(null)}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors hover:bg-muted/50 focus:bg-muted/50 focus:outline-none',
                  focusedIndex === 0 && 'bg-primary/20 ring-2 ring-primary/50'
                )}
              >
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-green-700 dark:text-green-400">
                    Boş Şablonla Başla
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Temel bölüm yapısıyla başlayın ve ihtiyacınıza göre
                    özelleştirin
                  </div>
                </div>
              </button>
            </div>

            {/* Show templates only if there's search term */}
            {searchTerm && filteredTemplates.length > 0 && (
              <div className="border-t border-muted/40">
                <div className="p-2 space-y-1">
                  {filteredTemplates.map((template, index) => (
                    <button
                      key={template.id}
                      onClick={() => handleSelect(template)}
                      className={cn(
                        'w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors hover:bg-muted/50 focus:bg-muted/50 focus:outline-none',
                        focusedIndex === index + 1 &&
                          'bg-primary/20 ring-2 ring-primary/50'
                      )}
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">
                          {template.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {template.description}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {template.divisions.length} bölüm •{' '}
                          {template.usageCount} kez kullanıldı
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No results */}
            {searchTerm && filteredTemplates.length === 0 && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                &quot;{searchTerm}&quot; için şablon bulunamadı
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
