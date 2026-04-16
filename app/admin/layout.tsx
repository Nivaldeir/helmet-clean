import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin - HelmetClean",
  description: "Painel administrativo da HelmetClean",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
