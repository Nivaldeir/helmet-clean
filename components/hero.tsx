import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Clock, Truck } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background px-4 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-2 text-sm font-medium text-accent-foreground">
            <Truck className="h-4 w-4" />
            Buscamos e entregamos na sua casa
          </div>
          
          <h1 className="mb-6 max-w-3xl text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Seu capacete limpo e higienizado sem sair de casa
          </h1>
          
          <p className="mb-8 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            Agendamos a coleta do seu capacete, realizamos uma limpeza profissional completa e devolvemos na sua porta. Simples, prático e seguro.
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button size="lg" asChild className="px-8">
              <Link href="/agendar">Agendar Lavagem</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/#como-funciona">Saiba Mais</Link>
            </Button>
          </div>
          
          <div className="mt-12 grid w-full max-w-2xl grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="flex flex-col items-center gap-2 rounded-xl bg-card p-4 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">Coleta Grátis</span>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-xl bg-card p-4 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">Entrega em 24h</span>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-xl bg-card p-4 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">100% Seguro</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
