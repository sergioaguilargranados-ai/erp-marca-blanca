import { db } from '@/lib/db'
import { ventas, detallesVenta, usuarios, clientes, sucursales, empresas } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export default async function TicketVentaPage({
  params
}: {
  params: { id: string; ventaId: string }
}) {
  // Obtener venta con todas las relaciones
  const [ventaData] = await db
    .select({
      venta: ventas,
      usuario: usuarios,
      cliente: clientes,
      sucursal: sucursales,
      empresa: empresas,
    })
    .from(ventas)
    .leftJoin(usuarios, eq(ventas.usuarioId, usuarios.id))
    .leftJoin(clientes, eq(ventas.clienteId, clientes.id))
    .leftJoin(sucursales, eq(ventas.sucursalId, sucursales.id))
    .leftJoin(empresas, eq(ventas.empresaId, empresas.id))
    .where(and(
      eq(ventas.id, params.ventaId),
      eq(ventas.empresaId, params.id)
    ))
    .limit(1)

  if (!ventaData) {
    redirect(`/admin/empresas/${params.id}/ventas`)
  }

  const { venta, usuario, cliente, sucursal, empresa } = ventaData

  // Obtener detalles de la venta
  const detalles = await db
    .select()
    .from(detallesVenta)
    .where(eq(detallesVenta.ventaId, params.ventaId))

  return (
    <html>
      <head>
        <title>Ticket {venta.folio}</title>
        <style>{`
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
            @page { margin: 0.5cm; }
          }

          body {
            font-family: 'Courier New', monospace;
            max-width: 80mm;
            margin: 0 auto;
            padding: 10px;
            font-size: 12px;
            line-height: 1.4;
          }

          .header {
            text-align: center;
            border-bottom: 2px dashed #333;
            padding-bottom: 10px;
            margin-bottom: 10px;
          }

          .header h1 {
            font-size: 18px;
            margin: 5px 0;
            font-weight: bold;
          }

          .header p {
            margin: 3px 0;
            font-size: 11px;
          }

          .section {
            margin: 10px 0;
            border-bottom: 1px dashed #333;
            padding-bottom: 8px;
          }

          .row {
            display: flex;
            justify-content: space-between;
            margin: 3px 0;
          }

          .item {
            margin: 5px 0;
          }

          .item-name {
            font-weight: bold;
          }

          .item-details {
            display: flex;
            justify-content: space-between;
            font-size: 11px;
          }

          .totals {
            margin-top: 10px;
            font-size: 13px;
          }

          .total-row {
            display: flex;
            justify-content: space-between;
            margin: 3px 0;
          }

          .total-final {
            font-size: 16px;
            font-weight: bold;
            border-top: 2px solid #333;
            padding-top: 5px;
            margin-top: 5px;
          }

          .footer {
            text-align: center;
            margin-top: 15px;
            padding-top: 10px;
            border-top: 2px dashed #333;
            font-size: 11px;
          }

          .print-button {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 24px;
            background: #10b981;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-family: system-ui;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          }

          .print-button:hover {
            background: #059669;
          }
        `}</style>
      </head>
      <body>
        <button className="print-button no-print" onClick={() => window.print()}>
          🖨️ Imprimir Ticket
        </button>

        <div className="header">
          <h1>{empresa?.nombre || 'MI EMPRESA'}</h1>
          {sucursal && (
            <>
              <p>{sucursal.nombre}</p>
              {sucursal.direccion && <p>{sucursal.direccion}</p>}
              {sucursal.ciudad && sucursal.estado && (
                <p>{sucursal.ciudad}, {sucursal.estado}</p>
              )}
              {sucursal.telefono && <p>Tel: {sucursal.telefono}</p>}
              {sucursal.rfc && <p>RFC: {sucursal.rfc}</p>}
            </>
          )}
        </div>

        <div className="section">
          <div className="row">
            <span>Folio:</span>
            <strong>{venta.folio}</strong>
          </div>
          <div className="row">
            <span>Fecha:</span>
            <span>{new Date(venta.createdAt).toLocaleDateString('es-MX')}</span>
          </div>
          <div className="row">
            <span>Hora:</span>
            <span>{new Date(venta.createdAt).toLocaleTimeString('es-MX')}</span>
          </div>
          <div className="row">
            <span>Vendedor:</span>
            <span>{usuario?.nombre || 'N/A'}</span>
          </div>
          <div className="row">
            <span>Cliente:</span>
            <span>{cliente?.nombre || venta.nombreCliente || 'Público General'}</span>
          </div>
        </div>

        <div className="section">
          <strong>PRODUCTOS</strong>
          {detalles.map((detalle, index) => (
            <div key={detalle.id} className="item">
              <div className="item-name">{detalle.nombreProducto}</div>
              <div className="item-details">
                <span>{detalle.cantidad} {detalle.unidadMedida} x ${Number(detalle.precioUnitario).toFixed(2)}</span>
                <strong>${Number(detalle.total).toFixed(2)}</strong>
              </div>
              {detalle.codigoBarras && (
                <div style={{ fontSize: '10px', color: '#666' }}>
                  {detalle.codigoBarras}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="totals">
          <div className="total-row">
            <span>Subtotal:</span>
            <span>${Number(venta.subtotal).toFixed(2)}</span>
          </div>
          <div className="total-row">
            <span>IVA:</span>
            <span>${Number(venta.iva).toFixed(2)}</span>
          </div>
          {Number(venta.descuento) > 0 && (
            <div className="total-row">
              <span>Descuento:</span>
              <span>-${Number(venta.descuento).toFixed(2)}</span>
            </div>
          )}
          <div className="total-row total-final">
            <span>TOTAL:</span>
            <span>${Number(venta.total).toFixed(2)}</span>
          </div>
        </div>

        {venta.metodoPago === 'efectivo' && venta.montoPagado && (
          <div className="section">
            <div className="row">
              <span>Método de pago:</span>
              <span>EFECTIVO</span>
            </div>
            <div className="row">
              <span>Pagado:</span>
              <span>${Number(venta.montoPagado).toFixed(2)}</span>
            </div>
            <div className="row">
              <span>Cambio:</span>
              <strong>${Number(venta.cambio || 0).toFixed(2)}</strong>
            </div>
          </div>
        )}

        {venta.metodoPago !== 'efectivo' && (
          <div className="section">
            <div className="row">
              <span>Método de pago:</span>
              <span>{venta.metodoPago.toUpperCase()}</span>
            </div>
          </div>
        )}

        <div className="footer">
          <p>¡GRACIAS POR TU COMPRA!</p>
          {empresa?.emailContacto && (
            <p>Contacto: {empresa.emailContacto}</p>
          )}
          <p style={{ marginTop: '10px', fontSize: '10px' }}>
            Ticket generado por ERP Marca Blanca
          </p>
        </div>

        <script dangerouslySetInnerHTML={{
          __html: `
            document.querySelector('.print-button').addEventListener('click', function() {
              window.print();
            });
          `
        }} />
      </body>
    </html>
  )
}
