import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { facturas, configuracionFacturacion } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { FacturamaAPI } from '@/lib/facturacion/facturama'

export async function POST(
  request: Request,
  { params }: { params: { id: string; facturaId: string } }
) {
  try {
    const body = await request.json()
    const { motivo } = body

    if (!motivo) {
      return NextResponse.json(
        { error: 'Motivo de cancelación requerido' },
        { status: 400 }
      )
    }

    // Obtener configuración
    const [config] = await db
      .select()
      .from(configuracionFacturacion)
      .where(eq(configuracionFacturacion.empresaId, params.id))
      .limit(1)

    if (!config) {
      return NextResponse.json(
        { error: 'No hay configuración de facturación' },
        { status: 400 }
      )
    }

    // Obtener factura
    const [factura] = await db
      .select()
      .from(facturas)
      .where(eq(facturas.id, params.facturaId))
      .limit(1)

    if (!factura) {
      return NextResponse.json(
        { error: 'Factura no encontrada' },
        { status: 404 }
      )
    }

    if (factura.estado !== 'timbrada') {
      return NextResponse.json(
        { error: 'Solo se pueden cancelar facturas timbradas' },
        { status: 400 }
      )
    }

    if (!factura.folioFiscal) {
      return NextResponse.json(
        { error: 'Factura sin UUID (folio fiscal)' },
        { status: 400 }
      )
    }

    // Si no hay credenciales del PAC, simular cancelación
    if (!config.pacUsuario || !config.pacPassword) {
      // MODO SIMULACIÓN
      await db
        .update(facturas)
        .set({
          estado: 'cancelada',
          fechaCancelacion: new Date(),
          motivoCancelacion: `Motivo ${motivo} (SIMULACIÓN)`,
          updatedAt: new Date(),
        })
        .where(eq(facturas.id, params.facturaId))

      return NextResponse.json({
        success: true,
        message: 'Factura cancelada (SIMULACIÓN)',
        simulacion: true,
      })
    }

    // MODO REAL - Cancelar con Facturama
    try {
      const facturama = new FacturamaAPI({
        usuario: config.pacUsuario,
        password: config.pacPassword,
        sandbox: config.pacModoSandbox ?? true,
      })

      // Cancelar en el PAC
      await facturama.cancelarCFDI(factura.folioFiscal, motivo)

      // Actualizar factura
      await db
        .update(facturas)
        .set({
          estado: 'cancelada',
          fechaCancelacion: new Date(),
          motivoCancelacion: `Motivo ${motivo}`,
          updatedAt: new Date(),
        })
        .where(eq(facturas.id, params.facturaId))

      return NextResponse.json({
        success: true,
        message: 'Factura cancelada correctamente en el SAT',
      })
    } catch (errorPAC: any) {
      console.error('Error del PAC al cancelar:', errorPAC)
      return NextResponse.json(
        { error: errorPAC.message || 'Error al cancelar con el PAC' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error cancelando factura:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
