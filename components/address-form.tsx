"use client"

import { MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export interface AddressData {
  cep: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
}

interface AddressFormProps {
  address: AddressData
  onAddressChange: (address: AddressData) => void
}

export function AddressForm({ address, onAddressChange }: AddressFormProps) {
  const handleChange = (field: keyof AddressData, value: string) => {
    onAddressChange({ ...address, [field]: value })
  }

  const handleCepChange = async (value: string) => {
    const cleanCep = value.replace(/\D/g, "")
    handleChange("cep", cleanCep)
    
    if (cleanCep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
        const data = await response.json()
        if (!data.erro) {
          onAddressChange({
            ...address,
            cep: cleanCep,
            street: data.logradouro || "",
            neighborhood: data.bairro || "",
            city: `${data.localidade} - ${data.uf}` || ""
          })
        }
      } catch {
        // Silently fail - user can fill manually
      }
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-4 flex items-center gap-2">
        <MapPin className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Endereço para Coleta</h3>
      </div>
      
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="cep">CEP</Label>
            <Input
              id="cep"
              placeholder="00000-000"
              value={address.cep}
              onChange={(e) => handleCepChange(e.target.value)}
              maxLength={9}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">Cidade</Label>
            <Input
              id="city"
              placeholder="São Paulo - SP"
              value={address.city}
              onChange={(e) => handleChange("city", e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="street">Rua</Label>
          <Input
            id="street"
            placeholder="Nome da rua"
            value={address.street}
            onChange={(e) => handleChange("street", e.target.value)}
          />
        </div>
        
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="number">Número</Label>
            <Input
              id="number"
              placeholder="123"
              value={address.number}
              onChange={(e) => handleChange("number", e.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="complement">Complemento</Label>
            <Input
              id="complement"
              placeholder="Apto, bloco, etc."
              value={address.complement}
              onChange={(e) => handleChange("complement", e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="neighborhood">Bairro</Label>
          <Input
            id="neighborhood"
            placeholder="Nome do bairro"
            value={address.neighborhood}
            onChange={(e) => handleChange("neighborhood", e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
