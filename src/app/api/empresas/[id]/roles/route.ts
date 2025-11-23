import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { roles, permisos } from '@/lib/db/schema'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { nombre, descripcion, permisos: permisosData } = body

    if (!nombre || !permisosData || !Array.isArray(permisosData)) {
      return NextResponse.json(
        { error: 'Datos inválidos' },
        { status: 400 }
      )
    }

    // Crear el rol
    const [nuevoRol] = await db
      .insert(roles)
      .values({
        empresaId: params.id,
        nombre,
        descripcion: descripcion || null,
        esPredefinido: false,
        activo: true,
      })
      .returning()

    // Crear los permisos
    if (permisosData.length > 0) {
      await db.insert(permisos).values(
        permisosData.map((permiso: { modulo: string; accion: string; permitido: boolean }) => ({
          rolId: nuevoRol.id,
          modulo: permiso.modulo,
          accion: permiso.accion,
          permitido: permiso.permitido,
        }))
      )
    }

    return NextResponse.json(
      {
        success: true,
        rol: nuevoRol,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error al crear rol:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
