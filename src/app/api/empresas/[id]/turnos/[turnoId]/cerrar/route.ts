import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { turnos } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(
  request: Request,
  { params }: { params: { id: string; turnoId: string } }
) {
  try {
    const body = await request.json()
    const {
      efectivoContado,
      efectivoEsperado,
      ventasEfectivo,
      ventasTarjeta,
      ventasTransferencia,
      totalVentas,
      ingresosAdicionales,
      retiros,
      diferencia,
      denominaciones,
      observaciones
    } = body

    if (efectivoContado === undefined) {
      return NextResponse.json(
        { error: 'Efectivo contado requerido' },
        { status: 400 }
      )
    }

    // Obtener turno
    const [turno] = await db
      .select()
      .from(turnos)
      .where(eq(turnos.id, params.turnoId))
      .limit(1)

    if (!turno) {
      return NextResponse.json(
        { error: 'Turno no encontrado' },
        { status: 404 }
      )
    }

    if (turno.estado === 'cerrado') {
      return NextResponse.json(
        { error: 'El turno ya está cerrado' },
        { status: 400 }
      )
    }

    // Actualizar turno
    await db
      .update(turnos)
      .set({
        estado: 'cerrado',
        fechaCierre: new Date(),
        ventasEfectivo: ventasEfectivo.toString(),
        ventasTarjeta: ventasTarjeta.toString(),
        ventasTransferencia: ventasTransferencia.toString(),
        totalVentas: totalVentas.toString(),
        ingresosAdicionales: ingresosAdicionales.toString(),
        retiros: retiros.toString(),
        efectivoContado: efectivoContado.toString(),
        efectivoEsperado: efectivoEsperado.toString(),
        diferencia: diferencia.toString(),
        denominaciones: denominaciones || null,
        observacionesCierre: observaciones || null,
        updatedAt: new Date(),
      })
      .where(eq(turnos.id, params.turnoId))

    return NextResponse.json({
      success: true,
      message: 'Turno cerrado correctamente',
    })
  } catch (error) {
    console.error('Error cerrando turno:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
