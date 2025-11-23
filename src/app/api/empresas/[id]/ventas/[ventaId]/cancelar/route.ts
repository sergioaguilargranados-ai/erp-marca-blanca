import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ventas, detallesVenta, inventario, movimientosInventario } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function POST(
  request: Request,
  { params }: { params: { id: string; ventaId: string } }
) {
  try {
    const body = await request.json()
    const { motivo, usuarioId } = body

    if (!usuarioId) {
      return NextResponse.json(
        { error: 'Usuario requerido' },
        { status: 400 }
      )
    }

    // Obtener venta
    const [venta] = await db
      .select()
      .from(ventas)
      .where(and(
        eq(ventas.id, params.ventaId),
        eq(ventas.empresaId, params.id)
      ))
      .limit(1)

    if (!venta) {
      return NextResponse.json(
        { error: 'Venta no encontrada' },
        { status: 404 }
      )
    }

    if (venta.estado === 'cancelada') {
      return NextResponse.json(
        { error: 'La venta ya está cancelada' },
        { status: 400 }
      )
    }

    // Obtener detalles de la venta
    const detalles = await db
      .select()
      .from(detallesVenta)
      .where(eq(detallesVenta.ventaId, params.ventaId))

    // Revertir inventario para cada producto
    for (const detalle of detalles) {
      // Obtener inventario actual
      const [inventarioActual] = await db
        .select()
        .from(inventario)
        .where(and(
          eq(inventario.productoId, detalle.productoId),
          eq(inventario.sucursalId, venta.sucursalId)
        ))
        .limit(1)

      if (inventarioActual) {
        const nuevaCantidad = inventarioActual.cantidad + detalle.cantidad
        const nuevaCantidadDisponible = inventarioActual.cantidadDisponible + detalle.cantidad

        // Actualizar inventario (devolver productos)
        await db
          .update(inventario)
          .set({
            cantidad: nuevaCantidad,
            cantidadDisponible: nuevaCantidadDisponible,
            updatedAt: new Date(),
          })
          .where(eq(inventario.id, inventarioActual.id))

        // Crear movimiento de inventario
        await db.insert(movimientosInventario).values({
          productoId: detalle.productoId,
          sucursalId: venta.sucursalId,
          tipo: 'ajuste',
          cantidad: detalle.cantidad,
          cantidadAnterior: inventarioActual.cantidad,
          cantidadNueva: nuevaCantidad,
          documentoTipo: 'cancelacion_venta',
          documentoId: venta.id,
          usuarioId,
          observaciones: `Cancelación de venta ${venta.folio}${motivo ? `: ${motivo}` : ''}`,
        })
      }
    }

    // Actualizar estado de la venta
    await db
      .update(ventas)
      .set({
        estado: 'cancelada',
        canceladaAt: new Date(),
      })
      .where(eq(ventas.id, params.ventaId))

    return NextResponse.json({
      success: true,
      message: 'Venta cancelada correctamente',
    })
  } catch (error) {
    console.error('Error cancelando venta:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
