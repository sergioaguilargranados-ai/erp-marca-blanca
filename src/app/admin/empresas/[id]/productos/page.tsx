import { db } from '@/lib/db'
import { empresas, productos, categorias } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button-premium'
import { Card, CardContent } from '@/components/ui/card-premium'
import { Badge } from '@/components/ui/badge-premium'
import { Package, FolderTree, Plus, ArrowLeft, Eye, Pencil, Image } from 'lucide-react'

export default async function ProductosPage({ params }: { params: { id: string } }) {
  const [empresa] = await db
    .select()
    .from(empresas)
    .where(eq(empresas.id, params.id))
    .limit(1)

  if (!empresa) {
    redirect('/admin/empresas')
  }

  // Obtener productos con categorías
  const productosEmpresa = await db
    .select({
      producto: productos,
      categoria: categorias,
    })
    .from(productos)
    .leftJoin(categorias, eq(productos.categoriaId, categorias.id))
    .where(eq(productos.empresaId, params.id))
    .orderBy(productos.nombre)

  return (
    <div className="min-h-screen">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-900/10 dark:to-slate-900 -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-purple-100/50 dark:from-blue-900/20 dark:to-purple-900/20 -z-10" />

      <div className="space-y-8 p-8">
        {/* Header Premium */}
        <Card variant="glass" className="shadow-2xl animate-in fade-in slide-in-from-top duration-700">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg shadow-emerald-500/30">
                  <Package className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    Catálogo de Productos
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-2">
                    <span>{empresa.nombre}</span>
                    <Badge variant="success">
                      {productosEmpresa.length} productos
                    </Badge>
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Link href={`/admin/empresas/${params.id}/categorias`}>
                  <Button variant="default" className="gap-2">
                    <FolderTree className="h-4 w-4" />
                    Categorías
                  </Button>
                </Link>
                <Link href={`/admin/empresas/${params.id}/productos/nuevo`}>
                  <Button variant="success" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nuevo Producto
                  </Button>
                </Link>
                <Link href={`/admin/empresas/${params.id}`}>
                  <Button variant="glass" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Volver
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabla Premium */}
        <Card variant="glass" className="shadow-xl animate-in fade-in slide-in-from-bottom duration-700 delay-100">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200/50 dark:divide-slate-700/50">
                <thead className="backdrop-blur-xl bg-slate-50/80 dark:bg-slate-800/80">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      Código de Barras
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      Precio Venta
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
                  {productosEmpresa.map(({ producto, categoria }, index) => (
                    <tr
                      key={producto.id}
                      className="group hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors animate-in fade-in slide-in-from-left duration-500"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          {producto.imagenPrincipal ? (
                            <img
                              src={producto.imagenPrincipal}
                              alt={producto.nombre}
                              className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-blue-400 transition-all"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Image className="h-6 w-6 text-slate-400" />
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {producto.nombre}
                            </div>
                            {producto.sku && (
                              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                                SKU: {producto.sku}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {categoria ? (
                          <Badge variant="default" className="font-medium">
                            {categoria.nombre}
                          </Badge>
                        ) : (
                          <span className="text-sm text-slate-400">Sin categoría</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {producto.codigoBarras ? (
                          <code className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-sm font-mono text-slate-900 dark:text-white">
                            {producto.codigoBarras}
                          </code>
                        ) : (
                          <span className="text-sm text-slate-400">Sin código</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-base font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                          ${Number(producto.precioVentaMinorista).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {producto.unidadMedida}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {producto.activo ? (
                          <Badge variant="success">Activo</Badge>
                        ) : (
                          <Badge variant="destructive">Inactivo</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/empresas/${params.id}/productos/${producto.id}`}>
                            <Button variant="ghost" size="sm" className="gap-1.5 hover:text-blue-600">
                              <Eye className="h-4 w-4" />
                              Ver
                            </Button>
                          </Link>
                          <Link href={`/admin/empresas/${params.id}/productos/${producto.id}/editar`}>
                            <Button variant="ghost" size="sm" className="gap-1.5 hover:text-emerald-600">
                              <Pencil className="h-4 w-4" />
                              Editar
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {productosEmpresa.length === 0 && (
                <div className="text-center py-16">
                  <div className="inline-flex p-6 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-3xl mb-4">
                    <Package className="h-16 w-16 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    No hay productos registrados
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Comienza agregando tu primer producto al catálogo
                  </p>
                  <Link href={`/admin/empresas/${params.id}/productos/nuevo`}>
                    <Button variant="gradient" size="lg" className="gap-2">
                      <Plus className="h-5 w-5" />
                      Crear Primer Producto
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
