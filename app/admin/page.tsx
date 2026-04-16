"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Settings, 
  CreditCard, 
  Clock, 
  Calendar,
  Package,
  RotateCcw,
  Check,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { 
  type AppConfig, 
  type ServiceOption,
  getConfig, 
  saveConfig, 
  resetConfig 
} from "@/lib/config"

type Tab = "services" | "schedule" | "payments" | "settings"

export default function AdminPage() {
  const [config, setConfig] = useState<AppConfig | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>("services")
  const [saved, setSaved] = useState(false)
  const [calendarMonth, setCalendarMonth] = useState(new Date())

  useEffect(() => {
    setConfig(getConfig())
  }, [])

  const handleSave = () => {
    if (config) {
      saveConfig(config)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const handleReset = () => {
    if (confirm("Tem certeza que deseja restaurar as configurações padrão?")) {
      resetConfig()
      setConfig(getConfig())
    }
  }

  const updateService = (index: number, updates: Partial<ServiceOption>) => {
    if (!config) return
    const newServices = [...config.services]
    newServices[index] = { ...newServices[index], ...updates }
    setConfig({ ...config, services: newServices })
  }

  const addService = () => {
    if (!config) return
    const newService: ServiceOption = {
      id: `service_${Date.now()}`,
      name: "Novo Serviço",
      price: 0,
      description: "Descrição do serviço",
      features: [],
      active: true
    }
    setConfig({ ...config, services: [...config.services, newService] })
  }

  const removeService = (index: number) => {
    if (!config) return
    const newServices = config.services.filter((_, i) => i !== index)
    setConfig({ ...config, services: newServices })
  }

  const addFeature = (serviceIndex: number) => {
    if (!config) return
    const newServices = [...config.services]
    newServices[serviceIndex].features.push("Nova característica")
    setConfig({ ...config, services: newServices })
  }

  const updateFeature = (serviceIndex: number, featureIndex: number, value: string) => {
    if (!config) return
    const newServices = [...config.services]
    newServices[serviceIndex].features[featureIndex] = value
    setConfig({ ...config, services: newServices })
  }

  const removeFeature = (serviceIndex: number, featureIndex: number) => {
    if (!config) return
    const newServices = [...config.services]
    newServices[serviceIndex].features = newServices[serviceIndex].features.filter((_, i) => i !== featureIndex)
    setConfig({ ...config, services: newServices })
  }

  const toggleTimeSlot = (index: number) => {
    if (!config) return
    const newSlots = [...config.timeSlots]
    newSlots[index].active = !newSlots[index].active
    setConfig({ ...config, timeSlots: newSlots })
  }

  const toggleWorkingDay = (index: number) => {
    if (!config) return
    const newDays = [...config.workingDays]
    newDays[index].active = !newDays[index].active
    setConfig({ ...config, workingDays: newDays })
  }

  const togglePaymentMethod = (index: number) => {
    if (!config) return
    const newMethods = [...config.paymentMethods]
    newMethods[index].active = !newMethods[index].active
    setConfig({ ...config, paymentMethods: newMethods })
  }

  const toggleBlockedDate = (date: Date) => {
    if (!config) return
    const dateString = date.toISOString().split("T")[0]
    const isBlocked = config.blockedDates.includes(dateString)
    
    if (isBlocked) {
      setConfig({
        ...config,
        blockedDates: config.blockedDates.filter(d => d !== dateString)
      })
    } else {
      setConfig({
        ...config,
        blockedDates: [...config.blockedDates, dateString]
      })
    }
  }

  if (!config) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    )
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "services", label: "Serviços", icon: <Package className="h-4 w-4" /> },
    { id: "schedule", label: "Agenda", icon: <Calendar className="h-4 w-4" /> },
    { id: "payments", label: "Pagamentos", icon: <CreditCard className="h-4 w-4" /> },
    { id: "settings", label: "Geral", icon: <Settings className="h-4 w-4" /> }
  ]

  // Calendar helpers
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ]
  
  const dayNames = ["D", "S", "T", "Q", "Q", "S", "S"]
  
  const daysInMonth = new Date(
    calendarMonth.getFullYear(),
    calendarMonth.getMonth() + 1,
    0
  ).getDate()
  
  const firstDayOfMonth = new Date(
    calendarMonth.getFullYear(),
    calendarMonth.getMonth(),
    1
  ).getDay()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Painel Admin</h1>
              <p className="text-sm text-muted-foreground">Configurações do sistema</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Restaurar</span>
            </Button>
            <Button size="sm" onClick={handleSave} className="gap-2">
              {saved ? (
                <>
                  <Check className="h-4 w-4" />
                  Salvo!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Salvar
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {/* Tabs */}
        <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl bg-muted p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Services Tab */}
        {activeTab === "services" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Serviços de Lavagem</h2>
              <Button onClick={addService} size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar
              </Button>
            </div>

            <div className="space-y-4">
              {config.services.map((service, index) => (
                <div key={service.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={service.active}
                        onCheckedChange={(checked) => updateService(index, { active: checked })}
                      />
                      <span className={`text-sm ${service.active ? "text-foreground" : "text-muted-foreground"}`}>
                        {service.active ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeService(index)}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Nome do serviço</Label>
                      <Input
                        value={service.name}
                        onChange={(e) => updateService(index, { name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Preço (R$)</Label>
                      <Input
                        type="number"
                        value={service.price}
                        onChange={(e) => updateService(index, { price: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <Label>Descrição</Label>
                    <Input
                      value={service.description}
                      onChange={(e) => updateService(index, { description: e.target.value })}
                    />
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Características</Label>
                      <Button variant="ghost" size="sm" onClick={() => addFeature(index)} className="gap-1 text-xs">
                        <Plus className="h-3 w-3" />
                        Adicionar
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2">
                          <Input
                            value={feature}
                            onChange={(e) => updateFeature(index, featureIndex, e.target.value)}
                            className="flex-1"
                          />
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => removeFeature(index, featureIndex)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === "schedule" && (
          <div className="space-y-6">
            {/* Working Days */}
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="mb-4 font-semibold text-foreground">Dias de Funcionamento</h3>
              <div className="grid grid-cols-7 gap-2">
                {config.workingDays.map((day, index) => (
                  <button
                    key={day.dayOfWeek}
                    onClick={() => toggleWorkingDay(index)}
                    className={`flex flex-col items-center gap-1 rounded-lg border p-3 transition-colors ${
                      day.active
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-muted text-muted-foreground"
                    }`}
                  >
                    <span className="text-xs font-medium">{day.name.slice(0, 3)}</span>
                    {day.active ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="mb-4 font-semibold text-foreground">
                <Clock className="mb-1 mr-2 inline h-4 w-4" />
                Horários Disponíveis
              </h3>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                {config.timeSlots.map((slot, index) => (
                  <button
                    key={slot.time}
                    onClick={() => toggleTimeSlot(index)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      slot.active
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-muted text-muted-foreground line-through"
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>

            {/* Blocked Dates Calendar */}
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="mb-4 font-semibold text-foreground">
                <Calendar className="mb-1 mr-2 inline h-4 w-4" />
                Bloquear Datas
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Clique nas datas para bloquear/desbloquear. Datas em vermelho estão bloqueadas.
              </p>
              
              <div className="rounded-lg border border-border p-4">
                <div className="mb-4 flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))}
                    className="h-8 w-8"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="font-medium text-foreground">
                    {monthNames[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))}
                    className="h-8 w-8"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {dayNames.map((day) => (
                    <div key={day} className="py-2 text-center text-xs font-medium text-muted-foreground">
                      {day}
                    </div>
                  ))}
                  
                  {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                    <div key={`empty-${index}`} />
                  ))}
                  
                  {Array.from({ length: daysInMonth }).map((_, index) => {
                    const day = index + 1
                    const date = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day)
                    const dateString = date.toISOString().split("T")[0]
                    const isBlocked = config.blockedDates.includes(dateString)
                    const dayOfWeek = date.getDay()
                    const isWorkDay = config.workingDays.find(d => d.dayOfWeek === dayOfWeek)?.active

                    return (
                      <button
                        key={day}
                        onClick={() => toggleBlockedDate(date)}
                        className={`flex h-10 items-center justify-center rounded-lg text-sm transition-colors ${
                          isBlocked
                            ? "bg-destructive/20 text-destructive font-medium"
                            : !isWorkDay
                            ? "bg-muted text-muted-foreground"
                            : "bg-background text-foreground hover:bg-muted"
                        }`}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Advance Settings */}
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="mb-4 font-semibold text-foreground">Configurações de Antecedência</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Dias mínimos de antecedência</Label>
                  <Input
                    type="number"
                    min="0"
                    value={config.minAdvanceDays}
                    onChange={(e) => setConfig({ ...config, minAdvanceDays: Number(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Ex: 1 = cliente pode agendar a partir de amanhã
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Dias máximos de antecedência</Label>
                  <Input
                    type="number"
                    min="1"
                    value={config.maxAdvanceDays}
                    onChange={(e) => setConfig({ ...config, maxAdvanceDays: Number(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Ex: 30 = cliente pode agendar até 30 dias no futuro
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === "payments" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="mb-4 font-semibold text-foreground">Meios de Pagamento</h3>
              <div className="space-y-3">
                {config.paymentMethods.map((method, index) => (
                  <div 
                    key={method.id} 
                    className={`flex items-center justify-between rounded-lg border p-4 transition-colors ${
                      method.active ? "border-border bg-background" : "border-border bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={method.active}
                        onCheckedChange={() => togglePaymentMethod(index)}
                      />
                      <div>
                        <span className={`font-medium ${method.active ? "text-foreground" : "text-muted-foreground"}`}>
                          {method.name}
                        </span>
                        {method.id === "pix" && (
                          <p className="text-xs text-muted-foreground">Pagamento instantâneo</p>
                        )}
                        {method.id === "credit" && (
                          <p className="text-xs text-muted-foreground">Parcelamento disponível</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {method.id === "credit" && (
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="mb-4 font-semibold text-foreground">Taxa de Entrega</h3>
              <div className="space-y-2">
                <Label>Valor da taxa de coleta/entrega (R$)</Label>
                <Input
                  type="number"
                  min="0"
                  value={config.deliveryFee}
                  onChange={(e) => setConfig({ ...config, deliveryFee: Number(e.target.value) })}
                />
                <p className="text-xs text-muted-foreground">
                  Deixe 0 para frete grátis
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="mb-4 font-semibold text-foreground">Informações da Empresa</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome da empresa</Label>
                  <Input
                    value={config.companyName}
                    onChange={(e) => setConfig({ ...config, companyName: e.target.value })}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Telefone / WhatsApp</Label>
                    <Input
                      value={config.phone}
                      onChange={(e) => setConfig({ ...config, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>E-mail</Label>
                    <Input
                      type="email"
                      value={config.email}
                      onChange={(e) => setConfig({ ...config, email: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
