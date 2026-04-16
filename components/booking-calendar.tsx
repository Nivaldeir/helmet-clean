"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { isDateSelectable, getConfig } from "@/lib/config"

interface BookingCalendarProps {
  selectedDate: Date | null
  onSelectDate: (date: Date) => void
}

export function BookingCalendar({ selectedDate, onSelectDate }: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate()
  
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay()
  
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ]
  
  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
  
  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }
  
  const isSelected = (day: number) => {
    if (!selectedDate) return false
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getFullYear() === currentMonth.getFullYear()
    )
  }
  
  const isToday = (day: number) => {
    const todayCheck = new Date()
    return (
      todayCheck.getDate() === day &&
      todayCheck.getMonth() === currentMonth.getMonth() &&
      todayCheck.getFullYear() === currentMonth.getFullYear()
    )
  }
  
  const handleDateClick = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    if (mounted && isDateSelectable(date)) {
      onSelectDate(date)
    }
  }
  
  const canGoPrevious = () => {
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    const todayMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    return prevMonth >= todayMonth
  }

  const canGoNext = () => {
    if (!mounted) return true
    const config = getConfig()
    const maxDate = new Date(today)
    maxDate.setDate(maxDate.getDate() + config.maxAdvanceDays)
    const nextMonthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    return nextMonthStart <= maxDate
  }

  // Calcular estatísticas do mês
  const getMonthStats = () => {
    if (!mounted) return { available: 0, total: daysInMonth }
    let available = 0
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      if (isDateSelectable(date)) available++
    }
    return { available, total: daysInMonth }
  }

  const stats = getMonthStats()
  
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header com gradiente */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={previousMonth}
            disabled={!canGoPrevious()}
            className="h-9 w-9 rounded-full hover:bg-background/80"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground">
              {monthNames[currentMonth.getMonth()]}
            </h3>
            <span className="text-sm text-muted-foreground">
              {currentMonth.getFullYear()}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextMonth}
            disabled={!canGoNext()}
            className="h-9 w-9 rounded-full hover:bg-background/80"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        {/* Dias da semana */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day, index) => (
            <div
              key={day}
              className={`py-2 text-center text-xs font-semibold ${
                index === 0 ? "text-destructive/70" : "text-muted-foreground"
              }`}
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Grid de dias */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} className="h-11" />
          ))}
          
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
            const selectable = mounted ? isDateSelectable(date) : false
            const selected = isSelected(day)
            const todayDay = isToday(day)
            const isSunday = date.getDay() === 0
            
            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                disabled={!selectable}
                className={`relative flex h-11 w-full items-center justify-center rounded-lg text-sm font-medium transition-all ${
                  selected
                    ? "bg-primary text-primary-foreground shadow-md scale-105"
                    : todayDay && selectable
                    ? "bg-accent/30 text-foreground ring-2 ring-accent"
                    : selectable
                    ? "text-foreground hover:bg-primary/10 hover:scale-105"
                    : isSunday
                    ? "text-destructive/30 cursor-not-allowed"
                    : "text-muted-foreground/40 cursor-not-allowed"
                }`}
              >
                {day}
                {todayDay && (
                  <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent" />
                )}
              </button>
            )
          })}
        </div>

        {/* Legenda */}
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-accent/30 ring-1 ring-accent" />
            <span>Hoje</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-primary" />
            <span>Selecionado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-muted" />
            <span>Indisponível</span>
          </div>
        </div>

        {/* Stats */}
        {mounted && (
          <div className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-muted/50 py-2 text-xs">
            <CalendarDays className="h-3.5 w-3.5 text-primary" />
            <span className="text-muted-foreground">
              <strong className="text-foreground">{stats.available}</strong> dias disponíveis neste mês
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
