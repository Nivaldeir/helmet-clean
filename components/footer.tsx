import { Bike } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Bike className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">HelmetClean</span>
          </div>
          
          <div className="flex flex-col items-center gap-4 text-center md:flex-row md:gap-8 md:text-left">
            <a href="mailto:contato@helmetclean.com.br" className="text-sm text-muted-foreground hover:text-foreground">
              contato@helmetclean.com.br
            </a>
            <a href="tel:+5511999999999" className="text-sm text-muted-foreground hover:text-foreground">
              (11) 99999-9999
            </a>
          </div>
        </div>
        
        <div className="mt-8 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} HelmetClean. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
