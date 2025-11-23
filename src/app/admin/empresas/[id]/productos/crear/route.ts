import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { empresas, productos } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData()

    const nombre = formData.get('nombre') as string
    const descripcion = formData.get('descripcion') as string
    const sku = formData.get('sku') as string
    const codigoBarras = formData.get('codigoBarras') as string
    const categoriaId = formData.get('categoriaId') as string
    const precioCompra = formData.get('precioCompra') as string
    const precioVentaMinorista = formData.get('precioVentaMinorista') as string
    const precioVentaMayorista = formData.get('precioVentaMayorista') as string
    const unidadMedida = formData.get('unidadMedida') as string
    const stockMinimo = formData.get('stockMinimo') as string
    const peso = formData.get('peso') as string
    const aplicaIva = formData.get('aplicaIva') === 'true'

    // Obtener empresa
    const [empresa] = await db
      .select()
      .from(empresas)
      .where(eq(empresas.id, params.id))
      .limit(1)

    if (!empresa) {
      return NextResponse.json(
        { error: 'Empresa no encontrada' },
        { status: 404 }
      )
    }

    // Crear producto
    await db.insert(productos).values({
      empresaId: params.id,
      nombre,
      descripcion: descripcion || null,
      sku: sku || null,
      codigoBarras: codigoBarras || null,
      categoriaId: categoriaId || null,
      precioCompra: precioCompra || null,
      precioVentaMinorista,
      precioVentaMayorista: precioVentaMayorista || null,
      unidadMedida: unidadMedida || 'PZA',
      stockMinimo: stockMinimo ? parseInt(stockMinimo) : 0,
      peso: peso || null,
      aplicaIva,
      activo: true,
    })

    // Actualizar contador
    await db
      .update(empresas)
      .set({
        usoProductos: empresa.usoProductos + 1,
        updatedAt: new Date(),
      })
      .where(eq(empresas.id, params.id))

    return NextResponse.redirect(
      new URL(`/admin/empresas/${params.id}/productos?success=producto-creado`, request.url)
    )
  } catch (error) {
    console.error('Error creando producto:', error)
    return NextResponse.json(
      { error: 'Error al crear producto' },
      { status: 500 }
    )
  }
}
