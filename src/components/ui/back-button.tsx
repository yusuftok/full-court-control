'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export function BackButton() {
  const handleGoBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back()
    }
  }

  return (
    <Button variant="outline" onClick={handleGoBack} className="flex-1 group">
      <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
      Önceki Sayfa
    </Button>
  )
}
