import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { facturas, detallesFactura, impuestosFactura, configuracionFacturacion } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { FacturamaAPI, construirCFDI } from '@/lib/facturacion/facturama'

export async function POST(
  request: Request,
  { params }: { params: { id: string; facturaId: string } }
) {
  try {
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

    if (factura.estado !== 'borrador') {
      return NextResponse.json(
        { error: 'La factura ya está timbrada o cancelada' },
        { status: 400 }
      )
    }

    // Obtener detalles con impuestos
    const detalles = await db
      .select()
      .from(detallesFactura)
      .where(eq(detallesFactura.facturaId, params.facturaId))

    if (detalles.length === 0) {
      return NextResponse.json(
        { error: 'La factura no tiene conceptos' },
        { status: 400 }
      )
    }

    // Obtener impuestos para cada detalle
    const conceptosConImpuestos = await Promise.all(
      detalles.map(async (detalle) => {
        const impuestos = await db
          .select()
          .from(impuestosFactura)
          .where(eq(impuestosFactura.detalleFacturaId, detalle.id))

        return {
          ...detalle,
          impuestos: impuestos.length > 0 ? {
            traslados: impuestos
              .filter(i => i.tipoImpuesto === 'traslado')
              .map(i => ({
                base: Number(i.base),
                impuesto: i.impuesto,
                tipoFactor: i.tipoFactor,
                tasaOCuota: Number(i.tasaOCuota),
                importe: Number(i.importe),
              })),
            retenciones: impuestos
              .filter(i => i.tipoImpuesto === 'retencion')
              .map(i => ({
                base: Number(i.base),
                impuesto: i.impuesto,
                tipoFactor: i.tipoFactor,
                tasaOCuota: Number(i.tasaOCuota),
                importe: Number(i.importe),
              })),
          } : undefined
        }
      })
    )

    // Construir objeto CFDI
    const cfdiData = construirCFDI({
      emisor: {
        rfc: config.rfc,
        nombre: config.razonSocial,
        regimenFiscal: config.regimenFiscal,
      },
      receptor: {
        rfc: factura.receptorRfc,
        nombre: factura.receptorNombre,
        regimenFiscal: factura.receptorRegimenFiscal,
        usoCfdi: factura.receptorUsoCfdi,
        domicilioFiscalReceptor: factura.receptorCodigoPostal,
      },
      conceptos: conceptosConImpuestos.map(c => ({
        claveProdServ: c.claveProdServ,
        cantidad: Number(c.cantidad),
        claveUnidad: c.claveUnidad,
        unidad: c.unidad || '',
        descripcion: c.descripcion,
        valorUnitario: Number(c.valorUnitario),
        descuento: Number(c.descuento),
        objetoImp: c.objetoImp,
        impuestos: c.impuestos,
      })),
      formaPago: factura.formaPago,
      metodoPago: factura.metodoPago,
      moneda: factura.moneda,
      serie: factura.serie || undefined,
      folio: factura.folio,
      lugarExpedicion: factura.lugarExpedicion,
      observaciones: factura.observaciones || undefined,
    })

    // Si no hay credenciales del PAC, simular timbrado
    if (!config.pacUsuario || !config.pacPassword) {
      // MODO SIMULACIÓN - Solo para desarrollo
      const uuidSimulado = `${Date.now()}-${Math.random().toString(36).substring(7)}`

      await db
        .update(facturas)
        .set({
          estado: 'timbrada',
          folioFiscal: uuidSimulado,
          fechaTimbrado: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(facturas.id, params.facturaId))

      return NextResponse.json({
        success: true,
        uuid: uuidSimulado,
        message: 'Factura timbrada (SIMULACIÓN)',
        simulacion: true,
      })
    }

    // MODO REAL - Integración con Facturama
    try {
      const facturama = new FacturamaAPI({
        usuario: config.pacUsuario,
        password: config.pacPassword,
        sandbox: config.pacModoSandbox ?? true,
      })

      // Enviar a timbrar
      const resultado = await facturama.crearCFDI(cfdiData)

      // Actualizar factura con datos del timbrado
      await db
        .update(facturas)
        .set({
          estado: 'timbrada',
          folioFiscal: resultado.Complement.TaxStamp.Uuid,
          certificadoSat: resultado.Complement.TaxStamp.NoCertificadoSAT,
          selloDigital: resultado.Complement.TaxStamp.SelloSAT,
          selloCfdi: resultado.Complement.TaxStamp.SelloCFD,
          cadenaOriginal: resultado.Complement.TaxStamp.OriginalString,
          fechaTimbrado: new Date(resultado.Date),
          // URLs se generarán después
          xmlUrl: `/api/facturas/${params.facturaId}/xml`,
          pdfUrl: `/api/facturas/${params.facturaId}/pdf`,
          updatedAt: new Date(),
        })
        .where(eq(facturas.id, params.facturaId))

      return NextResponse.json({
        success: true,
        uuid: resultado.Complement.TaxStamp.Uuid,
        message: 'Factura timbrada correctamente',
      })
    } catch (errorPAC: any) {
      console.error('Error del PAC:', errorPAC)
      return NextResponse.json(
        { error: errorPAC.message || 'Error al timbrar con el PAC' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error timbrando factura:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
