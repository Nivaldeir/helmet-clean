"use client"

import { useState, useEffect } from "react"
import { Clock, Sun, Sunset } from "lucide-react"
import { getActiveTimeSlots } from "@/lib/config"

interface TimeSlotsProps {
  selectedTime: string | null
  onSelectTime: (time: string) => void
  selectedDate: Date | null
}

export function TimeSlots({ selectedTime, onSelectTime, selectedDate }: TimeSlotsProps) {
  const [timeSlots, setTimeSlots] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTimeSlots(getActiveTimeSlots())
  }, [])

  if (!selectedDate) {
    return (
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="bg-gradient-to-r from-muted to-muted/50 p-4">
          <h3 className="font-semibold text-muted-foreground">Horários</h3>
        </div>
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="mb-4 rounded-full bg-muted p-4">
            <Clock className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <p className="text-sm text-muted-foreground">
            Selecione uma data para ver os horários disponíveis
          </p>
        </div>
      </div>
    )
  }

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    }
    return date.toLocaleDateString('pt-BR', options)
  }

  // Separar horários em manhã e tarde
  const morningSlots = timeSlots.filter(time => {
    const hour = parseInt(time.split(":")[0])
    return hour < 12
  })

  const afternoonSlots = timeSlots.filter(time => {
    const hour = parseInt(time.split(":")[0])
    return hour >= 12
  })

  if (!mounted) {
    return (
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4">
          <h3 className="font-semibold text-foreground">Carregando...</h3>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4">
        <h3 className="font-semibold text-foreground capitalize">
          {formatDate(selectedDate)}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {timeSlots.length} horários disponíveis
        </p>
      </div>

      <div className="p-4 space-y-4">
        {/* Manhã */}
        {morningSlots.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sun className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Manhã
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {morningSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => onSelectTime(time)}
                  className={`group relative rounded-lg border px-3 py-3 text-sm font-medium transition-all ${
                    selectedTime === time
                      ? "border-primary bg-primary text-primary-foreground shadow-md"
                      : "border-border bg-background text-foreground hover:border-primary hover:bg-primary/5 hover:scale-105"
                  }`}
                >
                  <span className="flex items-center justify-center gap-1.5">
                    <Clock className={`h-3.5 w-3.5 ${selectedTime === time ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"}`} />
                    {time}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tarde */}
        {afternoonSlots.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sunset className="h-4 w-4 text-orange-500" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Tarde
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {afternoonSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => onSelectTime(time)}
                  className={`group relative rounded-lg border px-3 py-3 text-sm font-medium transition-all ${
                    selectedTime === time
                      ? "border-primary bg-primary text-primary-foreground shadow-md"
                      : "border-border bg-background text-foreground hover:border-primary hover:bg-primary/5 hover:scale-105"
                  }`}
                >
                  <span className="flex items-center justify-center gap-1.5">
                    <Clock className={`h-3.5 w-3.5 ${selectedTime === time ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"}`} />
                    {time}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mensagem se não houver horários */}
        {timeSlots.length === 0 && (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Clock className="mb-3 h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              Nenhum horário disponível para esta data
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
