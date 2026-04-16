import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Carlos Silva",
    role: "Motociclista há 5 anos",
    content: "Serviço excelente! Buscaram o capacete no horário combinado e devolveram limpo e cheiroso. Recomendo muito!",
    rating: 5
  },
  {
    name: "Ana Paula",
    role: "Delivery",
    content: "Trabalho com entregas e meu capacete precisava de uma limpeza profunda. O resultado ficou incrível, parece novo!",
    rating: 5
  },
  {
    name: "Roberto Mendes",
    role: "Motociclista de final de semana",
    content: "Muito prático! Não precisei sair de casa e o capacete voltou impecável. Já agendei para o próximo mês.",
    rating: 5
  }
]

export function Testimonials() {
  return (
    <section className="px-4 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            O que nossos clientes dizem
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Milhares de capacetes já foram higienizados
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="mb-4 text-muted-foreground">
                &ldquo;{testimonial.content}&rdquo;
              </p>
              <div>
                <p className="font-medium text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
