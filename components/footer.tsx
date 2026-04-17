"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Bike } from "lucide-react"
import { getLogo, getCompanyName, getConfig } from "@/lib/config"

export function Footer() {
  const [logo, setLogo] = useState<string | null>(null)
  const [companyName, setCompanyName] = useState("HelmetClean")
  const [email, setEmail] = useState("contato@helmetclean.com.br")
  const [phone, setPhone] = useState("(11) 99999-9999")

  useEffect(() => {
    const config = getConfig()
    setLogo(getLogo())
    setCompanyName(getCompanyName())
    setEmail(config.email)
    setPhone(config.phone)

    const handleThemeUpdate = () => {
      const config = getConfig()
      setLogo(getLogo())
      setCompanyName(getCompanyName())
      setEmail(config.email)
      setPhone(config.phone)
    }

    window.addEventListener("themeUpdate", handleThemeUpdate)
    return () => window.removeEventListener("themeUpdate", handleThemeUpdate)
  }, [])

  return (
    <footer className="border-t border-border bg-card px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
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
          </div>
          
          <div className="flex flex-col items-center gap-4 text-center md:flex-row md:gap-8 md:text-left">
            <a href={`mailto:${email}`} className="text-sm text-muted-foreground hover:text-foreground">
              {email}
            </a>
            <a href={`tel:${phone.replace(/\D/g, "")}`} className="text-sm text-muted-foreground hover:text-foreground">
              {phone}
            </a>
          </div>
        </div>
        
        <div className="mt-8 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {companyName}. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
