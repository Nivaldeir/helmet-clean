"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle2, Calendar, Clock, MapPin, Package, Phone, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"

interface Booking {
  id: string
  service: string
  price: number
  date: string
  time: string
  customer: {
    name: string
    phone: string
    email: string
  }
  address: {
    street: string
    number: string
    complement: string
    neighborhood: string
    city: string
  }
  paymentMethod: string
}

export default function ConfirmacaoPage() {
  const [booking, setBooking] = useState<Booking | null>(null)

  useEffect(() => {
    const savedBooking = localStorage.getItem("lastBooking")
    if (savedBooking) {
      setBooking(JSON.parse(savedBooking))
    }
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    }
    return date.toLocaleDateString('pt-BR', options)
  }

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "credit": return "Cartão de Crédito"
      case "debit": return "Cartão de Débito"
      case "pix": return "PIX"
      default: return method
    }
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto flex max-w-2xl flex-col items-center px-4 py-16 text-center">
          <p className="text-muted-foreground">Nenhum agendamento encontrado.</p>
          <Button asChild className="mt-4">
            <Link href="/agendar">Fazer um agendamento</Link>
          </Button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="mx-auto max-w-2xl px-4 py-8 md:py-16">
        {/* Success Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-accent/20">
            <CheckCircle2 className="h-10 w-10 text-accent" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">
            Agendamento Confirmado!
          </h1>
          <p className="text-muted-foreground">
            Seu pedido foi recebido com sucesso. Em breve entraremos em contato.
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between border-b border-border pb-4">
            <span className="text-sm text-muted-foreground">Pedido</span>
            <span className="font-mono text-lg font-semibold text-foreground">#{booking.id}</span>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{booking.service}</p>
                <p className="text-sm text-muted-foreground">R$ {booking.price?.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Data da Coleta</p>
                <p className="text-sm text-muted-foreground">{formatDate(booking.date)}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Horário</p>
                <p className="text-sm text-muted-foreground">{booking.time}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Endereço</p>
                <p className="text-sm text-muted-foreground">
                  {booking.address.street}, {booking.address.number}
                  {booking.address.complement && ` - ${booking.address.complement}`}
                  <br />
                  {booking.address.neighborhood && `${booking.address.neighborhood}, `}
                  {booking.address.city}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{booking.customer.name}</p>
                <p className="text-sm text-muted-foreground">{booking.customer.phone}</p>
                {booking.customer.email && (
                  <p className="text-sm text-muted-foreground">{booking.customer.email}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-6 border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Pagamento</span>
              <span className="font-medium text-foreground">
                {getPaymentMethodLabel(booking.paymentMethod)}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="font-semibold text-foreground">Total</span>
              <span className="text-xl font-bold text-foreground">
                R$ {booking.price?.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 font-semibold text-foreground">Próximos passos</h2>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">1</span>
              Você receberá uma confirmação por WhatsApp
            </li>
            <li className="flex items-start gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">2</span>
              Nosso entregador irá até sua casa no horário marcado
            </li>
            <li className="flex items-start gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">3</span>
              O capacete será devolvido limpo em até 24 horas
            </li>
          </ol>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild variant="outline">
            <Link href="/">Voltar ao início</Link>
          </Button>
          <Button asChild className="gap-2">
            <Link href="/agendar">
              Novo agendamento
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
