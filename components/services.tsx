import { Check } from "lucide-react"

const services = [
  {
    name: "Lavagem Básica",
    price: "R$ 49",
    description: "Limpeza externa e viseira",
    features: [
      "Limpeza externa completa",
      "Polimento da viseira",
      "Higienização básica",
      "Coleta e entrega grátis"
    ],
    popular: false
  },
  {
    name: "Lavagem Completa",
    price: "R$ 89",
    description: "Limpeza interna e externa",
    features: [
      "Tudo da Lavagem Básica",
      "Remoção e lavagem do forro",
      "Higienização antibactericida",
      "Eliminação de odores",
      "Proteção UV na viseira"
    ],
    popular: true
  },
  {
    name: "Lavagem Premium",
    price: "R$ 149",
    description: "Restauração completa",
    features: [
      "Tudo da Lavagem Completa",
      "Restauração de cores",
      "Impermeabilização",
      "Tratamento anti-risco",
      "Garantia de 30 dias",
      "Entrega prioritária"
    ],
    popular: false
  }
]

export function Services() {
  return (
    <section id="servicos" className="bg-card px-4 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Nossos Serviços
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Escolha o pacote ideal para o seu capacete
          </p>
        </div>
        
        <div id="precos" className="grid gap-8 md:grid-cols-3">
          {services.map((service, index) => (
            <div 
              key={index}
              className={`relative flex flex-col rounded-2xl border p-6 ${
                service.popular 
                  ? "border-primary bg-primary/5 shadow-lg" 
                  : "border-border bg-background"
              }`}
            >
              {service.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-medium text-primary-foreground">
                  Mais Popular
                </div>
              )}
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                {service.name}
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                {service.description}
              </p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">{service.price}</span>
                <span className="text-muted-foreground">/capacete</span>
              </div>
              <ul className="mb-6 flex-1 space-y-3">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
