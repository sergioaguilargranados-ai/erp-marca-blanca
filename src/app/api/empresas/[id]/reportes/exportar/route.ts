import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { empresas, ventas, detallesVenta, productos, usuarios, sucursales } from '@/lib/db/schema'
import { eq, and, gte, desc, sql } from 'drizzle-orm'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const formato = searchParams.get('formato') || 'csv'
    const periodo = searchParams.get('periodo') || 'mes'

    // Calcular fechas
    const ahora = new Date()
    let fechaDesde = new Date()

    switch (periodo) {
      case 'hoy':
        fechaDesde.setHours(0, 0, 0, 0)
        break
      case 'semana':
        fechaDesde.setDate(ahora.getDate() - 7)
        break
      case 'mes':
        fechaDesde.setDate(ahora.getDate() - 30)
        break
      case 'trimestre':
        fechaDesde.setMonth(ahora.getMonth() - 3)
        break
      case 'año':
        fechaDesde.setFullYear(ahora.getFullYear() - 1)
        break
    }

    // Obtener empresa
    const [empresa] = await db
      .select()
      .from(empresas)
      .where(eq(empresas.id, params.id))
      .limit(1)

    if (!empresa) {
      return NextResponse.json({ error: 'Empresa no encontrada' }, { status: 404 })
    }

    // Obtener datos de ventas
    const ventasPeriodo = await db
      .select({
        venta: ventas,
        usuario: usuarios,
        sucursal: sucursales,
      })
      .from(ventas)
      .leftJoin(usuarios, eq(ventas.usuarioId, usuarios.id))
      .leftJoin(sucursales, eq(ventas.sucursalId, sucursales.id))
      .where(and(
        eq(ventas.empresaId, params.id),
        eq(ventas.estado, 'completada'),
        gte(ventas.createdAt, fechaDesde)
      ))
      .orderBy(desc(ventas.createdAt))

    // Productos más vendidos
    const productosVendidos = await db
      .select({
        producto: productos,
        totalVendido: sql<number>`SUM(CAST(${detallesVenta.cantidad} AS INTEGER))`.as('total_vendido'),
        montoTotal: sql<number>`SUM(CAST(${detallesVenta.total} AS DECIMAL))`.as('monto_total'),
      })
      .from(detallesVenta)
      .innerJoin(ventas, eq(detallesVenta.ventaId, ventas.id))
      .innerJoin(productos, eq(detallesVenta.productoId, productos.id))
      .where(and(
        eq(ventas.empresaId, params.id),
        eq(ventas.estado, 'completada'),
        gte(ventas.createdAt, fechaDesde)
      ))
      .groupBy(productos.id, productos.nombre, productos.codigoBarras, productos.precioVentaMinorista)
      .orderBy(desc(sql`SUM(CAST(${detallesVenta.cantidad} AS INTEGER))`))
      .limit(20)

    // Ventas por vendedor
    const ventasPorVendedor = await db
      .select({
        usuario: usuarios,
        totalVentas: sql<number>`COUNT(*)`.as('total_ventas'),
        montoTotal: sql<number>`SUM(CAST(${ventas.total} AS DECIMAL))`.as('monto_total'),
      })
      .from(ventas)
      .leftJoin(usuarios, eq(ventas.usuarioId, usuarios.id))
      .where(and(
        eq(ventas.empresaId, params.id),
        eq(ventas.estado, 'completada'),
        gte(ventas.createdAt, fechaDesde)
      ))
      .groupBy(usuarios.id, usuarios.nombre)
      .orderBy(desc(sql`SUM(CAST(${ventas.total} AS DECIMAL))`))

    if (formato === 'csv') {
      // Generar CSV
      let csv = `Reporte de Ventas - ${empresa.nombre}\n`
      csv += `Período: ${periodo}\n`
      csv += `Generado: ${new Date().toLocaleString('es-MX')}\n\n`

      // Resumen general
      const totalVentas = ventasPeriodo.length
      const montoTotal = ventasPeriodo.reduce((sum, v) => sum + Number(v.venta.total), 0)
      const promedio = totalVentas > 0 ? montoTotal / totalVentas : 0

      csv += `RESUMEN GENERAL\n`
      csv += `Total de Ventas,${totalVentas}\n`
      csv += `Monto Total,${montoTotal.toFixed(2)}\n`
      csv += `Promedio por Venta,${promedio.toFixed(2)}\n\n`

      // Ventas por vendedor
      csv += `VENTAS POR VENDEDOR\n`
      csv += `Vendedor,Total Ventas,Monto Total,Promedio\n`
      ventasPorVendedor.forEach(v => {
        const prom = v.totalVentas > 0 ? Number(v.montoTotal) / v.totalVentas : 0
        csv += `"${v.usuario?.nombre || 'Sin asignar'}",${v.totalVentas},${Number(v.montoTotal).toFixed(2)},${prom.toFixed(2)}\n`
      })
      csv += `\n`

      // Productos más vendidos
      csv += `PRODUCTOS MÁS VENDIDOS\n`
      csv += `Producto,Código,Cantidad Vendida,Monto Total\n`
      productosVendidos.forEach(p => {
        csv += `"${p.producto.nombre}","${p.producto.codigoBarras || 'N/A'}",${p.totalVendido},${Number(p.montoTotal).toFixed(2)}\n`
      })
      csv += `\n`

      // Detalle de ventas
      csv += `DETALLE DE VENTAS\n`
      csv += `Folio,Fecha,Hora,Cliente,Vendedor,Sucursal,Método Pago,Subtotal,IVA,Total\n`
      ventasPeriodo.forEach(v => {
        const fecha = new Date(v.venta.createdAt)
        csv += `"${v.venta.folio}","${fecha.toLocaleDateString('es-MX')}","${fecha.toLocaleTimeString('es-MX')}","${v.venta.nombreCliente || 'Público General'}","${v.usuario?.nombre || 'N/A'}","${v.sucursal?.nombre || 'N/A'}","${v.venta.metodoPago}",${Number(v.venta.subtotal).toFixed(2)},${Number(v.venta.iva).toFixed(2)},${Number(v.venta.total).toFixed(2)}\n`
      })

      // Retornar CSV
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="reporte-ventas-${periodo}-${Date.now()}.csv"`,
        },
      })
    } else if (formato === 'pdf') {
      // Generar HTML simple para PDF (el navegador puede convertir a PDF)
      const totalVentas = ventasPeriodo.length
      const montoTotal = ventasPeriodo.reduce((sum, v) => sum + Number(v.venta.total), 0)
      const promedio = totalVentas > 0 ? montoTotal / totalVentas : 0

      let html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Reporte de Ventas - ${empresa.nombre}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              color: #333;
            }
            h1 {
              color: #1e293b;
              border-bottom: 3px solid #3b82f6;
              padding-bottom: 10px;
            }
            h2 {
              color: #475569;
              margin-top: 30px;
              border-bottom: 2px solid #cbd5e1;
              padding-bottom: 5px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 15px;
              font-size: 12px;
            }
            th {
              background-color: #f1f5f9;
              padding: 10px;
              text-align: left;
              border: 1px solid #cbd5e1;
              font-weight: 600;
            }
            td {
              padding: 8px;
              border: 1px solid #e2e8f0;
            }
            tr:nth-child(even) {
              background-color: #f8fafc;
            }
            .summary {
              background-color: #dbeafe;
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .summary-item {
              margin: 8px 0;
              font-size: 14px;
            }
            .summary-item strong {
              color: #1e40af;
            }
            .text-right {
              text-align: right;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              color: #64748b;
              font-size: 11px;
            }
          </style>
        </head>
        <body>
          <h1>Reporte de Ventas - ${empresa.nombre}</h1>
          <p><strong>Período:</strong> ${periodo} | <strong>Generado:</strong> ${new Date().toLocaleString('es-MX')}</p>

          <div class="summary">
            <div class="summary-item"><strong>Total de Ventas:</strong> ${totalVentas}</div>
            <div class="summary-item"><strong>Monto Total:</strong> $${montoTotal.toFixed(2)}</div>
            <div class="summary-item"><strong>Promedio por Venta:</strong> $${promedio.toFixed(2)}</div>
          </div>

          <h2>Ventas por Vendedor</h2>
          <table>
            <thead>
              <tr>
                <th>Vendedor</th>
                <th class="text-right">Total Ventas</th>
                <th class="text-right">Monto Total</th>
                <th class="text-right">Promedio</th>
              </tr>
            </thead>
            <tbody>
              ${ventasPorVendedor.map(v => {
                const prom = v.totalVentas > 0 ? Number(v.montoTotal) / v.totalVentas : 0
                return `
                  <tr>
                    <td>${v.usuario?.nombre || 'Sin asignar'}</td>
                    <td class="text-right">${v.totalVentas}</td>
                    <td class="text-right">$${Number(v.montoTotal).toFixed(2)}</td>
                    <td class="text-right">$${prom.toFixed(2)}</td>
                  </tr>
                `
              }).join('')}
            </tbody>
          </table>

          <h2>Productos Más Vendidos (Top 20)</h2>
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Código</th>
                <th class="text-right">Cantidad</th>
                <th class="text-right">Monto Total</th>
              </tr>
            </thead>
            <tbody>
              ${productosVendidos.map(p => `
                <tr>
                  <td>${p.producto.nombre}</td>
                  <td>${p.producto.codigoBarras || 'N/A'}</td>
                  <td class="text-right">${p.totalVendido}</td>
                  <td class="text-right">$${Number(p.montoTotal).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <h2>Detalle de Ventas (Últimas ${Math.min(50, ventasPeriodo.length)})</h2>
          <table>
            <thead>
              <tr>
                <th>Folio</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Vendedor</th>
                <th>Método</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${ventasPeriodo.slice(0, 50).map(v => {
                const fecha = new Date(v.venta.createdAt)
                return `
                  <tr>
                    <td>${v.venta.folio}</td>
                    <td>${fecha.toLocaleDateString('es-MX')} ${fecha.toLocaleTimeString('es-MX')}</td>
                    <td>${v.venta.nombreCliente || 'Público General'}</td>
                    <td>${v.usuario?.nombre || 'N/A'}</td>
                    <td>${v.venta.metodoPago}</td>
                    <td class="text-right">$${Number(v.venta.total).toFixed(2)}</td>
                  </tr>
                `
              }).join('')}
            </tbody>
          </table>

          <div class="footer">
            <p>ERP Marca Blanca - Sistema Multi-Tenant | Generado automáticamente</p>
          </div>

          <script>
            // Auto-abrir el diálogo de impresión
            window.onload = () => window.print();
          </script>
        </body>
        </html>
      `

      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      })
    }

    return NextResponse.json({ error: 'Formato no soportado' }, { status: 400 })
  } catch (error) {
    console.error('Error exportando reporte:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
