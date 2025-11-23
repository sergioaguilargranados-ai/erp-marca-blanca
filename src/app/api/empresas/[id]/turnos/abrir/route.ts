import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { turnos, cajas } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { cajaId, usuarioId, tipoTurno, fondoInicial, observaciones } = body

    if (!cajaId || !usuarioId || !tipoTurno || fondoInicial === undefined) {
      return NextResponse.json(
        { error: 'Datos incompletos' },
        { status: 400 }
      )
    }

    if (fondoInicial < 0) {
      return NextResponse.json(
        { error: 'El fondo inicial no puede ser negativo' },
        { status: 400 }
      )
    }

    // Verificar que la caja existe y pertenece a la empresa
    const [caja] = await db
      .select()
      .from(cajas)
      .where(and(
        eq(cajas.id, cajaId),
        eq(cajas.empresaId, params.id)
      ))
      .limit(1)

    if (!caja) {
      return NextResponse.json(
        { error: 'Caja no encontrada' },
        { status: 404 }
      )
    }

    if (!caja.activa) {
      return NextResponse.json(
        { error: 'La caja no está activa' },
        { status: 400 }
      )
    }

    // Verificar que no hay un turno abierto en esta caja
    const [turnoAbierto] = await db
      .select()
      .from(turnos)
      .where(and(
        eq(turnos.cajaId, cajaId),
        eq(turnos.estado, 'abierto')
      ))
      .limit(1)

    if (turnoAbierto) {
      return NextResponse.json(
        { error: 'Ya existe un turno abierto en esta caja' },
        { status: 400 }
      )
    }

    // Crear el turno
    const [nuevoTurno] = await db
      .insert(turnos)
      .values({
        cajaId,
        usuarioId,
        tipoTurno,
        fondoInicial: fondoInicial.toString(),
        observacionesApertura: observaciones || null,
        estado: 'abierto',
        fechaApertura: new Date(),
        ventasEfectivo: '0',
        ventasTarjeta: '0',
        ventasTransferencia: '0',
        totalVentas: '0',
        ingresosAdicionales: '0',
        retiros: '0',
      })
      .returning()

    return NextResponse.json({
      success: true,
      turnoId: nuevoTurno.id,
      message: 'Turno abierto correctamente',
    })
  } catch (error) {
    console.error('Error abriendo turno:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
