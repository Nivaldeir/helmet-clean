"use client"

import * as React from "react"
import { useEffect, useState, useCallback } from "react"
import { getConfig } from "@/lib/config"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  const applyTheme = useCallback(() => {
    const config = getConfig()
    const theme = config.theme
    
    if (!theme) return
    
    const primaryHue = theme.colors.primary
    const accentHue = theme.colors.accent
    
    let radius = "0.625rem"
    switch (theme.borderRadius) {
      case "none": radius = "0"; break
      case "small": radius = "0.375rem"; break
      case "medium": radius = "0.625rem"; break
      case "large": radius = "1rem"; break
    }
    
    document.documentElement.style.setProperty("--primary", `oklch(0.55 0.2 ${primaryHue})`)
    document.documentElement.style.setProperty("--primary-foreground", "oklch(0.98 0 0)")
    document.documentElement.style.setProperty("--accent", `oklch(0.7 0.15 ${accentHue})`)
    document.documentElement.style.setProperty("--accent-foreground", `oklch(0.15 0.02 ${accentHue})`)
    document.documentElement.style.setProperty("--radius", radius)
  }, [])

  useEffect(() => {
    setMounted(true)
    applyTheme()
    
    // Listen for storage changes (cross-tab)
    const handleStorage = () => applyTheme()
    window.addEventListener("storage", handleStorage)
    
    // Custom event for same-tab updates
    window.addEventListener("themeUpdate", handleStorage)
    
    return () => {
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener("themeUpdate", handleStorage)
    }
  }, [applyTheme])

  if (!mounted) {
    return <>{children}</>
  }

  return <>{children}</>
}
