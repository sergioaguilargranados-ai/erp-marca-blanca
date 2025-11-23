import { db } from './index';
import { eq } from "drizzle-orm";
import {
  empresas,
  sucursales,
  categorias,
  productos,
  clientes,
  proveedores,
  empleados,
  inventario,
  ventas,
  detallesVenta,
  turnos,
  cajas
} from './schema';

export async function seedDemoData() {

  try {
    // 1. Obtener la empresa demo
    const [empresa] = await db
      .select()
      .from(empresas)
      .where(eq(empresas.nombre, 'Empresa Demo'))
      .limit(1);

    if (!empresa) {
      console.error('❌ Error: Primero debes ejecutar el seed básico (bun run db:seed)');
      return;
    }

    console.log(`✅ Empresa encontrada: ${empresa.nombre}\n`);

    // 2. Crear Sucursales
    console.log('🏢 Creando sucursales...');

    const sucursalesData = [
      {
        empresaId: empresa.id,
        nombre: 'Sucursal Centro',
        codigo: 'CENTRO',
        direccion: 'Av. Juárez 123, Centro Histórico',
        ciudad: 'Ciudad de México',
        estado: 'CDMX',
        codigoPostal: '06000',
        telefono: '55-1234-5678',
        email: 'centro@demo.com',
        activa: true,
        esMatriz: true,
      },
      {
        empresaId: empresa.id,
        nombre: 'Sucursal Norte',
        codigo: 'NORTE',
        direccion: 'Av. Insurgentes Norte 456',
        ciudad: 'Ciudad de México',
        estado: 'CDMX',
        codigoPostal: '07000',
        telefono: '55-2345-6789',
        email: 'norte@demo.com',
        activa: true,
        esMatriz: false,
      },
      {
        empresaId: empresa.id,
        nombre: 'Sucursal Sur',
        codigo: 'SUR',
        direccion: 'Calz. Tlalpan 789',
        ciudad: 'Ciudad de México',
        estado: 'CDMX',
        codigoPostal: '04000',
        telefono: '55-3456-7890',
        email: 'sur@demo.com',
        activa: true,
        esMatriz: false,
      },
    ];

    const sucursalesCreadas = [];
    for (const suc of sucursalesData) {
      const [created] = await db.insert(sucursales).values(suc).returning();
      sucursalesCreadas.push(created);
    }
    console.log(`✅ ${sucursalesCreadas.length} sucursales creadas\n`);

    // 3. Crear Categorías
    console.log('📁 Creando categorías...');

    const categoriasData = [
      { empresaId: empresa.id, nombre: 'Electrónica', descripcion: 'Productos electrónicos', activa: true },
      { empresaId: empresa.id, nombre: 'Computadoras', descripcion: 'Laptops y PCs', activa: true },
      { empresaId: empresa.id, nombre: 'Accesorios', descripcion: 'Accesorios diversos', activa: true },
      { empresaId: empresa.id, nombre: 'Audio', descripcion: 'Audífonos y bocinas', activa: true },
      { empresaId: empresa.id, nombre: 'Oficina', descripcion: 'Artículos de oficina', activa: true },
      { empresaId: empresa.id, nombre: 'Redes', descripcion: 'Equipos de red', activa: true },
    ];

    const categoriasCreadas = [];
    for (const cat of categoriasData) {
      const [created] = await db.insert(categorias).values(cat).returning();
      categoriasCreadas.push(created);
    }
    console.log(`✅ ${categoriasCreadas.length} categorías creadas\n`);

    // 4. Crear Productos
    console.log('📦 Creando productos...');

    const productosData = [
      // Computadoras
      {
        empresaId: empresa.id,
        categoriaId: categoriasCreadas[1].id,
        nombre: 'Laptop HP 15-dw3000',
        descripcion: 'Laptop HP Intel Core i5, 8GB RAM, 512GB SSD',
        sku: 'LAP-HP-001',
        codigoBarras: '7501234567890',
        precioCompra: '8500.00',
        precioVentaMinorista: '12999.00',
        precioVentaMayoreo: '11500.00',
        unidadMedida: 'Pieza',
        activo: true,
      },
      {
        empresaId: empresa.id,
        categoriaId: categoriasCreadas[1].id,
        nombre: 'Laptop Dell Inspiron 15',
        descripcion: 'Laptop Dell Intel Core i7, 16GB RAM, 1TB SSD',
        sku: 'LAP-DELL-001',
        codigoBarras: '7501234567891',
        precioCompra: '12000.00',
        precioVentaMinorista: '18999.00',
        precioVentaMayoreo: '17000.00',
        unidadMedida: 'Pieza',
        activo: true,
      },
      // Electrónica
      {
        empresaId: empresa.id,
        categoriaId: categoriasCreadas[0].id,
        nombre: 'Mouse Logitech MX Master 3',
        descripcion: 'Mouse inalámbrico ergonómico',
        sku: 'MOU-LOG-001',
        codigoBarras: '7501234567892',
        precioCompra: '750.00',
        precioVentaMinorista: '1299.00',
        precioVentaMayoreo: '1100.00',
        unidadMedida: 'Pieza',
        activo: true,
      },
      {
        empresaId: empresa.id,
        categoriaId: categoriasCreadas[0].id,
        nombre: 'Teclado Mecánico Corsair K95',
        descripcion: 'Teclado mecánico RGB',
        sku: 'TEC-COR-001',
        codigoBarras: '7501234567893',
        precioCompra: '1200.00',
        precioVentaMinorista: '2499.00',
        precioVentaMayoreo: '2100.00',
        unidadMedida: 'Pieza',
        activo: true,
      },
      // Audio
      {
        empresaId: empresa.id,
        categoriaId: categoriasCreadas[3].id,
        nombre: 'Audífonos Sony WH-1000XM5',
        descripcion: 'Audífonos noise cancelling',
        sku: 'AUD-SON-001',
        codigoBarras: '7501234567894',
        precioCompra: '3500.00',
        precioVentaMinorista: '5999.00',
        precioVentaMayoreo: '5200.00',
        unidadMedida: 'Pieza',
        activo: true,
      },
      {
        empresaId: empresa.id,
        categoriaId: categoriasCreadas[3].id,
        nombre: 'Bocina JBL Flip 6',
        descripcion: 'Bocina Bluetooth portátil',
        sku: 'BOC-JBL-001',
        codigoBarras: '7501234567895',
        precioCompra: '1100.00',
        precioVentaMinorista: '1899.00',
        precioVentaMayoreo: '1600.00',
        unidadMedida: 'Pieza',
        activo: true,
      },
      // Accesorios
      {
        empresaId: empresa.id,
        categoriaId: categoriasCreadas[2].id,
        nombre: 'Hub USB-C 7 en 1',
        descripcion: 'Adaptador multipuertos USB-C',
        sku: 'ACC-HUB-001',
        codigoBarras: '7501234567896',
        precioCompra: '350.00',
        precioVentaMinorista: '699.00',
        precioVentaMayoreo: '600.00',
        unidadMedida: 'Pieza',
        activo: true,
      },
      {
        empresaId: empresa.id,
        categoriaId: categoriasCreadas[2].id,
        nombre: 'Cable HDMI 2m',
        descripcion: 'Cable HDMI 4K',
        sku: 'CAB-HDMI-001',
        codigoBarras: '7501234567897',
        precioCompra: '80.00',
        precioVentaMinorista: '149.00',
        precioVentaMayoreo: '120.00',
        unidadMedida: 'Pieza',
        activo: true,
      },
      // Oficina
      {
        empresaId: empresa.id,
        categoriaId: categoriasCreadas[4].id,
        nombre: 'Silla Ergonómica',
        descripcion: 'Silla de oficina ergonómica',
        sku: 'OFF-SIL-001',
        codigoBarras: '7501234567898',
        precioCompra: '1500.00',
        precioVentaMinorista: '2999.00',
        precioVentaMayoreo: '2500.00',
        unidadMedida: 'Pieza',
        activo: true,
      },
      {
        empresaId: empresa.id,
        categoriaId: categoriasCreadas[4].id,
        nombre: 'Escritorio Ajustable',
        descripcion: 'Escritorio altura ajustable',
        sku: 'OFF-ESC-001',
        codigoBarras: '7501234567899',
        precioCompra: '3000.00',
        precioVentaMinorista: '5999.00',
        precioVentaMayoreo: '5200.00',
        unidadMedida: 'Pieza',
        activo: true,
      },
      // Redes
      {
        empresaId: empresa.id,
        categoriaId: categoriasCreadas[5].id,
        nombre: 'Router TP-Link AX3000',
        descripcion: 'Router WiFi 6',
        sku: 'RED-ROU-001',
        codigoBarras: '7501234567900',
        precioCompra: '800.00',
        precioVentaMinorista: '1499.00',
        precioVentaMayoreo: '1300.00',
        unidadMedida: 'Pieza',
        activo: true,
      },
      {
        empresaId: empresa.id,
        categoriaId: categoriasCreadas[5].id,
        nombre: 'Switch 8 puertos Gigabit',
        descripcion: 'Switch de red 8 puertos',
        sku: 'RED-SWI-001',
        codigoBarras: '7501234567901',
        precioCompra: '450.00',
        precioVentaMinorista: '899.00',
        precioVentaMayoreo: '750.00',
        unidadMedida: 'Pieza',
        activo: true,
      },
    ];

    const productosCreados = [];
    for (const prod of productosData) {
      const [created] = await db.insert(productos).values(prod).returning();
      productosCreados.push(created);
    }
    console.log(`✅ ${productosCreados.length} productos creados\n`);

    // 5. Crear Inventario en cada sucursal
    console.log('📊 Creando inventario...');

    let inventarioCount = 0;
    for (const sucursal of sucursalesCreadas) {
      for (const producto of productosCreados) {
        const stockAleatorio = Math.floor(Math.random() * 50) + 10; // Entre 10 y 60
        const stockMinimo = Math.floor(stockAleatorio * 0.3); // 30% del stock actual

        await db.insert(inventario).values({
          sucursalId: sucursal.id,
          productoId: producto.id,
          stock: stockAleatorio.toString(),
          stockMinimo: stockMinimo.toString(),
          stockMaximo: (stockAleatorio * 2).toString(),
        });
        inventarioCount++;
      }
    }
    console.log(`✅ ${inventarioCount} registros de inventario creados\n`);

    // 6. Crear Clientes
    console.log('👥 Creando clientes...');

    const clientesData = [
      {
        empresaId: empresa.id,
        nombre: 'Juan Pérez García',
        email: 'juan.perez@email.com',
        telefono: '55-1111-2222',
        rfc: 'PEGJ850123ABC',
        tipo: 'fisica' as const,
        direccion: 'Calle Reforma 100',
        ciudad: 'Ciudad de México',
        estado: 'CDMX',
        codigoPostal: '01000',
        activo: true,
      },
      {
        empresaId: empresa.id,
        nombre: 'María López Hernández',
        email: 'maria.lopez@email.com',
        telefono: '55-2222-3333',
        rfc: 'LOHM900215XYZ',
        tipo: 'fisica' as const,
        direccion: 'Av. Insurgentes 200',
        ciudad: 'Ciudad de México',
        estado: 'CDMX',
        codigoPostal: '03100',
        activo: true,
      },
      {
        empresaId: empresa.id,
        nombre: 'Tecnología Avanzada SA de CV',
        razonSocial: 'Tecnología Avanzada SA de CV',
        email: 'ventas@tecnologia.com',
        telefono: '55-3333-4444',
        rfc: 'TAV120301ABC',
        tipo: 'moral' as const,
        direccion: 'Blvd. Manuel Ávila Camacho 300',
        ciudad: 'Naucalpan',
        estado: 'Estado de México',
        codigoPostal: '53370',
        activo: true,
      },
      {
        empresaId: empresa.id,
        nombre: 'Carlos Ramírez Torres',
        email: 'carlos.ramirez@email.com',
        telefono: '55-4444-5555',
        rfc: 'RATC950510DEF',
        tipo: 'fisica' as const,
        direccion: 'Paseo de la Reforma 400',
        ciudad: 'Ciudad de México',
        estado: 'CDMX',
        codigoPostal: '06600',
        activo: true,
      },
      {
        empresaId: empresa.id,
        nombre: 'Distribuidora del Centro SAdeCV',
        razonSocial: 'Distribuidora del Centro SA de CV',
        email: 'compras@distribuidora.com',
        telefono: '55-5555-6666',
        rfc: 'DCE150601GHI',
        tipo: 'moral' as const,
        direccion: 'Eje Central 500',
        ciudad: 'Ciudad de México',
        estado: 'CDMX',
        codigoPostal: '06000',
        activo: true,
      },
      {
        empresaId: empresa.id,
        nombre: 'Ana Martínez Silva',
        email: 'ana.martinez@email.com',
        telefono: '55-6666-7777',
        rfc: 'MASA880825JKL',
        tipo: 'fisica' as const,
        direccion: 'Av. Chapultepec 600',
        ciudad: 'Ciudad de México',
        estado: 'CDMX',
        codigoPostal: '11000',
        activo: true,
      },
    ];

    const clientesCreados = [];
    for (const cliente of clientesData) {
      const [created] = await db.insert(clientes).values(cliente).returning();
      clientesCreados.push(created);
    }
    console.log(`✅ ${clientesCreados.length} clientes creados\n`);

    // 7. Crear Proveedores
    console.log('🏭 Creando proveedores...');

    const proveedoresData = [
      {
        empresaId: empresa.id,
        nombre: 'HP Inc México',
        razonSocial: 'Hewlett Packard México SA de CV',
        rfc: 'HPM990101ABC',
        email: 'ventas@hp.com.mx',
        telefono: '55-7777-8888',
        direccion: 'Santa Fe',
        ciudad: 'Ciudad de México',
        estado: 'CDMX',
        codigoPostal: '05348',
        activo: true,
      },
      {
        empresaId: empresa.id,
        nombre: 'Dell Technologies México',
        razonSocial: 'Dell México SA de CV',
        rfc: 'DMX000202DEF',
        email: 'ventas@dell.com.mx',
        telefono: '55-8888-9999',
        direccion: 'Periferico Sur',
        ciudad: 'Ciudad de México',
        estado: 'CDMX',
        codigoPostal: '14000',
        activo: true,
      },
      {
        empresaId: empresa.id,
        nombre: 'Logitech México',
        razonSocial: 'Logitech Latin America SA de CV',
        rfc: 'LLA010303GHI',
        email: 'mexico@logitech.com',
        telefono: '55-9999-0000',
        direccion: 'Interlomas',
        ciudad: 'Huixquilucan',
        estado: 'Estado de México',
        codigoPostal: '52760',
        activo: true,
      },
    ];

    const proveedoresCreados = [];
    for (const prov of proveedoresData) {
      const [created] = await db.insert(proveedores).values(prov).returning();
      proveedoresCreados.push(created);
    }
    console.log(`✅ ${proveedoresCreados.length} proveedores creados\n`);

    // 8. Crear Cajas
    console.log('💰 Creando cajas...');

    let cajasCount = 0;
    for (const sucursal of sucursalesCreadas) {
      const numCajas = sucursal.esMatriz ? 3 : 2;
      for (let i = 1; i <= numCajas; i++) {
        await db.insert(cajas).values({
          sucursalId: sucursal.id,
          nombre: `Caja ${i}`,
          codigo: `${sucursal.codigo}-CAJ${i}`,
          activa: true,
        });
        cajasCount++;
      }
    }
    console.log(`✅ ${cajasCount} cajas creadas\n`);

    // 9. Crear Ventas de ejemplo (últimos 30 días)
    console.log('💳 Creando ventas de ejemplo...');

    // Métodos de pago como strings (según schema)
    const metodosPago = ['efectivo', 'tarjeta', 'transferencia'];

    // Crear ventas aleatorias de los últimos 30 días
    let ventasCount = 0;
    const hoy = new Date();

    for (let dia = 0; dia < 30; dia++) {
      const ventasDia = Math.floor(Math.random() * 3) + 2; // 2-4 ventas por día

      for (let v = 0; v < ventasDia; v++) {
        const fechaVenta = new Date(hoy);
        fechaVenta.setDate(hoy.getDate() - dia);
        fechaVenta.setHours(Math.floor(Math.random() * 12) + 9); // Entre 9am y 9pm

        const sucursalAleatoria = sucursalesCreadas[Math.floor(Math.random() * sucursalesCreadas.length)];
        const clienteAleatorio = clientesCreados[Math.floor(Math.random() * clientesCreados.length)];
        const metodoPagoAleatorio = metodosPago[Math.floor(Math.random() * metodosPago.length)];

        // Seleccionar productos aleatorios
        const numProductos = Math.floor(Math.random() * 3) + 1; // 1-3 productos
        const productosVenta = [];
        let subtotal = 0;

        for (let p = 0; p < numProductos; p++) {
          const productoAleatorio = productosCreados[Math.floor(Math.random() * productosCreados.length)];
          const cantidad = Math.floor(Math.random() * 3) + 1; // 1-3 unidades
          const precioUnitario = parseFloat(productoAleatorio.precioVentaMinorista);
          const totalProducto = precioUnitario * cantidad;

          productosVenta.push({
            producto: productoAleatorio,
            cantidad,
            precioUnitario,
            total: totalProducto,
          });

          subtotal += totalProducto;
        }

        const iva = subtotal * 0.16;
        const total = subtotal + iva;

        // Crear venta
        const [venta] = await db.insert(ventas).values({
          empresaId: empresa.id,
          sucursalId: sucursalAleatoria.id,
          clienteId: clienteAleatorio.id,
          metodoPago: metodoPagoAleatorio,
          folio: `V${String(ventasCount + 1).padStart(6, '0')}`,
          subtotal: subtotal.toFixed(2),
          iva: iva.toFixed(2),
          total: total.toFixed(2),
          estado: 'completada',
          createdAt: fechaVenta,
        }).returning();

        // Crear detalles de venta
        for (const item of productosVenta) {
          await db.insert(detallesVenta).values({
            ventaId: venta.id,
            productoId: item.producto.id,
            cantidad: item.cantidad.toString(),
            precioUnitario: item.precioUnitario.toFixed(2),
            subtotal: item.total.toFixed(2),
          });
        }

        ventasCount++;
      }
    }

    console.log(`✅ ${ventasCount} ventas creadas con detalles\n`);

    console.log('🎉 ¡Seed de datos demo completado exitosamente!\n');
    console.log('📊 Resumen:');
    console.log(`   - ${sucursalesCreadas.length} sucursales`);
    console.log(`   - ${categoriasCreadas.length} categorías`);
    console.log(`   - ${productosCreados.length} productos`);
    console.log(`   - ${inventarioCount} registros de inventario`);
    console.log(`   - ${clientesCreados.length} clientes`);
    console.log(`   - ${proveedoresCreados.length} proveedores`);
    console.log(`   - ${ventasCount} ventas con detalles`);
    console.log('\n✨ El sistema está listo para demostración!\n');

    return {
      success: true,
      message: 'Demo data seeded successfully',
      stats: {
        sucursales: sucursalesCreadas.length,
        categorias: categoriasCreadas.length,
        productos: productosCreados.length,
        inventario: inventarioCount,
        clientes: clientesCreados.length,
        proveedores: proveedoresCreados.length,
        ventas: ventasCount,
      },
    };
  } catch (error) {
    console.error('❌ Error en seed demo:', error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedDemoData()
    .then(() => {
      console.log('✅ Proceso completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error fatal:', error);
      process.exit(1);
    });
}
