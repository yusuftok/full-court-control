"use client"

import * as React from "react"
import { useState, useRef, useEffect } from "react"
import { Search, User, Plus, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Mock engineers database
interface Engineer {
  id: string
  name: string
  title: string
  company: string
  email: string
  phone: string
  experience: number
  isActive: boolean
}

const mockEngineers: Engineer[] = [
  {
    id: "eng-1",
    name: "Ahmet Yılmaz",
    title: "İnşaat Mühendisi",
    company: "Yılmaz İnşaat",
    email: "ahmet@yilmaz.com",
    phone: "+90 532 123 4567",
    experience: 15,
    isActive: true
  },
  {
    id: "eng-2", 
    name: "Fatma Demir",
    title: "Makine Mühendisi",
    company: "Demir Taahhüt",
    email: "fatma@demir.com",
    phone: "+90 535 987 6543",
    experience: 12,
    isActive: true
  },
  {
    id: "eng-3",
    name: "Mehmet Kaya",
    title: "Elektrik Mühendisi", 
    company: "Kaya Elektrik",
    email: "mehmet@kaya.com",
    phone: "+90 543 456 7890",
    experience: 8,
    isActive: true
  },
  {
    id: "eng-4",
    name: "Ayşe Özkan",
    title: "İnşaat Mühendisi",
    company: "Özkan Yapı",
    email: "ayse@ozkan.com", 
    phone: "+90 544 321 0987",
    experience: 10,
    isActive: true
  },
  {
    id: "eng-5",
    name: "Ali Çelik",
    title: "Makine Mühendisi",
    company: "Çelik Tesisat",
    email: "ali@celik.com",
    phone: "+90 531 654 3210",
    experience: 6,
    isActive: true
  }
]

interface EngineerSelectorProps {
  role: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function EngineerSelector({ 
  role, 
  value, 
  onChange, 
  placeholder = "Mühendis ara ve seç...",
  className 
}: EngineerSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const [newEngineerData, setNewEngineerData] = useState({ name: "", email: "" })
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter engineers based on role and search term
  const filteredEngineers = mockEngineers.filter(engineer => {
    const matchesSearch = engineer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         engineer.company.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Basic role matching - can be made more sophisticated
    const roleKeywords = {
      chief: ["İnşaat", "İnşaat Mühendisi"],
      civil: ["İnşaat", "İnşaat Mühendisi"], 
      mechanical: ["Makine", "Makine Mühendisi"],
      electrical: ["Elektrik", "Elektrik Mühendisi"]
    }
    
    const relevantRoles = roleKeywords[role.toLowerCase() as keyof typeof roleKeywords] || []
    const matchesRole = relevantRoles.some(keyword => 
      engineer.title.includes(keyword)
    )
    
    return matchesSearch && matchesRole
  })

  // Find selected engineer
  const selectedEngineer = mockEngineers.find(eng => eng.name === value)

  const handleSelect = (engineer: Engineer) => {
    onChange(engineer.name)
    setIsOpen(false)
    setSearchTerm("")
    setIsFocused(false)
  }

  const handleAddNew = () => {
    setShowAddModal(true)
    setIsOpen(false)
    setSearchTerm("")
    setIsFocused(false)
  }

  // Get role-specific title
  const getRoleTitle = (roleType: string) => {
    const titleMap = {
      'chief': 'Şef Mühendis',
      'civil': 'İnşaat Mühendisi', 
      'mechanical': 'Makine Mühendisi',
      'electrical': 'Elektrik Mühendisi'
    }
    return titleMap[roleType as keyof typeof titleMap] || 'Mühendis'
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    const allOptions = [...filteredEngineers, { id: 'add-new', name: 'Yeni Mühendis Ekle' }]
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setFocusedIndex(prev => (prev + 1) % allOptions.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIndex(prev => prev === 0 ? allOptions.length - 1 : prev - 1)
        break
      case 'Enter':
        e.preventDefault()
        if (focusedIndex >= 0 && focusedIndex < allOptions.length) {
          const selectedOption = allOptions[focusedIndex]
          if (selectedOption.id === 'add-new') {
            handleAddNew()
          } else {
            handleSelect(selectedOption as Engineer)
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

  // Reset focused index when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setFocusedIndex(-1)
    }
  }, [isOpen])

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
  const displayValue = isFocused || isOpen ? searchTerm : (selectedEngineer ? selectedEngineer.name : searchTerm)

  return (
    <>
      <div ref={containerRef} className={cn("relative", className)}>
        {/* Main Input */}
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
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
              {/* Show engineers only if there's search term */}
              {searchTerm && filteredEngineers.length > 0 && (
                <div className="p-2 space-y-1">
                  {filteredEngineers.map((engineer, index) => (
                    <button
                      key={engineer.id}
                      onClick={() => handleSelect(engineer)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors hover:bg-muted/50 focus:bg-muted/50 focus:outline-none",
                        focusedIndex === index && "bg-primary/20 ring-2 ring-primary/50"
                      )}
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">
                          {engineer.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {engineer.title} • {engineer.company}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {engineer.experience} yıl deneyim
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
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors hover:bg-primary/5 focus:bg-primary/5 focus:outline-none text-primary",
                  focusedIndex === filteredEngineers.length && "bg-primary/20 ring-2 ring-primary/50"
                )}
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">
                    Yeni Mühendis Ekle
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Sisteme yeni mühendis kaydı oluştur
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add New Engineer Modal - Simple for now */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-xl p-6 w-full max-w-md mx-4 border">
            <h3 className="text-lg font-semibold mb-4">Yeni {getRoleTitle(role)} Ekle</h3>
            <div className="space-y-4">
              <div>
                <Label>Ad Soyad *</Label>
                <Input 
                  placeholder="Örn: Deniz Aktaş"
                  value={newEngineerData.name}
                  onChange={(e) => setNewEngineerData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label>Unvan *</Label>
                <Input 
                  value={getRoleTitle(role)}
                  disabled
                  className="bg-muted/50 cursor-not-allowed"
                />
              </div>
              <div>
                <Label>E-posta</Label>
                <Input 
                  placeholder="deniz@aktas.com"
                  value={newEngineerData.email}
                  onChange={(e) => setNewEngineerData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-input bg-background rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                İptal
              </button>
              <button 
                onClick={() => {
                  if (newEngineerData.name.trim()) {
                    // Create new engineer and add to mock data
                    const newEngineer: Engineer = {
                      id: `eng-${Date.now()}`,
                      name: newEngineerData.name.trim(),
                      title: getRoleTitle(role),
                      company: "Ana Yüklenici",
                      email: newEngineerData.email.trim(),
                      phone: "",
                      experience: 0,
                      isActive: true
                    }
                    
                    // Add to mock data (in real app, would save to database)
                    mockEngineers.push(newEngineer)
                    
                    // Set the new engineer as selected
                    onChange(newEngineer.name)
                    
                    // Reset and close
                    setNewEngineerData({ name: "", email: "" })
                    setShowAddModal(false)
                    
                    // Would send invitation email in real app
                    console.log('New engineer added:', newEngineer)
                  }
                }}
                disabled={!newEngineerData.name.trim()}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Kaydet ve Davet Gönder
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}