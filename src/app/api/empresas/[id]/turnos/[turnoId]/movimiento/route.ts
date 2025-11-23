import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { movimientosCaja, turnos } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(
  request: Request,
  { params }: { params: { id: string; turnoId: string } }
) {
  try {
    const body = await request.json()
    const {
      tipo,
      monto,
      concepto,
      observaciones,
      requiereAutorizacion,
      autorizadoPor
    } = body

    if (!tipo || !monto || !concepto) {
      return NextResponse.json(
        { error: 'Datos incompletos' },
        { status: 400 }
      )
    }

    if (monto <= 0) {
      return NextResponse.json(
        { error: 'El monto debe ser mayor a 0' },
        { status: 400 }
      )
    }

    // Verificar que el turno existe y está abierto
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
        { error: 'No se pueden registrar movimientos en un turno cerrado' },
        { status: 400 }
      )
    }

    // Crear el movimiento de caja
    const [nuevoMovimiento] = await db
      .insert(movimientosCaja)
      .values({
        turnoId: params.turnoId,
        tipo,
        monto: monto.toString(),
        concepto,
        observaciones: observaciones || null,
        requiereAutorizacion: requiereAutorizacion || 'no',
        autorizadoPor: autorizadoPor || null,
      })
      .returning()

    // Actualizar los totales del turno
    const movimientos = await db
      .select()
      .from(movimientosCaja)
      .where(eq(movimientosCaja.turnoId, params.turnoId))

    const ingresosAdicionales = movimientos
      .filter(m => m.tipo === 'ingreso')
      .reduce((sum, m) => sum + Number(m.monto), 0)

    const retiros = movimientos
      .filter(m => m.tipo === 'retiro')
      .reduce((sum, m) => sum + Number(m.monto), 0)

    await db
      .update(turnos)
      .set({
        ingresosAdicionales: ingresosAdicionales.toString(),
        retiros: retiros.toString(),
        updatedAt: new Date(),
      })
      .where(eq(turnos.id, params.turnoId))

    return NextResponse.json({
      success: true,
      movimientoId: nuevoMovimiento.id,
      message: 'Movimiento registrado correctamente',
    })
  } catch (error) {
    console.error('Error registrando movimiento:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
