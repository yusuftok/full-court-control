"use client"

import * as React from "react"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { AppLayout } from "@/components/layout/page-container"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <AppLayout>
      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block h-full">
          <Sidebar />
        </div>

        {/* Mobile Sidebar */}
        <Sidebar 
          isMobile
          isOpen={isMobileMenuOpen}
          onClose={handleMobileMenuClose}
        />

        {/* Main Content Area */}
        <div className="flex flex-col flex-1 min-w-0">
          <Header onMobileMenuToggle={handleMobileMenuToggle} />
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}