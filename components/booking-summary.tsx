"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, MapPin, Package, Truck, Shield } from "lucide-react"
import { getActiveServices, getConfig, type ServiceOption } from "@/lib/config"
import type { AddressData } from "./address-form"

interface BookingSummaryProps {
  selectedDate: Date | null
  selectedTime: string | null
  selectedService: string | null
  address: AddressData
}

export function BookingSummary({ selectedDate, selectedTime, selectedService, address }: BookingSummaryProps) {
  const [services, setServices] = useState<ServiceOption[]>([])
  const [deliveryFee, setDeliveryFee] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setServices(getActiveServices())
    setDeliveryFee(getConfig().deliveryFee)
  }, [])

  const service = services.find(s => s.id === selectedService)
  
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    }
    return date.toLocaleDateString('pt-BR', options)
  }

  const total = service ? service.price + deliveryFee : 0

  if (!mounted) {
    return (
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="h-6 w-32 animate-pulse rounded bg-muted mb-4" />
        <div className="space-y-3">
          <div className="h-12 animate-pulse rounded-lg bg-muted" />
          <div className="h-12 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    )
  }

  const hasDetails = service || selectedDate || selectedTime || (address.street && address.number)

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4">
        <h3 className="font-semibold text-foreground">Resumo do Pedido</h3>
      </div>
      
      <div className="p-4">
        {!hasDetails ? (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="mb-3 rounded-full bg-muted p-3">
              <Package className="h-6 w-6 text-muted-foreground/50" />
            </div>
            <p className="text-sm text-muted-foreground">
              Selecione um serviço para começar
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {service && (
              <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/20">
                  <Package className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{service.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{service.description}</p>
                </div>
                <span className="font-semibold text-foreground whitespace-nowrap">
                  R$ {service.price}
                </span>
              </div>
            )}
            
            {selectedDate && (
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground">Data da Coleta</p>
                  <p className="text-sm font-medium text-foreground capitalize truncate">
                    {formatDate(selectedDate)}
                  </p>
                </div>
              </div>
            )}
            
            {selectedTime && (
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Horário</p>
                  <p className="text-sm font-medium text-foreground">{selectedTime}</p>
                </div>
              </div>
            )}
            
            {address.street && address.number && (
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground">Endereço</p>
                  <p className="text-sm font-medium text-foreground">
                    {address.street}, {address.number}
                    {address.complement && ` - ${address.complement}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {address.neighborhood && `${address.neighborhood}, `}
                    {address.city}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
        
        {service && (
          <div className="mt-6 border-t border-border pt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Serviço</span>
              <span className="text-foreground">R$ {service.price.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Coleta e Entrega</span>
              </div>
              {deliveryFee === 0 ? (
                <span className="font-medium text-accent">Grátis</span>
              ) : (
                <span className="text-foreground">R$ {deliveryFee.toFixed(2)}</span>
              )}
            </div>
            <div className="mt-4 flex items-center justify-between rounded-lg bg-primary/5 p-3">
              <span className="font-semibold text-foreground">Total</span>
              <span className="text-xl font-bold text-primary">R$ {total.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Security badge */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Shield className="h-3.5 w-3.5" />
          <span>Pagamento 100% seguro</span>
        </div>
      </div>
    </div>
  )
}
