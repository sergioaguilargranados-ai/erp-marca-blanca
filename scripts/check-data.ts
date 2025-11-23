import { db } from '../src/lib/db/index';
import { empresas, planes, usuarios, sucursales, productos, clientes, ventas } from '../src/lib/db/schema/index';
import { count } from 'drizzle-orm';

console.log('📊 Verificando datos existentes en la base de datos...\n');

const stats = {
  planes: await db.select({ count: count() }).from(planes),
  empresas: await db.select({ count: count() }).from(empresas),
  usuarios: await db.select({ count: count() }).from(usuarios),
  sucursales: await db.select({ count: count() }).from(sucursales),
  productos: await db.select({ count: count() }).from(productos),
  clientes: await db.select({ count: count() }).from(clientes),
  ventas: await db.select({ count: count() }).from(ventas),
};

console.log('✅ Planes:', stats.planes[0].count);
console.log('✅ Empresas:', stats.empresas[0].count);
console.log('✅ Usuarios:', stats.usuarios[0].count);
console.log('✅ Sucursales:', stats.sucursales[0].count);
console.log('✅ Productos:', stats.productos[0].count);
console.log('✅ Clientes:', stats.clientes[0].count);
console.log('✅ Ventas:', stats.ventas[0].count);

if (stats.ventas[0].count > 0) {
  console.log('\n🎉 ¡La base de datos ya tiene datos de ejemplo!');
  console.log('✨ Puedes iniciar el servidor y explorar el sistema.');
} else if (stats.sucursales[0].count === 0) {
  console.log('\n⚠️  Datos básicos creados, pero faltan datos de ejemplo.');
  console.log('💡 Ejecuta: bun run db:seed-demo');
} else {
  console.log('\n✅ Base de datos completamente poblada!');
}

// Mostrar usuario admin si existe
const admin = await db.select().from(usuarios).limit(1);
if (admin.length > 0) {
  console.log('\n🔑 Usuario disponible:');
  console.log('   Email:', admin[0].email);
  console.log('   Password: demo123 (si no fue cambiado)');
}

process.exit(0);
