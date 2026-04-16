"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "Como funciona a coleta do capacete?",
    answer: "Nosso entregador vai até o endereço cadastrado no horário agendado. Basta entregar o capacete para ele e aguardar a devolução em até 24 horas."
  },
  {
    question: "Quanto tempo leva para o capacete ficar pronto?",
    answer: "O processo de higienização completa leva em média 8 horas. Garantimos a devolução em até 24 horas após a coleta."
  },
  {
    question: "É seguro lavar o forro do capacete?",
    answer: "Sim! Utilizamos produtos especiais que não danificam o forro. Nosso processo é seguro e preserva todas as propriedades de proteção do capacete."
  },
  {
    question: "Quais formas de pagamento são aceitas?",
    answer: "Aceitamos cartão de crédito, débito e PIX. O pagamento é feito no momento do agendamento, de forma segura através da nossa plataforma."
  },
  {
    question: "Vocês atendem em qual região?",
    answer: "Atualmente atendemos toda a região metropolitana de São Paulo. Em breve expandiremos para outras cidades."
  },
  {
    question: "E se eu precisar cancelar o agendamento?",
    answer: "Você pode cancelar sem custo até 24 horas antes do horário agendado. Basta entrar em contato pelo WhatsApp."
  }
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="bg-card px-4 py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Perguntas Frequentes
          </h2>
          <p className="text-lg text-muted-foreground">
            Tire suas dúvidas sobre nosso serviço
          </p>
        </div>
        
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="rounded-xl border border-border bg-background"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <span className="font-medium text-foreground">{faq.question}</span>
                <ChevronDown 
                  className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="border-t border-border px-4 py-4">
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
