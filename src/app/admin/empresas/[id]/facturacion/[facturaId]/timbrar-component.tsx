'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  empresaId: string
  facturaId: string
  folio: string
}

export function TimbrarFacturaButton({ empresaId, facturaId, folio }: Props) {
  const router = useRouter()
  const [procesando, setProcesando] = useState(false)

  const handleTimbrar = async () => {
    if (!confirm(`¿Deseas timbrar la factura ${folio}? Esta acción no se puede deshacer.`)) {
      return
    }

    setProcesando(true)
    try {
      const response = await fetch(`/api/empresas/${empresaId}/facturacion/${facturaId}/timbrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (data.success) {
        alert(`Factura timbrada correctamente.\nUUID: ${data.uuid}`)
        router.refresh()
      } else {
        alert(`Error al timbrar: ${data.error}`)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al timbrar la factura')
    } finally {
      setProcesando(false)
    }
  }

  return (
    <button
      onClick={handleTimbrar}
      disabled={procesando}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {procesando ? 'Timbrando...' : '🔐 Timbrar Factura'}
    </button>
  )
}
