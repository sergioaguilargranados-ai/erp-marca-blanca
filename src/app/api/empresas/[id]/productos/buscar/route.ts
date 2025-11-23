import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { productos, inventario } from '@/lib/db/schema'
import { eq, or, ilike, and } from 'drizzle-orm'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const busqueda = searchParams.get('q')
    const sucursalId = searchParams.get('sucursalId')

    if (!busqueda || !sucursalId) {
      return NextResponse.json(
        { error: 'Faltan parámetros' },
        { status: 400 }
      )
    }

    // Buscar producto por código de barras o nombre
    const [productoEncontrado] = await db
      .select()
      .from(productos)
      .where(
        and(
          eq(productos.empresaId, params.id),
          eq(productos.activo, true),
          or(
            eq(productos.codigoBarras, busqueda),
            ilike(productos.nombre, `%${busqueda}%`),
            eq(productos.sku, busqueda)
          ) as any
        )
      )
      .limit(1)

    if (!productoEncontrado) {
      return NextResponse.json({ producto: null })
    }

    // Obtener stock disponible en la sucursal
    const [inventarioProducto] = await db
      .select()
      .from(inventario)
      .where(
        and(
          eq(inventario.productoId, productoEncontrado.id),
          eq(inventario.sucursalId, sucursalId)
        )
      )
      .limit(1)

    const stockDisponible = inventarioProducto?.cantidadDisponible || 0

    return NextResponse.json({
      producto: {
        ...productoEncontrado,
        stockDisponible,
      },
    })
  } catch (error) {
    console.error('Error buscando producto:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
