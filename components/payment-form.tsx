"use client"

import { useState, useEffect } from "react"
import { CreditCard, Smartphone, Banknote, QrCode, Shield, Lock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getActivePaymentMethods, type PaymentMethodConfig } from "@/lib/config"

export interface PaymentData {
  method: "credit" | "debit" | "pix" | null
  cardNumber: string
  cardName: string
  cardExpiry: string
  cardCvv: string
}

interface PaymentFormProps {
  payment: PaymentData
  onPaymentChange: (payment: PaymentData) => void
}

const paymentIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  credit: CreditCard,
  debit: Banknote,
  pix: Smartphone,
}

export function PaymentForm({ payment, onPaymentChange }: PaymentFormProps) {
  const [showQrCode, setShowQrCode] = useState(false)
  const [activeMethods, setActiveMethods] = useState<PaymentMethodConfig[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setActiveMethods(getActivePaymentMethods())
  }, [])

  const handleMethodChange = (method: "credit" | "debit" | "pix") => {
    onPaymentChange({ ...payment, method })
    if (method === "pix") {
      setShowQrCode(true)
    } else {
      setShowQrCode(false)
    }
  }

  const handleCardChange = (field: keyof PaymentData, value: string) => {
    onPaymentChange({ ...payment, [field]: value })
  }

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "")
    const groups = cleaned.match(/.{1,4}/g)
    return groups ? groups.join(" ").slice(0, 19) : ""
  }

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, "")
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`
    }
    return cleaned
  }

  if (!mounted) {
    return (
      <div className="space-y-4">
        <div className="h-20 animate-pulse rounded-xl bg-muted" />
        <div className="h-40 animate-pulse rounded-xl bg-muted" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Payment Methods Grid */}
      <div className={`grid gap-3 ${activeMethods.length === 3 ? "grid-cols-3" : activeMethods.length === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
        {activeMethods.map((method) => {
          const Icon = paymentIcons[method.id] || CreditCard
          const isSelected = payment.method === method.id
          
          return (
            <button
              key={method.id}
              onClick={() => handleMethodChange(method.id as "credit" | "debit" | "pix")}
              className={`relative flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary"
                  : "border-border hover:border-primary/50 hover:shadow-sm"
              }`}
            >
              <div className={`rounded-full p-2.5 ${isSelected ? "bg-primary/20" : "bg-muted"}`}>
                <Icon className={`h-5 w-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <span className={`text-sm font-medium ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                {method.name}
              </span>
              {method.id === "pix" && (
                <span className="rounded-full bg-accent/20 px-2 py-0.5 text-xs text-accent-foreground">
                  Instantâneo
                </span>
              )}
            </button>
          )
        })}
      </div>
      
      {/* Credit/Debit Card Form */}
      {(payment.method === "credit" || payment.method === "debit") && (
        <div className="rounded-xl border border-border bg-card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-foreground">Dados do Cartão</h4>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Lock className="h-3 w-3" />
              Seguro
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardNumber">Número do Cartão</Label>
            <div className="relative">
              <Input
                id="cardNumber"
                placeholder="0000 0000 0000 0000"
                value={payment.cardNumber}
                onChange={(e) => handleCardChange("cardNumber", formatCardNumber(e.target.value))}
                maxLength={19}
                className="pl-10"
              />
              <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cardName">Nome no Cartão</Label>
            <Input
              id="cardName"
              placeholder="NOME COMO ESTÁ NO CARTÃO"
              value={payment.cardName}
              onChange={(e) => handleCardChange("cardName", e.target.value.toUpperCase())}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cardExpiry">Validade</Label>
              <Input
                id="cardExpiry"
                placeholder="MM/AA"
                value={payment.cardExpiry}
                onChange={(e) => handleCardChange("cardExpiry", formatExpiry(e.target.value))}
                maxLength={5}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardCvv">CVV</Label>
              <Input
                id="cardCvv"
                placeholder="123"
                value={payment.cardCvv}
                onChange={(e) => handleCardChange("cardCvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
                maxLength={4}
                type="password"
              />
            </div>
          </div>

          {/* Security Badge */}
          <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
            <Shield className="h-4 w-4 text-accent" />
            <span className="text-xs text-muted-foreground">
              Seus dados são criptografados e protegidos
            </span>
          </div>
        </div>
      )}
      
      {/* PIX */}
      {payment.method === "pix" && showQrCode && (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex flex-col items-center">
            <div className="mb-4 rounded-2xl bg-gradient-to-br from-muted to-muted/50 p-4">
              <div className="flex h-36 w-36 items-center justify-center rounded-xl bg-card shadow-inner">
                <QrCode className="h-24 w-24 text-foreground" />
              </div>
            </div>
            <h4 className="font-semibold text-foreground">Pague com PIX</h4>
            <p className="mt-1 text-center text-sm text-muted-foreground">
              Escaneie o QR Code ou copie o código para pagar
            </p>
            <button className="mt-4 w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              Copiar código PIX
            </button>
            <p className="mt-3 text-xs text-muted-foreground">
              O código expira em 30 minutos
            </p>
          </div>
        </div>
      )}

      {/* No payment method selected */}
      {!payment.method && (
        <div className="rounded-xl border border-dashed border-border bg-muted/30 p-6 text-center">
          <CreditCard className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            Selecione uma forma de pagamento acima
          </p>
        </div>
      )}
    </div>
  )
}
