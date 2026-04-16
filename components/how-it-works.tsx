import { Calendar, Package, Sparkles, Home } from "lucide-react"

const steps = [
  {
    icon: Calendar,
    title: "1. Agende Online",
    description: "Escolha a data e horário que melhor funciona para você através do nosso sistema de agendamento."
  },
  {
    icon: Package,
    title: "2. Coletamos",
    description: "Nosso entregador vai até a sua casa no horário marcado para buscar o capacete."
  },
  {
    icon: Sparkles,
    title: "3. Higienizamos",
    description: "Realizamos uma limpeza profissional completa: interna, externa e viseira."
  },
  {
    icon: Home,
    title: "4. Entregamos",
    description: "Devolvemos o capacete limpo e cheiroso na sua casa em até 24 horas."
  }
]

export function HowItWorks() {
  return (
    <section id="como-funciona" className="px-4 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Como Funciona
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Em 4 passos simples, seu capacete fica como novo
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative flex flex-col items-center text-center"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                <step.icon className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
              {index < steps.length - 1 && (
                <div className="absolute right-0 top-8 hidden h-0.5 w-full translate-x-1/2 bg-border lg:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
