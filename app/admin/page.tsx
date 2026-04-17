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
  ChevronRight,
  Menu,
  Home,
  Users,
  BarChart3,
  Smartphone,
  QrCode,
  Banknote,
  AlertCircle,
  Palette,
  Circle,
  Square,
  Type,
  Upload,
  ImageIcon
} from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { 
  type AppConfig, 
  type ServiceOption,
  type ThemeConfig,
  getConfig, 
  saveConfig, 
  resetConfig,
  themePresets
} from "@/lib/config"

type Tab = "dashboard" | "services" | "schedule" | "payments" | "appearance" | "settings"

interface Booking {
  id: string
  customerName: string
  service: string
  date: string
  time: string
  status: "pending" | "confirmed" | "completed"
  total: number
}

// Mock bookings for dashboard
const mockBookings: Booking[] = [
  { id: "1", customerName: "João Silva", service: "Lavagem Completa", date: "2026-04-18", time: "09:00", status: "confirmed", total: 89 },
  { id: "2", customerName: "Maria Santos", service: "Lavagem Premium", date: "2026-04-18", time: "14:00", status: "pending", total: 149 },
  { id: "3", customerName: "Carlos Oliveira", service: "Lavagem Básica", date: "2026-04-19", time: "10:00", status: "confirmed", total: 49 },
]

export default function AdminPage() {
  const [config, setConfig] = useState<AppConfig | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>("dashboard")
  const [saved, setSaved] = useState(false)
  const [calendarMonth, setCalendarMonth] = useState(new Date())
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    setConfig(getConfig())
  }, [])

  const handleSave = () => {
    if (config) {
      saveConfig(config)
      setSaved(true)
      // Dispatch custom event to update theme in real-time
      window.dispatchEvent(new Event("themeUpdate"))
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const handleReset = () => {
    if (confirm("Tem certeza que deseja restaurar as configurações padrão?")) {
      resetConfig()
      setConfig(getConfig())
      window.dispatchEvent(new Event("themeUpdate"))
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

  const updateTheme = (updates: Partial<ThemeConfig>) => {
    if (!config) return
    setConfig({
      ...config,
      theme: { ...config.theme, ...updates }
    })
  }

  const applyPreset = (presetKey: string) => {
    if (!config) return
    const preset = themePresets[presetKey as keyof typeof themePresets]
    if (preset) {
      setConfig({
        ...config,
        theme: {
          ...config.theme,
          preset: presetKey,
          colors: { ...preset.colors }
        }
      })
    }
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !config) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecione apenas arquivos de imagem.")
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("A imagem deve ter no máximo 2MB.")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      setConfig({ ...config, logo: base64 })
    }
    reader.readAsDataURL(file)
  }

  const removeLogo = () => {
    if (!config) return
    setConfig({ ...config, logo: null })
  }

  if (!config) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Carregando...
        </div>
      </div>
    )
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard", label: "Dashboard", icon: <Home className="h-5 w-5" /> },
    { id: "services", label: "Serviços", icon: <Package className="h-5 w-5" /> },
    { id: "schedule", label: "Agenda", icon: <Calendar className="h-5 w-5" /> },
    { id: "payments", label: "Pagamentos", icon: <CreditCard className="h-5 w-5" /> },
    { id: "appearance", label: "Aparência", icon: <Palette className="h-5 w-5" /> },
    { id: "settings", label: "Configurações", icon: <Settings className="h-5 w-5" /> }
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

  // Stats for dashboard
  const totalBookings = mockBookings.length
  const pendingBookings = mockBookings.filter(b => b.status === "pending").length
  const totalRevenue = mockBookings.reduce((acc, b) => acc + b.total, 0)
  const activeServices = config.services.filter(s => s.active).length

  const getPaymentIcon = (id: string) => {
    switch (id) {
      case "credit":
        return <CreditCard className="h-5 w-5" />
      case "debit":
        return <Smartphone className="h-5 w-5" />
      case "pix":
        return <QrCode className="h-5 w-5" />
      default:
        return <Banknote className="h-5 w-5" />
    }
  }

  const getStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "pending":
        return <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">Pendente</span>
      case "confirmed":
        return <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">Confirmado</span>
      case "completed":
        return <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">Concluído</span>
    }
  }

  // Color preview helper
  const getColorPreview = (hue: string) => {
    return `oklch(0.55 0.2 ${hue})`
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card transition-transform lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Package className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground">{config.companyName}</h1>
            <p className="text-xs text-muted-foreground">Painel Admin</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                setSidebarOpen(false)
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="border-t border-border p-4">
          <Link href="/">
            <Button variant="outline" className="w-full gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Site
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Top header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="font-semibold text-foreground">
                {tabs.find(t => t.id === activeTab)?.label}
              </h2>
              <p className="text-xs text-muted-foreground">
                {activeTab === "dashboard" && "Visão geral do sistema"}
                {activeTab === "services" && "Gerencie os serviços oferecidos"}
                {activeTab === "schedule" && "Configure horários e datas"}
                {activeTab === "payments" && "Métodos de pagamento e taxas"}
                {activeTab === "appearance" && "Personalize a aparência do site"}
                {activeTab === "settings" && "Informações da empresa"}
              </p>
            </div>
          </div>
          
          {activeTab !== "dashboard" && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleReset} className="hidden gap-2 sm:flex">
                <RotateCcw className="h-4 w-4" />
                Restaurar
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
          )}
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Stats cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Agendamentos</p>
                      <p className="mt-1 text-2xl font-bold text-foreground">{totalBookings}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pendentes</p>
                      <p className="mt-1 text-2xl font-bold text-amber-600">{pendingBookings}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                      <AlertCircle className="h-6 w-6 text-amber-600" />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Receita Total</p>
                      <p className="mt-1 text-2xl font-bold text-emerald-600">R$ {totalRevenue}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                      <BarChart3 className="h-6 w-6 text-emerald-600" />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Serviços Ativos</p>
                      <p className="mt-1 text-2xl font-bold text-foreground">{activeServices}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent bookings */}
              <div className="rounded-xl border border-border bg-card">
                <div className="flex items-center justify-between border-b border-border p-5">
                  <div>
                    <h3 className="font-semibold text-foreground">Agendamentos Recentes</h3>
                    <p className="text-sm text-muted-foreground">Últimas solicitações de serviço</p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Users className="h-4 w-4" />
                    Ver Todos
                  </Button>
                </div>
                
                <div className="divide-y divide-border">
                  {mockBookings.map((booking) => (
                    <div key={booking.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted font-medium text-foreground">
                          {booking.customerName.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{booking.customerName}</p>
                          <p className="text-sm text-muted-foreground">{booking.service}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                        <div className="text-sm text-muted-foreground">
                          {new Date(booking.date).toLocaleDateString("pt-BR")} às {booking.time}
                        </div>
                        {getStatusBadge(booking.status)}
                        <span className="font-semibold text-foreground">R$ {booking.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick actions */}
              <div className="grid gap-4 sm:grid-cols-3">
                <button 
                  onClick={() => setActiveTab("services")}
                  className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 text-left transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Gerenciar Serviços</p>
                    <p className="text-sm text-muted-foreground">Preços e descrições</p>
                  </div>
                </button>

                <button 
                  onClick={() => setActiveTab("schedule")}
                  className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 text-left transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/30">
                    <Calendar className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Configurar Agenda</p>
                    <p className="text-sm text-muted-foreground">Horários e bloqueios</p>
                  </div>
                </button>

                <button 
                  onClick={() => setActiveTab("appearance")}
                  className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 text-left transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-rose-100">
                    <Palette className="h-6 w-6 text-rose-600" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Aparência</p>
                    <p className="text-sm text-muted-foreground">Cores e estilos</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === "services" && (
            <div className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">Serviços de Lavagem</h3>
                  <p className="text-sm text-muted-foreground">Configure os serviços oferecidos e seus preços</p>
                </div>
                <Button onClick={addService} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Adicionar Serviço
                </Button>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {config.services.map((service, index) => (
                  <div 
                    key={service.id} 
                    className={`rounded-xl border bg-card transition-all ${
                      service.active ? "border-border" : "border-border/50 opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-border p-4">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={service.active}
                          onCheckedChange={(checked) => updateService(index, { active: checked })}
                        />
                        <span className="text-sm text-muted-foreground">
                          {service.active ? "Ativo" : "Inativo"}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeService(index)}
                        className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-4 p-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Nome do Serviço</Label>
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

                      <div className="space-y-2">
                        <Label>Descrição</Label>
                        <Input
                          value={service.description}
                          onChange={(e) => updateService(index, { description: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Características</Label>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => addFeature(index)}
                            className="h-7 gap-1 text-xs"
                          >
                            <Plus className="h-3 w-3" />
                            Adicionar
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {service.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex gap-2">
                              <Input
                                value={feature}
                                onChange={(e) => updateFeature(index, featureIndex, e.target.value)}
                                className="flex-1"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFeature(index, featureIndex)}
                                className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
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
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-4 font-semibold text-foreground">Dias de Funcionamento</h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {config.workingDays.map((day, index) => (
                    <div
                      key={day.dayOfWeek}
                      className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${
                        day.active 
                          ? "border-primary/30 bg-primary/5" 
                          : "border-border bg-muted/30"
                      }`}
                    >
                      <span className={`font-medium ${day.active ? "text-foreground" : "text-muted-foreground"}`}>
                        {day.name}
                      </span>
                      <Switch
                        checked={day.active}
                        onCheckedChange={() => toggleWorkingDay(index)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-4 font-semibold text-foreground">Horários Disponíveis</h3>
                <div className="space-y-4">
                  <div>
                    <p className="mb-2 text-sm font-medium text-muted-foreground">Manhã</p>
                    <div className="flex flex-wrap gap-2">
                      {config.timeSlots.filter(slot => parseInt(slot.time) < 12).map((slot, index) => (
                        <button
                          key={slot.time}
                          onClick={() => toggleTimeSlot(index)}
                          className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                            slot.active
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-muted/30 text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-medium text-muted-foreground">Tarde</p>
                    <div className="flex flex-wrap gap-2">
                      {config.timeSlots.filter(slot => parseInt(slot.time) >= 12).map((slot, originalIndex) => {
                        const index = config.timeSlots.findIndex(s => s.time === slot.time)
                        return (
                          <button
                            key={slot.time}
                            onClick={() => toggleTimeSlot(index)}
                            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                              slot.active
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-muted/30 text-muted-foreground hover:bg-muted"
                            }`}
                          >
                            {slot.time}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Advance Settings */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-4 font-semibold text-foreground">Antecedência</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Mínimo de dias de antecedência</Label>
                    <Input
                      type="number"
                      value={config.minAdvanceDays}
                      onChange={(e) => setConfig({ ...config, minAdvanceDays: Number(e.target.value) })}
                      min={0}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Máximo de dias de antecedência</Label>
                    <Input
                      type="number"
                      value={config.maxAdvanceDays}
                      onChange={(e) => setConfig({ ...config, maxAdvanceDays: Number(e.target.value) })}
                      min={1}
                    />
                  </div>
                </div>
              </div>

              {/* Calendar Blocked Dates */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-4 font-semibold text-foreground">Bloquear Datas</h3>
                <p className="mb-4 text-sm text-muted-foreground">Clique nas datas para bloquear/desbloquear</p>
                
                <div className="flex items-center justify-between mb-4">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="font-medium">
                    {monthNames[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
                  </span>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {dayNames.map((name) => (
                    <div key={name} className="py-2 text-center text-xs font-medium text-muted-foreground">
                      {name}
                    </div>
                  ))}
                  
                  {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1
                    const date = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day)
                    const dateString = date.toISOString().split("T")[0]
                    const isBlocked = config.blockedDates.includes(dateString)
                    const isWorkDay = config.workingDays[date.getDay()]?.active
                    const isPast = date < new Date(new Date().setHours(0, 0, 0, 0))

                    return (
                      <button
                        key={day}
                        onClick={() => !isPast && toggleBlockedDate(date)}
                        disabled={isPast}
                        className={`rounded-lg p-2 text-sm font-medium transition-colors ${
                          isPast
                            ? "text-muted-foreground/40 cursor-not-allowed"
                            : isBlocked
                              ? "bg-destructive/10 text-destructive border border-destructive/30"
                              : !isWorkDay
                                ? "bg-muted/50 text-muted-foreground"
                                : "hover:bg-muted text-foreground"
                        }`}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>

                <div className="mt-4 flex flex-wrap gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-destructive/20 border border-destructive/30" />
                    <span className="text-muted-foreground">Bloqueado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-muted/50" />
                    <span className="text-muted-foreground">Não trabalha</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === "payments" && (
            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-4 font-semibold text-foreground">Métodos de Pagamento</h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {config.paymentMethods.map((method, index) => (
                    <div
                      key={method.id}
                      className={`flex items-center justify-between rounded-xl border p-4 transition-colors ${
                        method.active 
                          ? "border-primary/30 bg-primary/5" 
                          : "border-border bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          method.active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                        }`}>
                          {getPaymentIcon(method.id)}
                        </div>
                        <span className={`font-medium ${method.active ? "text-foreground" : "text-muted-foreground"}`}>
                          {method.name}
                        </span>
                      </div>
                      <Switch
                        checked={method.active}
                        onCheckedChange={() => togglePaymentMethod(index)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-4 font-semibold text-foreground">Taxa de Entrega</h3>
                <div className="max-w-sm space-y-2">
                  <Label>Valor da taxa de entrega (R$)</Label>
                  <Input
                    type="number"
                    value={config.deliveryFee}
                    onChange={(e) => setConfig({ ...config, deliveryFee: Number(e.target.value) })}
                    min={0}
                    step={0.01}
                  />
                  <p className="text-xs text-muted-foreground">
                    Deixe 0 para não cobrar taxa de entrega
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === "appearance" && (
            <div className="space-y-6">
              {/* Logo Upload */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-2 font-semibold text-foreground">Logo da Empresa</h3>
                <p className="mb-4 text-sm text-muted-foreground">Faça upload do logo para exibir no site (recomendado: 200x60px, PNG ou SVG)</p>
                
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  {/* Preview */}
                  <div className="flex h-32 w-48 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30">
                    {config.logo ? (
                      <Image
                        src={config.logo}
                        alt="Logo"
                        width={160}
                        height={60}
                        className="max-h-24 max-w-40 object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <ImageIcon className="h-8 w-8" />
                        <span className="text-xs">Nenhum logo</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Upload controls */}
                  <div className="flex flex-col gap-3">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                        <Upload className="h-4 w-4" />
                        {config.logo ? "Trocar Logo" : "Enviar Logo"}
                      </div>
                    </label>
                    
                    {config.logo && (
                      <Button variant="outline" size="sm" onClick={removeLogo} className="gap-2">
                        <Trash2 className="h-4 w-4" />
                        Remover Logo
                      </Button>
                    )}
                    
                    <p className="text-xs text-muted-foreground">
                      Formatos: PNG, JPG, SVG, WebP. Tamanho máximo: 2MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Color Presets */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-2 font-semibold text-foreground">Tema de Cores</h3>
                <p className="mb-4 text-sm text-muted-foreground">Escolha um tema pronto ou personalize as cores</p>
                
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(themePresets).map(([key, preset]) => (
                    <button
                      key={key}
                      onClick={() => applyPreset(key)}
                      className={`group flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                        config.theme.preset === key
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "border-border hover:border-primary/30 hover:bg-muted/50"
                      }`}
                    >
                      <div 
                        className="h-10 w-10 rounded-lg shadow-sm"
                        style={{ backgroundColor: getColorPreview(preset.colors.primary) }}
                      />
                      <div>
                        <p className="font-medium text-foreground">{preset.name}</p>
                        <p className="text-xs text-muted-foreground">Cor primária</p>
                      </div>
                      {config.theme.preset === key && (
                        <div className="ml-auto">
                          <Check className="h-5 w-5 text-primary" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Colors */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-2 font-semibold text-foreground">Cores Personalizadas</h3>
                <p className="mb-4 text-sm text-muted-foreground">Ajuste fino das cores (valores de matiz 0-360)</p>
                
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Circle className="h-4 w-4" style={{ color: getColorPreview(config.theme.colors.primary) }} />
                      Cor Primária (Hue: {config.theme.colors.primary})
                    </Label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={config.theme.colors.primary}
                      onChange={(e) => updateTheme({ 
                        colors: { ...config.theme.colors, primary: e.target.value },
                        preset: "custom"
                      })}
                      className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, 
                          oklch(0.55 0.2 0), oklch(0.55 0.2 60), oklch(0.55 0.2 120), 
                          oklch(0.55 0.2 180), oklch(0.55 0.2 240), oklch(0.55 0.2 300), oklch(0.55 0.2 360))`
                      }}
                    />
                    <div 
                      className="h-12 w-full rounded-lg shadow-inner"
                      style={{ backgroundColor: getColorPreview(config.theme.colors.primary) }}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Circle className="h-4 w-4" style={{ color: `oklch(0.7 0.15 ${config.theme.colors.accent})` }} />
                      Cor de Destaque (Hue: {config.theme.colors.accent})
                    </Label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={config.theme.colors.accent}
                      onChange={(e) => updateTheme({ 
                        colors: { ...config.theme.colors, accent: e.target.value },
                        preset: "custom"
                      })}
                      className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, 
                          oklch(0.7 0.15 0), oklch(0.7 0.15 60), oklch(0.7 0.15 120), 
                          oklch(0.7 0.15 180), oklch(0.7 0.15 240), oklch(0.7 0.15 300), oklch(0.7 0.15 360))`
                      }}
                    />
                    <div 
                      className="h-12 w-full rounded-lg shadow-inner"
                      style={{ backgroundColor: `oklch(0.7 0.15 ${config.theme.colors.accent})` }}
                    />
                  </div>
                </div>
              </div>

              {/* Border Radius */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-2 font-semibold text-foreground">Arredondamento</h3>
                <p className="mb-4 text-sm text-muted-foreground">Estilo dos cantos dos elementos</p>
                
                <div className="grid gap-3 sm:grid-cols-4">
                  {[
                    { value: "none", label: "Nenhum", preview: "rounded-none" },
                    { value: "small", label: "Pequeno", preview: "rounded" },
                    { value: "medium", label: "Médio", preview: "rounded-lg" },
                    { value: "large", label: "Grande", preview: "rounded-xl" }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateTheme({ borderRadius: option.value as ThemeConfig["borderRadius"] })}
                      className={`flex flex-col items-center gap-3 rounded-xl border p-4 transition-all ${
                        config.theme.borderRadius === option.value
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "border-border hover:border-primary/30 hover:bg-muted/50"
                      }`}
                    >
                      <div 
                        className={`h-12 w-12 bg-primary ${option.preview}`}
                      />
                      <span className="text-sm font-medium text-foreground">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Style */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-2 font-semibold text-foreground">Estilo de Fonte</h3>
                <p className="mb-4 text-sm text-muted-foreground">Tipografia geral do site</p>
                
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { value: "modern", label: "Moderna", description: "Geist - Clean e minimalista", font: "font-sans" },
                    { value: "classic", label: "Clássica", description: "Serif - Elegante e tradicional", font: "font-serif" },
                    { value: "rounded", label: "Arredondada", description: "Nunito - Amigável e suave", font: "font-sans" }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateTheme({ fontStyle: option.value as ThemeConfig["fontStyle"] })}
                      className={`flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all ${
                        config.theme.fontStyle === option.value
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "border-border hover:border-primary/30 hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Type className="h-5 w-5 text-primary" />
                        <span className="font-semibold text-foreground">{option.label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                      <div className={`mt-2 text-2xl ${option.font}`}>
                        Aa Bb Cc
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-4 font-semibold text-foreground">Preview</h3>
                <div className="space-y-4 rounded-lg border border-border bg-background p-6">
                  <div className="flex items-center gap-3">
                    <Button>Botão Primário</Button>
                    <Button variant="outline">Botão Outline</Button>
                    <Button variant="secondary">Secundário</Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span 
                      className="rounded-full px-3 py-1 text-sm font-medium text-white"
                      style={{ backgroundColor: getColorPreview(config.theme.colors.primary) }}
                    >
                      Tag Primária
                    </span>
                    <span 
                      className="rounded-full px-3 py-1 text-sm font-medium"
                      style={{ 
                        backgroundColor: `oklch(0.9 0.05 ${config.theme.colors.accent})`,
                        color: `oklch(0.3 0.1 ${config.theme.colors.accent})`
                      }}
                    >
                      Tag Destaque
                    </span>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <p className="font-semibold text-foreground">Card de Exemplo</p>
                    <p className="text-sm text-muted-foreground">
                      Este é um exemplo de como os elementos ficarão com as cores selecionadas.
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Salve as alterações para aplicar no site. As mudanças serão visíveis em tempo real.
                </p>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-4 font-semibold text-foreground">Informações da Empresa</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Nome da Empresa</Label>
                    <Input
                      value={config.companyName}
                      onChange={(e) => setConfig({ ...config, companyName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Telefone</Label>
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

              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
                <h3 className="mb-2 font-semibold text-destructive">Zona de Perigo</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Restaurar todas as configurações para o padrão. Esta ação não pode ser desfeita.
                </p>
                <Button variant="destructive" onClick={handleReset} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Restaurar Configurações Padrão
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
