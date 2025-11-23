import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ventas, detallesVenta, inventario, movimientosInventario, sucursales, productos } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

// Función para generar folio único
async function generarFolio(empresaId: string): Promise<string> {
  const fecha = new Date()
  const año = fecha.getFullYear().toString().slice(-2)
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0')
  const dia = fecha.getDate().toString().padStart(2, '0')

  // Contar ventas del día
  const ventasHoy = await db
    .select()
    .from(ventas)
    .where(eq(ventas.empresaId, empresaId))

  const numero = (ventasHoy.length + 1).toString().padStart(4, '0')

  return `V${año}${mes}${dia}-${numero}`
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      sucursalId,
      usuarioId,
      nombreCliente,
      metodoPago,
      montoPagado,
      cambio,
      items,
    } = body

    if (!sucursalId || !usuarioId || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Datos incompletos' },
        { status: 400 }
      )
    }

    // Obtener tasa de IVA de la sucursal
    const [sucursal] = await db
      .select()
      .from(sucursales)
      .where(eq(sucursales.id, sucursalId))
      .limit(1)

    const tasaIvaSucursal = Number(sucursal?.tasaIva || '16')

    // Calcular totales
    let subtotalVenta = 0
    let ivaVenta = 0
    let totalVenta = 0

    const detalles = []

    for (const item of items) {
      const { productoId, cantidad, precioUnitario } = item

      // Validar stock disponible
      const [inventarioProducto] = await db
        .select()
        .from(inventario)
        .where(
          and(
            eq(inventario.productoId, productoId),
            eq(inventario.sucursalId, sucursalId)
          )
        )
        .limit(1)

      if (!inventarioProducto || inventarioProducto.cantidadDisponible < cantidad) {
        return NextResponse.json(
          { error: `Stock insuficiente para producto ${productoId}` },
          { status: 400 }
        )
      }

      // Obtener información del producto
      const [producto] = await db
        .select()
        .from(productos)
        .where(eq(productos.id, productoId))
        .limit(1)

      if (!producto) {
        return NextResponse.json(
          { error: `Producto ${productoId} no encontrado` },
          { status: 404 }
        )
      }

      const subtotalItem = precioUnitario * cantidad
      const tasaIva = producto.aplicaIva
        ? Number(producto.tasaIvaEspecial || tasaIvaSucursal)
        : 0
      const ivaItem = (subtotalItem * tasaIva) / 100
      const totalItem = subtotalItem + ivaItem

      subtotalVenta += subtotalItem
      ivaVenta += ivaItem
      totalVenta += totalItem

      detalles.push({
        productoId,
        nombreProducto: producto.nombre,
        codigoBarras: producto.codigoBarras,
        sku: producto.sku,
        cantidad,
        unidadMedida: producto.unidadMedida,
        precioUnitario: precioUnitario.toString(),
        precioOriginal: precioUnitario.toString(),
        descuento: '0',
        subtotal: subtotalItem.toString(),
        iva: ivaItem.toString(),
        total: totalItem.toString(),
        aplicaIva: producto.aplicaIva,
        tasaIva: tasaIva.toString(),
      })
    }

    // Generar folio
    const folio = await generarFolio(params.id)

    // Crear venta
    const [nuevaVenta] = await db
      .insert(ventas)
      .values({
        empresaId: params.id,
        sucursalId,
        usuarioId,
        nombreCliente: nombreCliente || 'Público General',
        folio,
        subtotal: subtotalVenta.toString(),
        iva: ivaVenta.toString(),
        descuento: '0',
        total: totalVenta.toString(),
        metodoPago,
        montoPagado: montoPagado?.toString() || null,
        cambio: cambio?.toString() || null,
        estado: 'completada',
        requiereFactura: 'pendiente',
      })
      .returning()

    // Crear detalles de venta
    await db.insert(detallesVenta).values(
      detalles.map(detalle => ({
        ventaId: nuevaVenta.id,
        ...detalle,
      }))
    )

    // Actualizar inventario y crear movimientos
    for (const item of items) {
      const { productoId, cantidad } = item

      // Obtener inventario actual
      const [inventarioActual] = await db
        .select()
        .from(inventario)
        .where(
          and(
            eq(inventario.productoId, productoId),
            eq(inventario.sucursalId, sucursalId)
          )
        )
        .limit(1)

      if (inventarioActual) {
        const nuevaCantidad = inventarioActual.cantidad - cantidad
        const nuevaCantidadDisponible = inventarioActual.cantidadDisponible - cantidad

        // Actualizar inventario
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
          productoId,
          sucursalId,
          tipo: 'venta',
          cantidad: -cantidad,
          cantidadAnterior: inventarioActual.cantidad,
          cantidadNueva: nuevaCantidad,
          documentoTipo: 'venta',
          documentoId: nuevaVenta.id,
          usuarioId,
          observaciones: `Venta ${folio}`,
        })
      }
    }

    return NextResponse.json({
      success: true,
      ventaId: nuevaVenta.id,
      folio: nuevaVenta.folio,
    })
  } catch (error) {
    console.error('Error procesando venta:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
