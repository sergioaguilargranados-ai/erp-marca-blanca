import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { facturas, detallesFactura, impuestosFactura, configuracionFacturacion, clientes, ventas, sucursales } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      clienteId,
      formaPago,
      metodoPago,
      conceptos,
      observaciones,
      ventaId
    } = body

    if (!clienteId || !formaPago || !metodoPago || !conceptos || conceptos.length === 0) {
      return NextResponse.json(
        { error: 'Datos incompletos' },
        { status: 400 }
      )
    }

    // Obtener configuración de facturación
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

    // Obtener cliente
    const [cliente] = await db
      .select()
      .from(clientes)
      .where(and(
        eq(clientes.id, clienteId),
        eq(clientes.empresaId, params.id)
      ))
      .limit(1)

    if (!cliente || !cliente.rfc || !cliente.razonSocial) {
      return NextResponse.json(
        { error: 'Cliente sin datos fiscales completos' },
        { status: 400 }
      )
    }

    // Calcular totales
    let subtotal = 0
    let totalIVA = 0

    const conceptosCalculados = conceptos.map((c: any) => {
      const importe = c.cantidad * c.valorUnitario - (c.descuento || 0)
      const iva = c.aplicaIVA ? importe * c.tasaIVA : 0

      subtotal += importe
      totalIVA += iva

      return {
        ...c,
        importe,
        iva,
      }
    })

    const total = subtotal + totalIVA

    // Generar folio
    const folio = config.folioActual || '1'
    const serie = config.serieDefault || undefined

    // Obtener primera sucursal de la empresa (temporal)
    const [sucursal] = await db.query.sucursales.findMany({
      where: (sucursales, { eq }) => eq(sucursales.empresaId, params.id),
      limit: 1
    })

    if (!sucursal) {
      return NextResponse.json(
        { error: 'No hay sucursales configuradas' },
        { status: 400 }
      )
    }

    // Crear factura en BD
    const [nuevaFactura] = await db
      .insert(facturas)
      .values({
        empresaId: params.id,
        sucursalId: sucursal.id,
        ventaId: ventaId || undefined,
        clienteId,
        receptorRfc: cliente.rfc,
        receptorNombre: cliente.razonSocial || cliente.nombre,
        receptorRegimenFiscal: cliente.regimenFiscal!,
        receptorUsoCfdi: cliente.usoCfdi!,
        receptorCodigoPostal: cliente.codigoPostal!,
        serie: serie || undefined,
        folio,
        formaPago,
        metodoPago,
        lugarExpedicion: config.codigoPostal,
        moneda: 'MXN',
        subtotal: subtotal.toString(),
        descuento: '0',
        total: total.toString(),
        totalImpuestosTrasladados: totalIVA.toString(),
        estado: 'borrador',
        observaciones: observaciones || undefined,
      })
      .returning()

    // Crear detalles
    for (const concepto of conceptosCalculados) {
      const [detalle] = await db
        .insert(detallesFactura)
        .values({
          facturaId: nuevaFactura.id,
          claveProdServ: concepto.claveProdServ,
          cantidad: concepto.cantidad.toString(),
          claveUnidad: concepto.claveUnidad,
          unidad: concepto.unidad || '',
          descripcion: concepto.descripcion,
          valorUnitario: concepto.valorUnitario.toString(),
          importe: concepto.importe.toString(),
          descuento: (concepto.descuento || 0).toString(),
          objetoImp: concepto.aplicaIVA ? '02' : '01', // 01-No objeto, 02-Sí objeto
        })
        .returning()

      // Crear impuesto si aplica IVA
      if (concepto.aplicaIVA && concepto.iva > 0) {
        await db.insert(impuestosFactura).values({
          detalleFacturaId: detalle.id,
          tipoImpuesto: 'traslado',
          impuesto: '002', // IVA
          tipoFactor: 'Tasa',
          tasaOCuota: concepto.tasaIVA.toString(),
          base: concepto.importe.toString(),
          importe: concepto.iva.toString(),
        })
      }
    }

    // Actualizar folio en configuración
    const nuevoFolio = (parseInt(config.folioActual || '1') + 1).toString()
    await db
      .update(configuracionFacturacion)
      .set({
        folioActual: nuevoFolio,
        updatedAt: new Date(),
      })
      .where(eq(configuracionFacturacion.id, config.id))

    // Actualizar estado de venta si viene de una venta
    if (ventaId) {
      await db
        .update(ventas)
        .set({
          requiereFactura: 'facturada',
        })
        .where(eq(ventas.id, ventaId))
    }

    // TODO: Aquí iría la integración con el PAC para timbrar
    // Por ahora dejamos en estado borrador

    return NextResponse.json({
      success: true,
      facturaId: nuevaFactura.id,
      folio: `${serie}-${folio}`,
      message: 'Factura creada correctamente (sin timbrar)',
    })
  } catch (error) {
    console.error('Error generando factura:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
