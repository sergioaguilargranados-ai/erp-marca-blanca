import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { inventario, movimientosInventario, productos } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { productoId, sucursalId, tipo, cantidad, motivo, observaciones } = body

    if (!productoId || !sucursalId || !tipo || !cantidad || !motivo) {
      return NextResponse.json(
        { error: 'Datos incompletos' },
        { status: 400 }
      )
    }

    if (cantidad <= 0) {
      return NextResponse.json(
        { error: 'La cantidad debe ser mayor a 0' },
        { status: 400 }
      )
    }

    // Obtener producto
    const [producto] = await db
      .select()
      .from(productos)
      .where(eq(productos.id, productoId))
      .limit(1)

    if (!producto) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    // Obtener o crear inventario
    let [inventarioActual] = await db
      .select()
      .from(inventario)
      .where(and(
        eq(inventario.productoId, productoId),
        eq(inventario.sucursalId, sucursalId)
      ))
      .limit(1)

    const cantidadAnterior = inventarioActual?.cantidad || 0
    const nuevaCantidad = tipo === 'entrada'
      ? cantidadAnterior + cantidad
      : cantidadAnterior - cantidad

    if (nuevaCantidad < 0) {
      return NextResponse.json(
        { error: 'No hay suficiente stock para realizar la salida' },
        { status: 400 }
      )
    }

    const nuevaCantidadDisponible = nuevaCantidad - (inventarioActual?.cantidadReservada || 0)

    if (inventarioActual) {
      // Actualizar inventario existente
      await db
        .update(inventario)
        .set({
          cantidad: nuevaCantidad,
          cantidadDisponible: nuevaCantidadDisponible,
          updatedAt: new Date(),
        })
        .where(eq(inventario.id, inventarioActual.id))
    } else {
      // Crear nuevo registro de inventario
      await db.insert(inventario).values({
        productoId,
        sucursalId,
        cantidad: nuevaCantidad,
        cantidadReservada: 0,
        cantidadDisponible: nuevaCantidadDisponible,
      })
    }

    // Crear movimiento de inventario
    await db.insert(movimientosInventario).values({
      productoId,
      sucursalId,
      tipo: tipo === 'entrada' ? 'entrada' : 'salida',
      cantidad: tipo === 'entrada' ? cantidad : -cantidad,
      cantidadAnterior,
      cantidadNueva: nuevaCantidad,
      documentoTipo: 'ajuste_manual',
      documentoId: null,
      observaciones: `${motivo}${observaciones ? `: ${observaciones}` : ''}`,
    })

    return NextResponse.json({
      success: true,
      cantidadAnterior,
      cantidadNueva: nuevaCantidad,
    })
  } catch (error) {
    console.error('Error ajustando inventario:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
