import { db } from '@/lib/db'
import { empresas, configuracionFacturacion, ventas, clientes, sucursales } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { FormularioNuevaFactura } from './form-factura'

export default async function NuevaFacturaPage({
  params,
  searchParams
}: {
  params: { id: string }
  searchParams: { ventaId?: string }
}) {
  const [empresa] = await db
    .select()
    .from(empresas)
    .where(eq(empresas.id, params.id))
    .limit(1)

  if (!empresa) {
    redirect('/admin/empresas')
  }

  // Verificar configuración de facturación
  const [config] = await db
    .select()
    .from(configuracionFacturacion)
    .where(eq(configuracionFacturacion.empresaId, params.id))
    .limit(1)

  if (!config) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-yellow-900 mb-2">
            ⚠️ Configuración Requerida
          </h2>
          <p className="text-yellow-800 mb-4">
            Debes configurar la facturación antes de emitir facturas.
          </p>
          <a
            href={`/admin/empresas/${params.id}/facturacion/configurar`}
            className="inline-block px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          >
            Configurar Ahora
          </a>
        </div>
      </div>
    )
  }

  // Obtener venta si se especifica
  let ventaData = null
  if (searchParams.ventaId) {
    const [venta] = await db
      .select({
        venta: ventas,
        cliente: clientes,
        sucursal: sucursales,
      })
      .from(ventas)
      .leftJoin(clientes, eq(ventas.clienteId, clientes.id))
      .leftJoin(sucursales, eq(ventas.sucursalId, sucursales.id))
      .where(and(
        eq(ventas.id, searchParams.ventaId),
        eq(ventas.empresaId, params.id)
      ))
      .limit(1)

    if (venta) {
      ventaData = venta
    }
  }

  // Obtener clientes con datos fiscales completos
  const clientesFiscales = await db
    .select()
    .from(clientes)
    .where(and(
      eq(clientes.empresaId, params.id),
      eq(clientes.activo, true)
    ))
    .orderBy(clientes.nombre)

  // Filtrar solo clientes con RFC
  const clientesConRFC = clientesFiscales.filter(c => c.rfc && c.razonSocial && c.regimenFiscal && c.usoCfdi)

  // Obtener ventas recientes sin facturar
  const ventasRecientes = await db
    .select({
      venta: ventas,
      cliente: clientes,
    })
    .from(ventas)
    .leftJoin(clientes, eq(ventas.clienteId, clientes.id))
    .where(and(
      eq(ventas.empresaId, params.id),
      eq(ventas.estado, 'completada'),
      eq(ventas.requiereFactura, 'pendiente')
    ))
    .orderBy(desc(ventas.createdAt))
    .limit(20)

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Nueva Factura CFDI 4.0</h1>
            <p className="text-slate-600 mt-1">
              Generar factura electrónica para {empresa.nombre}
            </p>
            {ventaData && (
              <p className="text-sm text-blue-600 mt-1">
                Facturando venta: {ventaData.venta.folio}
              </p>
            )}
          </div>
          <a
            href={`/admin/empresas/${params.id}/facturacion`}
            className="text-slate-600 hover:text-slate-900"
          >
            ← Volver
          </a>
        </div>

        {config.pacModoSandbox && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-orange-800">
              ⚠️ <strong>Modo Sandbox Activo</strong> - Esta factura será de prueba y no tendrá validez fiscal.
            </p>
          </div>
        )}

        {clientesConRFC.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              ⚠️ No hay clientes con datos fiscales completos. <a href={`/admin/empresas/${params.id}/clientes/nuevo`} className="underline">Crear cliente con RFC</a>
            </p>
          </div>
        )}

        <FormularioNuevaFactura
          empresaId={params.id}
          config={{
            rfc: config.rfc,
            razonSocial: config.razonSocial,
            regimenFiscal: config.regimenFiscal,
            codigoPostal: config.codigoPostal,
            serie: config.serieDefault || 'A',
            folioActual: config.folioActual || '1',
          }}
          clientes={clientesConRFC.map(c => ({
            id: c.id,
            nombre: c.nombre,
            razonSocial: c.razonSocial!,
            rfc: c.rfc!,
            regimenFiscal: c.regimenFiscal!,
            usoCfdi: c.usoCfdi!,
            codigoPostal: c.codigoPostal!,
          }))}
          ventaPreseleccionada={ventaData ? {
            id: ventaData.venta.id,
            folio: ventaData.venta.folio,
            total: Number(ventaData.venta.total),
            subtotal: Number(ventaData.venta.subtotal),
            iva: Number(ventaData.venta.iva),
            metodoPago: ventaData.venta.metodoPago,
            clienteId: ventaData.venta.clienteId,
          } : undefined}
          ventasDisponibles={ventasRecientes.map(({ venta, cliente }) => ({
            id: venta.id,
            folio: venta.folio,
            fecha: venta.createdAt,
            cliente: cliente?.nombre || venta.nombreCliente || 'Público General',
            total: Number(venta.total),
          }))}
        />
      </div>
    </div>
  )
}
