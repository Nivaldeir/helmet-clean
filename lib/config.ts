"use client"

export interface ServiceOption {
  id: string
  name: string
  price: number
  description: string
  features: string[]
  active: boolean
}

export interface TimeSlotConfig {
  time: string
  active: boolean
}

export interface PaymentMethodConfig {
  id: string
  name: string
  active: boolean
  fee: number // porcentagem de taxa
}

export interface DayConfig {
  dayOfWeek: number // 0 = domingo, 6 = sábado
  name: string
  active: boolean
}

export interface ThemeColors {
  primary: string
  accent: string
}

export interface ThemeConfig {
  preset: string
  colors: ThemeColors
  borderRadius: "none" | "small" | "medium" | "large"
  fontStyle: "modern" | "classic" | "rounded"
}

export interface AppConfig {
  companyName: string
  phone: string
  email: string
  logo: string | null // URL ou base64 do logo
  services: ServiceOption[]
  timeSlots: TimeSlotConfig[]
  paymentMethods: PaymentMethodConfig[]
  workingDays: DayConfig[]
  deliveryFee: number
  blockedDates: string[] // datas bloqueadas no formato YYYY-MM-DD
  minAdvanceDays: number // dias mínimos de antecedência
  maxAdvanceDays: number // dias máximos de antecedência
  theme: ThemeConfig
}

export const themePresets = {
  blue: {
    name: "Azul Profissional",
    colors: { primary: "250", accent: "180" }
  },
  emerald: {
    name: "Verde Esmeralda",
    colors: { primary: "160", accent: "140" }
  },
  orange: {
    name: "Laranja Energético",
    colors: { primary: "30", accent: "45" }
  },
  rose: {
    name: "Rosa Moderno",
    colors: { primary: "350", accent: "330" }
  },
  slate: {
    name: "Cinza Elegante",
    colors: { primary: "220", accent: "200" }
  },
  amber: {
    name: "Âmbar Quente",
    colors: { primary: "45", accent: "30" }
  }
} as const

const defaultConfig: AppConfig = {
  companyName: "HelmetClean",
  phone: "(11) 99999-9999",
  email: "contato@helmetclean.com.br",
  logo: null,
  theme: {
    preset: "blue",
    colors: { primary: "250", accent: "180" },
    borderRadius: "medium",
    fontStyle: "modern"
  },
  services: [
    {
      id: "basica",
      name: "Lavagem Básica",
      price: 49,
      description: "Limpeza externa e viseira",
      features: ["Limpeza externa completa", "Polimento da viseira", "Higienização básica"],
      active: true
    },
    {
      id: "completa",
      name: "Lavagem Completa",
      price: 89,
      description: "Limpeza interna e externa",
      features: ["Limpeza externa completa", "Remoção e lavagem do forro", "Higienização antibactericida", "Proteção UV na viseira"],
      active: true
    },
    {
      id: "premium",
      name: "Lavagem Premium",
      price: 149,
      description: "Restauração completa",
      features: ["Tudo da Completa", "Restauração de cores", "Impermeabilização", "Tratamento anti-risco"],
      active: true
    }
  ],
  timeSlots: [
    { time: "08:00", active: true },
    { time: "09:00", active: true },
    { time: "10:00", active: true },
    { time: "11:00", active: true },
    { time: "12:00", active: false },
    { time: "13:00", active: false },
    { time: "14:00", active: true },
    { time: "15:00", active: true },
    { time: "16:00", active: true },
    { time: "17:00", active: true },
    { time: "18:00", active: true },
    { time: "19:00", active: false }
  ],
  paymentMethods: [
    { id: "credit", name: "Cartão de Crédito", active: true, fee: 0 },
    { id: "debit", name: "Cartão de Débito", active: true, fee: 0 },
    { id: "pix", name: "PIX", active: true, fee: 0 }
  ],
  workingDays: [
    { dayOfWeek: 0, name: "Domingo", active: false },
    { dayOfWeek: 1, name: "Segunda", active: true },
    { dayOfWeek: 2, name: "Terça", active: true },
    { dayOfWeek: 3, name: "Quarta", active: true },
    { dayOfWeek: 4, name: "Quinta", active: true },
    { dayOfWeek: 5, name: "Sexta", active: true },
    { dayOfWeek: 6, name: "Sábado", active: true }
  ],
  deliveryFee: 0,
  blockedDates: [],
  minAdvanceDays: 1,
  maxAdvanceDays: 30
}

const CONFIG_KEY = "helmetclean_config"

export function getConfig(): AppConfig {
  if (typeof window === "undefined") return defaultConfig
  
  const stored = localStorage.getItem(CONFIG_KEY)
  if (stored) {
    try {
      return { ...defaultConfig, ...JSON.parse(stored) }
    } catch {
      return defaultConfig
    }
  }
  return defaultConfig
}

export function saveConfig(config: AppConfig): void {
  if (typeof window === "undefined") return
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config))
}

export function resetConfig(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(CONFIG_KEY)
}

export function getActiveServices(): ServiceOption[] {
  return getConfig().services.filter(s => s.active)
}

export function getActiveTimeSlots(): string[] {
  return getConfig().timeSlots.filter(t => t.active).map(t => t.time)
}

export function getActivePaymentMethods(): PaymentMethodConfig[] {
  return getConfig().paymentMethods.filter(p => p.active)
}

export function isWorkingDay(date: Date): boolean {
  const config = getConfig()
  const dayOfWeek = date.getDay()
  const dayConfig = config.workingDays.find(d => d.dayOfWeek === dayOfWeek)
  return dayConfig?.active ?? false
}

export function isDateBlocked(date: Date): boolean {
  const config = getConfig()
  const dateString = date.toISOString().split("T")[0]
  return config.blockedDates.includes(dateString)
}

export function getTheme(): ThemeConfig {
  return getConfig().theme
}

export function getLogo(): string | null {
  return getConfig().logo
}

export function getCompanyName(): string {
  return getConfig().companyName
}

export function getThemeCSS(): string {
  const theme = getTheme()
  const primaryHue = theme.colors.primary
  const accentHue = theme.colors.accent
  
  let radius = "0.625rem"
  switch (theme.borderRadius) {
    case "none": radius = "0"; break
    case "small": radius = "0.375rem"; break
    case "medium": radius = "0.625rem"; break
    case "large": radius = "1rem"; break
  }
  
  return `
    :root {
      --primary: oklch(0.55 0.2 ${primaryHue});
      --primary-foreground: oklch(0.98 0 0);
      --accent: oklch(0.7 0.15 ${accentHue});
      --accent-foreground: oklch(0.15 0.02 ${accentHue});
      --radius: ${radius};
    }
  `
}

export function isDateSelectable(date: Date): boolean {
  const config = getConfig()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const checkDate = new Date(date)
  checkDate.setHours(0, 0, 0, 0)
  
  // Verifica se é no passado
  if (checkDate < today) return false
  
  // Verifica antecedência mínima
  const minDate = new Date(today)
  minDate.setDate(minDate.getDate() + config.minAdvanceDays)
  if (checkDate < minDate) return false
  
  // Verifica antecedência máxima
  const maxDate = new Date(today)
  maxDate.setDate(maxDate.getDate() + config.maxAdvanceDays)
  if (checkDate > maxDate) return false
  
  // Verifica se é dia de trabalho
  if (!isWorkingDay(checkDate)) return false
  
  // Verifica se está bloqueado
  if (isDateBlocked(checkDate)) return false
  
  return true
}
