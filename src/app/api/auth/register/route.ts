import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { empresas, usuarios, planes } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      nombreEmpresa,
      subdominio,
      emailContacto,
      telefonoContacto,
      nombreContacto,
      nombreUsuario,
      emailUsuario,
      password,
      planId,
      moneda,
    } = body

    // Validar datos requeridos
    if (!nombreEmpresa || !subdominio || !emailContacto || !nombreUsuario || !emailUsuario || !password) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      )
    }

    // Validar formato de subdominio
    const subdominioRegex = /^[a-z0-9-]+$/
    if (!subdominioRegex.test(subdominio)) {
      return NextResponse.json(
        { error: 'El subdominio solo puede contener letras minúsculas, números y guiones' },
        { status: 400 }
      )
    }

    // Verificar que el subdominio no exista
    const [subdominioExistente] = await db
      .select()
      .from(empresas)
      .where(eq(empresas.subdominio, subdominio))
      .limit(1)

    if (subdominioExistente) {
      return NextResponse.json(
        { error: 'Este subdominio ya está en uso' },
        { status: 400 }
      )
    }

    // Verificar que el email de usuario no exista
    const [emailExistente] = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.email, emailUsuario))
      .limit(1)

    if (emailExistente) {
      return NextResponse.json(
        { error: 'Este email ya está registrado' },
        { status: 400 }
      )
    }

    // Obtener el plan correspondiente
    const planNombre = planId === 'basico' ? 'Básico' : planId === 'pro' ? 'Pro' : 'Enterprise'
    const planBuscado = `${planNombre}${moneda === 'USD' ? ' USD' : ''}`

    const [plan] = await db
      .select()
      .from(planes)
      .where(
        and(
          eq(planes.nombre, planBuscado),
          eq(planes.activo, true)
        )
      )
      .limit(1)

    if (!plan) {
      return NextResponse.json(
        { error: 'Plan no encontrado' },
        { status: 400 }
      )
    }

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(password, 10)

    // Calcular fechas de prueba (30 días)
    const fechaInicioPrueba = new Date()
    const fechaFinPrueba = new Date()
    fechaFinPrueba.setDate(fechaFinPrueba.getDate() + 30)

    // Calcular próximo pago
    const proximoPago = new Date()
    proximoPago.setDate(proximoPago.getDate() + 30)

    // Crear empresa (estado: pendiente de aprobación)
    const [nuevaEmpresa] = await db
      .insert(empresas)
      .values({
        nombre: nombreEmpresa,
        subdominio: subdominio.toLowerCase(),
        planId: plan.id,
        estado: 'pendiente', // Requiere aprobación manual
        fechaInicioPrueba,
        fechaFinPrueba,
        proximoPago,
        nombreContacto,
        emailContacto,
        telefonoContacto,
        nombreSistema: nombreEmpresa,
      })
      .returning()

    // Crear usuario administrador
    await db
      .insert(usuarios)
      .values({
        empresaId: nuevaEmpresa.id,
        nombre: nombreUsuario,
        email: emailUsuario,
        passwordHash,
        activo: false, // Se activará cuando se apruebe la empresa
        emailVerificado: false,
      })

    // TODO: Enviar email de verificación
    // TODO: Notificar al super admin de nueva empresa pendiente

    return NextResponse.json(
      {
        success: true,
        message: 'Empresa registrada exitosamente. Espera la aprobación del administrador.',
        empresaId: nuevaEmpresa.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error al registrar empresa:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
