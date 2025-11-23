import * as XLSX from 'xlsx'
import Papa from 'papaparse'

// Exportar datos a Excel
export function exportToExcel(data: any[], filename: string, sheetName: string = 'Datos') {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

  // Generar archivo
  XLSX.writeFile(workbook, `${filename}.xlsx`)
}

// Exportar datos a CSV
export function exportToCSV(data: any[], filename: string) {
  const csv = Papa.unparse(data)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Importar desde Excel
export async function importFromExcel(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: 'binary' })
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)
        resolve(jsonData)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => reject(new Error('Error leyendo el archivo'))
    reader.readAsBinaryString(file)
  })
}

// Importar desde CSV
export async function importFromCSV(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        resolve(results.data)
      },
      error: (error) => {
        reject(error)
      }
    })
  })
}

// Validar datos importados de productos
export function validateProductData(data: any[]): { valid: any[], errors: any[] } {
  const valid: any[] = []
  const errors: any[] = []

  data.forEach((row, index) => {
    const rowErrors: string[] = []

    // Validaciones básicas
    if (!row.nombre || row.nombre.trim() === '') {
      rowErrors.push('El nombre es requerido')
    }

    if (!row.precioVentaMinorista || isNaN(parseFloat(row.precioVentaMinorista))) {
      rowErrors.push('El precio de venta es requerido y debe ser un número')
    }

    if (row.precioCompra && isNaN(parseFloat(row.precioCompra))) {
      rowErrors.push('El precio de compra debe ser un número')
    }

    if (rowErrors.length > 0) {
      errors.push({
        row: index + 2, // +2 porque Excel empieza en 1 y tiene header
        data: row,
        errors: rowErrors
      })
    } else {
      valid.push({
        ...row,
        precioVentaMinorista: parseFloat(row.precioVentaMinorista),
        precioVentaMayoreo: row.precioVentaMayoreo ? parseFloat(row.precioVentaMayoreo) : undefined,
        precioCompra: row.precioCompra ? parseFloat(row.precioCompra) : undefined,
        stockMinimo: row.stockMinimo ? parseInt(row.stockMinimo) : 0,
        activo: row.activo === 'true' || row.activo === '1' || row.activo === true,
      })
    }
  })

  return { valid, errors }
}

// Validar datos importados de clientes
export function validateClientData(data: any[]): { valid: any[], errors: any[] } {
  const valid: any[] = []
  const errors: any[] = []

  data.forEach((row, index) => {
    const rowErrors: string[] = []

    if (!row.nombre || row.nombre.trim() === '') {
      rowErrors.push('El nombre es requerido')
    }

    if (row.email && !isValidEmail(row.email)) {
      rowErrors.push('El email no es válido')
    }

    if (row.rfc && !isValidRFC(row.rfc)) {
      rowErrors.push('El RFC no es válido')
    }

    if (rowErrors.length > 0) {
      errors.push({
        row: index + 2,
        data: row,
        errors: rowErrors
      })
    } else {
      valid.push(row)
    }
  })

  return { valid, errors }
}

// Generar template de importación de productos
export function generateProductTemplate() {
  const template = [
    {
      nombre: 'Producto Ejemplo',
      descripcion: 'Descripción del producto',
      codigoBarras: '1234567890123',
      sku: 'PROD-001',
      precioVentaMinorista: 100.00,
      precioVentaMayoreo: 90.00,
      precioCompra: 70.00,
      stockMinimo: 10,
      categoriaId: 'uuid-de-categoria',
      activo: true,
    }
  ]

  exportToExcel(template, 'template-productos', 'Productos')
}

// Generar template de importación de clientes
export function generateClientTemplate() {
  const template = [
    {
      nombre: 'Cliente Ejemplo',
      email: 'cliente@ejemplo.com',
      telefono: '5551234567',
      rfc: 'XAXX010101000',
      razonSocial: 'Cliente SA de CV',
      regimenFiscal: '601',
      usoCfdi: 'G03',
      codigoPostal: '01000',
      activo: true,
    }
  ]

  exportToExcel(template, 'template-clientes', 'Clientes')
}

// Helpers
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function isValidRFC(rfc: string): boolean {
  const rfcRegex = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/
  return rfcRegex.test(rfc.toUpperCase())
}

// Exportar reporte completo
export async function exportFullReport(
  ventas: any[],
  productos: any[],
  clientes: any[],
  filename: string
) {
  const workbook = XLSX.utils.book_new()

  // Sheet de ventas
  const ventasSheet = XLSX.utils.json_to_sheet(ventas)
  XLSX.utils.book_append_sheet(workbook, ventasSheet, 'Ventas')

  // Sheet de productos
  const productosSheet = XLSX.utils.json_to_sheet(productos)
  XLSX.utils.book_append_sheet(workbook, productosSheet, 'Productos')

  // Sheet de clientes
  const clientesSheet = XLSX.utils.json_to_sheet(clientes)
  XLSX.utils.book_append_sheet(workbook, clientesSheet, 'Clientes')

  // Generar archivo
  XLSX.writeFile(workbook, `${filename}.xlsx`)
}
