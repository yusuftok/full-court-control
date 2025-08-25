"use client"

import * as React from "react"
import { useState, useRef, useEffect } from "react"
import { Search, Building, Plus, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SubcontractorType, Subcontractor } from './types/subcontractor-types'
import { 
  getSubcontractorsByType, 
  getSubcontractorTypeLabel 
} from './data/mock-subcontractors'

interface SubcontractorSelectorProps {
  type: SubcontractorType
  value: string
  onChange: (value: string) => void
  onNewSubcontractor: (type: SubcontractorType) => void
  subcontractorList: Subcontractor[]
  placeholder?: string
  className?: string
}

export function SubcontractorSelector({ 
  type, 
  value, 
  onChange,
  onNewSubcontractor,
  subcontractorList,
  placeholder = "Taşeron ara ve seç...",
  className 
}: SubcontractorSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter subcontractors based on type and search term
  const filteredSubcontractors = subcontractorList.filter(subcontractor => {
    const matchesType = subcontractor.type === type
    const matchesSearch = subcontractor.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subcontractor.responsiblePerson.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesType && matchesSearch
  })

  // Find selected subcontractor
  const selectedSubcontractor = subcontractorList.find(sub => sub.id === value)

  const handleSelect = (subcontractor: Subcontractor) => {
    onChange(subcontractor.id)
    setIsOpen(false)
    setSearchTerm("")
    setIsFocused(false)
  }

  const handleAddNew = () => {
    onNewSubcontractor(type)
    setIsOpen(false)
    setSearchTerm("")
    setIsFocused(false)
  }

  const handleInputFocus = () => {
    setIsFocused(true)
    setIsOpen(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchTerm(newValue)
    setIsOpen(true)
    
    // If user clears input, also clear selection
    if (newValue === "") {
      onChange("")
    }
  }

  const handleInputBlur = () => {
    // Delay to allow click on dropdown items
    setTimeout(() => {
      setIsFocused(false)
      if (!value && searchTerm) {
        setSearchTerm("")
      }
    }, 200)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setIsFocused(false)
        if (!value && searchTerm) {
          setSearchTerm("")
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [value, searchTerm])

  // Update display value
  const displayValue = isFocused || isOpen ? searchTerm : (selectedSubcontractor ? selectedSubcontractor.companyName : searchTerm)

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Main Input */}
      <div className="relative">
        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className={cn(
            "pl-10 pr-10",
            (isFocused || isOpen) && "ring-2 ring-primary/20"
          )}
        />
        <ChevronDown className={cn(
          "absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground transition-transform pointer-events-none",
          isOpen && "rotate-180"
        )} />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background/95 backdrop-blur-sm border-2 border-muted/40 rounded-xl shadow-lg z-50 overflow-hidden">
          {/* Results */}
          <div className="max-h-64 overflow-y-auto">
            {/* Show subcontractors only if there's search term */}
            {searchTerm && filteredSubcontractors.length > 0 && (
              <div className="p-2 space-y-1">
                {filteredSubcontractors.map((subcontractor) => (
                  <button
                    key={subcontractor.id}
                    onClick={() => handleSelect(subcontractor)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors hover:bg-muted/50 focus:bg-muted/50 focus:outline-none"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">
                        {subcontractor.companyName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {subcontractor.responsiblePerson}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {subcontractor.completedProjects} proje • {subcontractor.averageRating?.toFixed(1)} ⭐
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Add New Option */}
          <div className="border-t border-muted/40 p-2">
            <button
              onClick={handleAddNew}
              className="w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors hover:bg-primary/5 focus:bg-primary/5 focus:outline-none text-primary"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">
                  Yeni {getSubcontractorTypeLabel(type)} Ekle
                </div>
                <div className="text-xs text-muted-foreground">
                  Sisteme yeni taşeron kaydı oluştur
                </div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}