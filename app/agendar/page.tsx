"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/header"
import { BookingCalendar } from "@/components/booking-calendar"
import { TimeSlots } from "@/components/time-slots"
import { ServiceSelector } from "@/components/service-selector"
import { getActiveServices } from "@/lib/config"
import { AddressForm, type AddressData } from "@/components/address-form"
import { PaymentForm, type PaymentData } from "@/components/payment-form"
import { BookingSummary } from "@/components/booking-summary"

type Step = "service" | "schedule" | "address" | "payment"

export default function AgendarPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>("service")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [address, setAddress] = useState<AddressData>({
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: ""
  })
  const [payment, setPayment] = useState<PaymentData>({
    method: null,
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: ""
  })

  const steps: { id: Step; label: string }[] = [
    { id: "service", label: "Serviço" },
    { id: "schedule", label: "Agenda" },
    { id: "address", label: "Endereço" },
    { id: "payment", label: "Pagamento" }
  ]

  const currentStepIndex = steps.findIndex(s => s.id === currentStep)

  const canProceed = () => {
    switch (currentStep) {
      case "service":
        return selectedService !== null
      case "schedule":
        return selectedDate !== null && selectedTime !== null
      case "address":
        return address.cep && address.street && address.number && address.city && customerName && customerPhone
      case "payment":
        if (payment.method === "pix") return true
        return payment.method && payment.cardNumber && payment.cardName && payment.cardExpiry && payment.cardCvv
      default:
        return false
    }
  }

  const nextStep = () => {
    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id)
    }
  }

  const prevStep = () => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const services = getActiveServices()
    const service = services.find(s => s.id === selectedService)
    
    // Store booking in localStorage for demo
    const booking = {
      id: Math.random().toString(36).substring(7).toUpperCase(),
      service: service?.name,
      price: service?.price,
      date: selectedDate?.toISOString(),
      time: selectedTime,
      customer: {
        name: customerName,
        phone: customerPhone,
        email: customerEmail
      },
      address,
      paymentMethod: payment.method,
      createdAt: new Date().toISOString()
    }
    
    localStorage.setItem("lastBooking", JSON.stringify(booking))
    
    setIsSubmitting(false)
    router.push("/confirmacao")
  }

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, "")
    if (cleaned.length <= 2) return cleaned
    if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="mx-auto max-w-6xl px-4 py-6 md:py-10">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                      index < currentStepIndex
                        ? "bg-primary text-primary-foreground"
                        : index === currentStepIndex
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {index < currentStepIndex ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className={`mt-2 text-xs font-medium ${
                    index <= currentStepIndex ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 w-8 sm:w-16 ${
                      index < currentStepIndex ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === "service" && (
              <div className="rounded-xl border border-border bg-card p-4 md:p-6">
                <h2 className="mb-6 text-xl font-semibold text-foreground">
                  Escolha o tipo de lavagem
                </h2>
                <ServiceSelector 
                  selectedService={selectedService}
                  onSelectService={setSelectedService}
                />
              </div>
            )}

            {currentStep === "schedule" && (
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-card p-4 md:p-6">
                  <h2 className="mb-6 text-xl font-semibold text-foreground">
                    Escolha a data e horário da coleta
                  </h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    <BookingCalendar 
                      selectedDate={selectedDate}
                      onSelectDate={setSelectedDate}
                    />
                    <TimeSlots 
                      selectedDate={selectedDate}
                      selectedTime={selectedTime}
                      onSelectTime={setSelectedTime}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === "address" && (
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-card p-4 md:p-6">
                  <h2 className="mb-6 text-xl font-semibold text-foreground">
                    Seus dados
                  </h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome completo</Label>
                      <Input
                        id="name"
                        placeholder="Seu nome"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone / WhatsApp</Label>
                        <Input
                          id="phone"
                          placeholder="(11) 99999-9999"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(formatPhone(e.target.value))}
                          maxLength={15}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail (opcional)</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <AddressForm 
                  address={address}
                  onAddressChange={setAddress}
                />
              </div>
            )}

            {currentStep === "payment" && (
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-card p-4 md:p-6">
                  <h2 className="mb-6 text-xl font-semibold text-foreground">
                    Forma de pagamento
                  </h2>
                  <PaymentForm 
                    payment={payment}
                    onPaymentChange={setPayment}
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-6 flex items-center justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStepIndex === 0}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
              
              {currentStep === "payment" ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed() || isSubmitting}
                  className="gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      Finalizar Pedido
                      <Check className="h-4 w-4" />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="gap-2"
                >
                  Continuar
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="order-first lg:order-last">
            <div className="sticky top-24">
              <BookingSummary 
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                selectedService={selectedService}
                address={address}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
