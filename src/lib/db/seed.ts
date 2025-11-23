import { db } from './index';
import { planes, roles, permisos, empresas, usuarios } from './schema';
import bcrypt from 'bcryptjs';

export async function seedDatabase() {
  console.log('🌱 Iniciando seed de base de datos...');

  try {
    // 1. Crear Planes de Suscripción
    console.log('📦 Creando planes de suscripción...');

    const [planBasico] = await db.insert(planes).values({
      nombre: 'Básico',
      descripcion: 'Plan ideal para pequeños negocios con 1 sucursal',
      maxSucursales: 1,
      maxUsuarios: 5,
      maxProductos: 1000,
      activo: true,
    }).returning();

    const [planProfesional] = await db.insert(planes).values({
      nombre: 'Profesional',
      descripcion: 'Plan para negocios en crecimiento con hasta 5 sucursales',
      maxSucursales: 5,
      maxUsuarios: 15,
      maxProductos: 10000,
      activo: true,
    }).returning();

    const [planEmpresarial] = await db.insert(planes).values({
      nombre: 'Empresarial',
      descripcion: 'Plan completo para grandes empresas con hasta 99 sucursales',
      maxSucursales: 99,
      maxUsuarios: 999,
      maxProductos: 999999,
      activo: true,
    }).returning();

    console.log('✅ Planes creados');

    // 2. Crear empresa de demostración
    console.log('🏢 Creando empresa de demostración...');

    const [empresaDemo] = await db.insert(empresas).values({
      planId: planProfesional.id,
      nombre: 'Empresa Demo',
      subdominio: 'demo',
      estado: 'activa',
      fechaInicioPrueba: new Date(),
      fechaFinPrueba: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
      emailContacto: 'contacto@demo.com',
    }).returning();

    console.log('✅ Empresa demo creada');

    // 3. Crear Roles Predefinidos (para la empresa demo)
    console.log('👥 Creando roles predefinidos...');

    const rolesCreados: Record<string, any> = {};

    const rolesData = [
      {
        empresaId: empresaDemo.id,
        nombre: 'Super Administrador',
        descripcion: 'Acceso total al sistema',
        esPredefinido: true,
        activo: true,
        key: 'super-admin',
      },
      {
        empresaId: empresaDemo.id,
        nombre: 'Administrador',
        descripcion: 'Administrador de empresa',
        esPredefinido: true,
        activo: true,
        key: 'admin',
      },
      {
        empresaId: empresaDemo.id,
        nombre: 'Gerente',
        descripcion: 'Gerente de sucursal',
        esPredefinido: true,
        activo: true,
        key: 'gerente',
      },
      {
        empresaId: empresaDemo.id,
        nombre: 'Vendedor',
        descripcion: 'Personal de ventas',
        esPredefinido: true,
        activo: true,
        key: 'vendedor',
      },
      {
        empresaId: empresaDemo.id,
        nombre: 'Cajero',
        descripcion: 'Operador de caja',
        esPredefinido: true,
        activo: true,
        key: 'cajero',
      },
      {
        empresaId: empresaDemo.id,
        nombre: 'Almacenista',
        descripcion: 'Encargado de almacén e inventario',
        esPredefinido: true,
        activo: true,
        key: 'almacenista',
      },
    ];

    for (const rol of rolesData) {
      const { key, ...data } = rol;
      const [created] = await db.insert(roles).values(data).returning();
      rolesCreados[key] = created;
    }

    console.log('✅ Roles creados');

    // 4. Crear Permisos por Rol
    console.log('🔑 Creando permisos...');

    const permisosData = [
      // Super Admin - Todos los permisos
      { rolId: rolesCreados['super-admin'].id, modulo: 'empresas', accion: 'crear' },
      { rolId: rolesCreados['super-admin'].id, modulo: 'empresas', accion: 'leer' },
      { rolId: rolesCreados['super-admin'].id, modulo: 'empresas', accion: 'actualizar' },
      { rolId: rolesCreados['super-admin'].id, modulo: 'empresas', accion: 'eliminar' },
      { rolId: rolesCreados['super-admin'].id, modulo: 'planes', accion: 'crear' },
      { rolId: rolesCreados['super-admin'].id, modulo: 'planes', accion: 'leer' },
      { rolId: rolesCreados['super-admin'].id, modulo: 'planes', accion: 'actualizar' },
      { rolId: rolesCreados['super-admin'].id, modulo: 'planes', accion: 'eliminar' },

      // Admin - Gestión completa de empresa
      { rolId: rolesCreados['admin'].id, modulo: 'sucursales', accion: 'crear' },
      { rolId: rolesCreados['admin'].id, modulo: 'sucursales', accion: 'leer' },
      { rolId: rolesCreados['admin'].id, modulo: 'sucursales', accion: 'actualizar' },
      { rolId: rolesCreados['admin'].id, modulo: 'usuarios', accion: 'crear' },
      { rolId: rolesCreados['admin'].id, modulo: 'usuarios', accion: 'leer' },
      { rolId: rolesCreados['admin'].id, modulo: 'usuarios', accion: 'actualizar' },
      { rolId: rolesCreados['admin'].id, modulo: 'productos', accion: 'crear' },
      { rolId: rolesCreados['admin'].id, modulo: 'productos', accion: 'leer' },
      { rolId: rolesCreados['admin'].id, modulo: 'productos', accion: 'actualizar' },
      { rolId: rolesCreados['admin'].id, modulo: 'productos', accion: 'eliminar' },
      { rolId: rolesCreados['admin'].id, modulo: 'ventas', accion: 'crear' },
      { rolId: rolesCreados['admin'].id, modulo: 'ventas', accion: 'leer' },
      { rolId: rolesCreados['admin'].id, modulo: 'reportes', accion: 'leer' },
      { rolId: rolesCreados['admin'].id, modulo: 'configuracion', accion: 'actualizar' },

      // Gerente - Operaciones de sucursal
      { rolId: rolesCreados['gerente'].id, modulo: 'productos', accion: 'leer' },
      { rolId: rolesCreados['gerente'].id, modulo: 'productos', accion: 'actualizar' },
      { rolId: rolesCreados['gerente'].id, modulo: 'inventario', accion: 'leer' },
      { rolId: rolesCreados['gerente'].id, modulo: 'inventario', accion: 'actualizar' },
      { rolId: rolesCreados['gerente'].id, modulo: 'ventas', accion: 'crear' },
      { rolId: rolesCreados['gerente'].id, modulo: 'ventas', accion: 'leer' },
      { rolId: rolesCreados['gerente'].id, modulo: 'reportes', accion: 'leer' },
      { rolId: rolesCreados['gerente'].id, modulo: 'turnos', accion: 'leer' },

      // Vendedor - Ventas y clientes
      { rolId: rolesCreados['vendedor'].id, modulo: 'productos', accion: 'leer' },
      { rolId: rolesCreados['vendedor'].id, modulo: 'clientes', accion: 'crear' },
      { rolId: rolesCreados['vendedor'].id, modulo: 'clientes', accion: 'leer' },
      { rolId: rolesCreados['vendedor'].id, modulo: 'ventas', accion: 'crear' },
      { rolId: rolesCreados['vendedor'].id, modulo: 'ventas', accion: 'leer' },

      // Cajero - PDV y caja
      { rolId: rolesCreados['cajero'].id, modulo: 'productos', accion: 'leer' },
      { rolId: rolesCreados['cajero'].id, modulo: 'ventas', accion: 'crear' },
      { rolId: rolesCreados['cajero'].id, modulo: 'turnos', accion: 'crear' },
      { rolId: rolesCreados['cajero'].id, modulo: 'turnos', accion: 'actualizar' },

      // Almacenista - Inventario
      { rolId: rolesCreados['almacenista'].id, modulo: 'productos', accion: 'leer' },
      { rolId: rolesCreados['almacenista'].id, modulo: 'inventario', accion: 'leer' },
      { rolId: rolesCreados['almacenista'].id, modulo: 'inventario', accion: 'actualizar' },
      { rolId: rolesCreados['almacenista'].id, modulo: 'transferencias', accion: 'crear' },
      { rolId: rolesCreados['almacenista'].id, modulo: 'transferencias', accion: 'leer' },
    ];

    for (const permiso of permisosData) {
      await db.insert(permisos).values(permiso);
    }

    console.log('✅ Permisos creados');

    // 5. Crear usuario administrador de demo
    console.log('👤 Creando usuario administrador...');

    const hashedPassword = await bcrypt.hash('demo123', 10);

    await db.insert(usuarios).values({
      empresaId: empresaDemo.id,
      rolId: rolesCreados['admin'].id,
      nombre: 'Administrador',
      email: 'admin@demo.com',
      passwordHash: hashedPassword,
      activo: true,
    });

    console.log('✅ Usuario admin creado');
    console.log('\n🎉 Seed completado exitosamente!\n');
    console.log('📝 Credenciales de acceso:');
    console.log('   Email: admin@demo.com');
    console.log('   Password: demo123');
    console.log('   Empresa: demo.tudominio.com\n');

    return {
      success: true,
      message: 'Database seeded successfully',
      credentials: {
        email: 'admin@demo.com',
        password: 'demo123',
        subdomain: 'demo',
      },
    };
  } catch (error) {
    console.error('❌ Error en seed:', error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Proceso completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error fatal:', error);
      process.exit(1);
    });
}
