// Helper functions para integración con Facturama API

interface FacturamaConfig {
  usuario: string
  password: string
  sandbox: boolean
}

const FACTURAMA_API_BASE = {
  sandbox: 'https://apisandbox.facturama.mx',
  produccion: 'https://api.facturama.mx'
}

export class FacturamaAPI {
  private config: FacturamaConfig
  private baseUrl: string

  constructor(config: FacturamaConfig) {
    this.config = config
    this.baseUrl = config.sandbox ? FACTURAMA_API_BASE.sandbox : FACTURAMA_API_BASE.produccion
  }

  private getAuthHeader(): string {
    const credentials = `${this.config.usuario}:${this.config.password}`
    return `Basic ${Buffer.from(credentials).toString('base64')}`
  }

  // Crear CFDI
  async crearCFDI(datos: any) {
    try {
      const response = await fetch(`${this.baseUrl}/api-lite/cfdis`, {
        method: 'POST',
        headers: {
          'Authorization': this.getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.Message || 'Error al crear CFDI')
      }

      return await response.json()
    } catch (error) {
      console.error('Error Facturama:', error)
      throw error
    }
  }

  // Descargar XML
  async descargarXML(folioFiscal: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api-lite/cfdis/${folioFiscal}/xml`, {
        headers: {
          'Authorization': this.getAuthHeader(),
        },
      })

      if (!response.ok) {
        throw new Error('Error al descargar XML')
      }

      return await response.text()
    } catch (error) {
      console.error('Error descargando XML:', error)
      throw error
    }
  }

  // Descargar PDF
  async descargarPDF(folioFiscal: string): Promise<ArrayBuffer> {
    try {
      const response = await fetch(`${this.baseUrl}/api-lite/cfdis/${folioFiscal}/pdf`, {
        headers: {
          'Authorization': this.getAuthHeader(),
        },
      })

      if (!response.ok) {
        throw new Error('Error al descargar PDF')
      }

      return await response.arrayBuffer()
    } catch (error) {
      console.error('Error descargando PDF:', error)
      throw error
    }
  }

  // Cancelar CFDI
  async cancelarCFDI(folioFiscal: string, motivo: string = '02') {
    try {
      const response = await fetch(`${this.baseUrl}/api-lite/cfdis/${folioFiscal}`, {
        method: 'DELETE',
        headers: {
          'Authorization': this.getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          motive: motivo, // 01-Comprobante emitido con errores con relación, 02-Comprobante emitido con errores sin relación, 03-No se llevó a cabo la operación, 04-Operación nominativa relacionada en una factura global
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.Message || 'Error al cancelar CFDI')
      }

      return await response.json()
    } catch (error) {
      console.error('Error cancelando CFDI:', error)
      throw error
    }
  }

  // Enviar CFDI por email
  async enviarEmail(folioFiscal: string, email: string) {
    try {
      const response = await fetch(`${this.baseUrl}/api-lite/cfdis/${folioFiscal}/email`, {
        method: 'POST',
        headers: {
          'Authorization': this.getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error('Error al enviar email')
      }

      return { success: true }
    } catch (error) {
      console.error('Error enviando email:', error)
      throw error
    }
  }
}

// Construir objeto CFDI para Facturama
export function construirCFDI(datos: {
  emisor: {
    rfc: string
    nombre: string
    regimenFiscal: string
  }
  receptor: {
    rfc: string
    nombre: string
    regimenFiscal: string
    usoCfdi: string
    domicilioFiscalReceptor: string
  }
  conceptos: Array<{
    claveProdServ: string
    cantidad: number
    claveUnidad: string
    unidad: string
    descripcion: string
    valorUnitario: number
    descuento?: number
    objetoImp: string
    impuestos?: {
      traslados?: Array<{
        base: number
        impuesto: string
        tipoFactor: string
        tasaOCuota: number
        importe: number
      }>
      retenciones?: Array<{
        base: number
        impuesto: string
        tipoFactor: string
        tasaOCuota: number
        importe: number
      }>
    }
  }>
  formaPago: string
  metodoPago: string
  moneda: string
  serie?: string
  folio?: string
  lugarExpedicion: string
  observaciones?: string
}) {
  return {
    Receiver: {
      Rfc: datos.receptor.rfc,
      Name: datos.receptor.nombre,
      CfdiUse: datos.receptor.usoCfdi,
      FiscalRegime: datos.receptor.regimenFiscal,
      TaxZipCode: datos.receptor.domicilioFiscalReceptor,
    },
    CfdiType: 'I', // I-Ingreso, E-Egreso, T-Traslado, N-Nómina, P-Pago
    NameId: '1', // Identificador interno
    ExpeditionPlace: datos.lugarExpedicion,
    PaymentForm: datos.formaPago,
    PaymentMethod: datos.metodoPago,
    Currency: datos.moneda,
    Serie: datos.serie || undefined,
    Folio: datos.folio || undefined,
    Observations: datos.observaciones || undefined,
    Items: datos.conceptos.map(concepto => ({
      ProductCode: concepto.claveProdServ,
      IdentificationNumber: concepto.descripcion.substring(0, 100),
      Description: concepto.descripcion,
      Unit: concepto.unidad,
      UnitCode: concepto.claveUnidad,
      UnitPrice: concepto.valorUnitario,
      Quantity: concepto.cantidad,
      Subtotal: concepto.valorUnitario * concepto.cantidad,
      Discount: concepto.descuento || 0,
      TaxObject: concepto.objetoImp,
      Taxes: concepto.impuestos ? [
        ...(concepto.impuestos.traslados?.map(t => ({
          Total: t.importe,
          Name: t.impuesto,
          Base: t.base,
          Rate: t.tasaOCuota,
          IsRetention: false,
        })) || []),
        ...(concepto.impuestos.retenciones?.map(r => ({
          Total: r.importe,
          Name: r.impuesto,
          Base: r.base,
          Rate: r.tasaOCuota,
          IsRetention: true,
        })) || []),
      ] : undefined,
    })),
  }
}

// Validar RFC
export function validarRFC(rfc: string): boolean {
  // RFC Persona Física: 13 caracteres (AAAA######XXX)
  // RFC Persona Moral: 12 caracteres (AAA######XXX)
  const rfcRegex = /^([A-ZÑ&]{3,4})?(\d{6})?([A-Z\d]{3})?$/
  return rfcRegex.test(rfc.toUpperCase())
}

// Calcular impuestos
export function calcularImpuestos(subtotal: number, tasaIVA: number = 0.16) {
  const iva = subtotal * tasaIVA
  const total = subtotal + iva

  return {
    subtotal: Number(subtotal.toFixed(2)),
    iva: Number(iva.toFixed(2)),
    total: Number(total.toFixed(2)),
  }
}
