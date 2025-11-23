import { db } from '../src/lib/db/index';
import { empresas, roles, usuarios } from '../src/lib/db/schema/index';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

console.log('👤 Creando usuario administrador...\n');

try {
  // 1. Obtener la empresa demo
  const [empresa] = await db
    .select()
    .from(empresas)
    .where(eq(empresas.subdominio, 'demo'))
    .limit(1);

  if (!empresa) {
    console.error('❌ Error: No se encontró la empresa demo.');
    console.log('💡 Primero ejecuta: bun run db:seed');
    process.exit(1);
  }

  console.log(`✅ Empresa encontrada: ${empresa.nombre}`);

  // 2. Buscar o crear rol de administrador
  let [rolAdmin] = await db
    .select()
    .from(roles)
    .where(eq(roles.empresaId, empresa.id))
    .limit(1);

  if (!rolAdmin) {
    console.log('📝 Creando rol de administrador...');
    [rolAdmin] = await db.insert(roles).values({
      empresaId: empresa.id,
      nombre: 'Administrador',
      descripcion: 'Administrador de empresa',
      esPredefinido: true,
      activo: true,
    }).returning();
    console.log('✅ Rol creado');
  } else {
    console.log(`✅ Rol encontrado: ${rolAdmin.nombre}`);
  }

  // 3. Verificar si ya existe el usuario admin
  const [existingAdmin] = await db
    .select()
    .from(usuarios)
    .where(eq(usuarios.email, 'admin@demo.com'))
    .limit(1);

  if (existingAdmin) {
    console.log('⚠️  El usuario admin@demo.com ya existe.');
    console.log('✅ Puedes hacer login con:');
    console.log('   Email: admin@demo.com');
    console.log('   Password: demo123');
    process.exit(0);
  }

  // 4. Crear usuario administrador
  console.log('📝 Creando usuario administrador...');
  const hashedPassword = await bcrypt.hash('demo123', 10);

  await db.insert(usuarios).values({
    empresaId: empresa.id,
    rolId: rolAdmin.id,
    nombre: 'Administrador',
    email: 'admin@demo.com',
    passwordHash: hashedPassword,
    activo: true,
  });

  console.log('✅ Usuario administrador creado exitosamente!\n');
  console.log('🔑 Credenciales de acceso:');
  console.log('   Email: admin@demo.com');
  console.log('   Password: demo123');
  console.log('\n✨ Ahora puedes hacer login en el sistema!');

  process.exit(0);
} catch (error) {
  console.error('❌ Error creando usuario admin:', error);
  process.exit(1);
}
