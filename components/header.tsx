"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Menu, X, Bike, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getLogo, getCompanyName } from "@/lib/config"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [logo, setLogo] = useState<string | null>(null)
  const [companyName, setCompanyName] = useState("HelmetClean")

  useEffect(() => {
    setLogo(getLogo())
    setCompanyName(getCompanyName())

    const handleThemeUpdate = () => {
      setLogo(getLogo())
      setCompanyName(getCompanyName())
    }

    window.addEventListener("themeUpdate", handleThemeUpdate)
    return () => window.removeEventListener("themeUpdate", handleThemeUpdate)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          {logo ? (
            <Image
              src={logo}
              alt={companyName}
              width={140}
              height={40}
              className="h-10 w-auto object-contain"
            />
          ) : (
            <>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <Bike className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">{companyName}</span>
            </>
          )}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/#como-funciona" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Como Funciona
          </Link>
          <Link href="/#servicos" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Serviços
          </Link>
          <Link href="/#precos" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Preços
          </Link>
          <Link href="/admin" className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" title="Admin">
            <Settings className="h-4 w-4" />
          </Link>
          <Button asChild>
            <Link href="/agendar">Agendar Agora</Link>
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menu"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="flex flex-col gap-4 border-t border-border bg-card px-4 py-4 md:hidden">
          <Link 
            href="/#como-funciona" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => setIsMenuOpen(false)}
          >
            Como Funciona
          </Link>
          <Link 
            href="/#servicos" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => setIsMenuOpen(false)}
          >
            Serviços
          </Link>
          <Link 
            href="/#precos" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => setIsMenuOpen(false)}
          >
            Preços
          </Link>
          <Link 
            href="/admin" 
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => setIsMenuOpen(false)}
          >
            <Settings className="h-4 w-4" />
            Painel Admin
          </Link>
          <Button asChild className="w-full">
            <Link href="/agendar" onClick={() => setIsMenuOpen(false)}>Agendar Agora</Link>
          </Button>
        </nav>
      )}
    </header>
  )
}
