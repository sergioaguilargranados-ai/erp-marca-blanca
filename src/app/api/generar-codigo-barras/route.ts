import { NextResponse } from 'next/server'
import { generarCodigoBarras } from '@/lib/utils/barcode'

export async function GET() {
  try {
    const codigoBarras = await generarCodigoBarras()

    return NextResponse.json({
      success: true,
      codigoBarras,
    })
  } catch (error) {
    console.error('Error generando código de barras:', error)
    return NextResponse.json(
      { error: 'Error al generar código de barras' },
      { status: 500 }
    )
  }
}
