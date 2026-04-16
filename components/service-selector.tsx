"use client"

import { useState, useEffect } from "react"
import { Check, Sparkles, Star } from "lucide-react"
import { getActiveServices, type ServiceOption } from "@/lib/config"

interface ServiceSelectorProps {
  selectedService: string | null
  onSelectService: (serviceId: string) => void
}

export function ServiceSelector({ selectedService, onSelectService }: ServiceSelectorProps) {
  const [services, setServices] = useState<ServiceOption[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setServices(getActiveServices())
  }, [])

  if (!mounted) {
    return (
      <div className="space-y-3">
        <div className="h-32 animate-pulse rounded-xl bg-muted" />
        <div className="h-32 animate-pulse rounded-xl bg-muted" />
        <div className="h-32 animate-pulse rounded-xl bg-muted" />
      </div>
    )
  }

  const getServiceIcon = (index: number) => {
    if (index === services.length - 1) {
      return <Sparkles className="h-5 w-5 text-amber-500" />
    }
    if (index === Math.floor(services.length / 2)) {
      return <Star className="h-5 w-5 text-primary" />
    }
    return null
  }

  const isPopular = (index: number) => index === Math.floor(services.length / 2)
  const isPremium = (index: number) => index === services.length - 1

  return (
    <div className="space-y-3">
      {services.map((service, index) => (
        <button
          key={service.id}
          onClick={() => onSelectService(service.id)}
          className={`relative w-full rounded-xl border p-4 text-left transition-all ${
            selectedService === service.id
              ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary"
              : "border-border bg-card hover:border-primary/50 hover:shadow-sm"
          } ${isPremium(index) ? "bg-gradient-to-br from-amber-500/5 to-orange-500/5" : ""}`}
        >
          {/* Badge */}
          {isPopular(index) && (
            <span className="absolute -top-2.5 left-4 rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
              Mais pedido
            </span>
          )}
          {isPremium(index) && (
            <span className="absolute -top-2.5 left-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2.5 py-0.5 text-xs font-medium text-white">
              Premium
            </span>
          )}

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {getServiceIcon(index)}
                <h4 className="font-semibold text-foreground">{service.name}</h4>
                {selectedService === service.id && (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{service.description}</p>
              
              {/* Features */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {service.features.slice(0, 4).map((feature, featureIndex) => (
                  <span 
                    key={featureIndex} 
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${
                      selectedService === service.id
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Check className="h-2.5 w-2.5" />
                    {feature}
                  </span>
                ))}
                {service.features.length > 4 && (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    +{service.features.length - 4} mais
                  </span>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <span className={`text-2xl font-bold ${
                isPremium(index) ? "text-amber-600" : "text-foreground"
              }`}>
                R$ {service.price}
              </span>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

// Export para usar em outros lugares
export { getActiveServices }
export type { ServiceOption }
