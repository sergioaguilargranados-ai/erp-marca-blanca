import { db } from '@/lib/db'
import { productos } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

/**
 * Genera un código de barras EAN-13 único
 * Formato: 750 + 9 dígitos aleatorios + dígito verificador
 */
export async function generarCodigoBarras(): Promise<string> {
  let intentos = 0
  const maxIntentos = 10

  while (intentos < maxIntentos) {
    // Generar código base (12 dígitos sin verificador)
    const prefijo = '750' // Prefijo para México
    const numero = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')
    const codigoBase = prefijo + numero

    // Calcular dígito verificador
    const digitoVerificador = calcularDigitoVerificadorEAN13(codigoBase)
    const codigoCompleto = codigoBase + digitoVerificador

    // Verificar que no exista en la base de datos
    const [existente] = await db
      .select()
      .from(productos)
      .where(eq(productos.codigoBarras, codigoCompleto))
      .limit(1)

    if (!existente) {
      return codigoCompleto
    }

    intentos++
  }

  throw new Error('No se pudo generar un código de barras único después de varios intentos')
}

/**
 * Calcula el dígito verificador para un código EAN-13
 */
function calcularDigitoVerificadorEAN13(codigo: string): string {
  if (codigo.length !== 12) {
    throw new Error('El código debe tener 12 dígitos')
  }

  let suma = 0
  for (let i = 0; i < 12; i++) {
    const digito = parseInt(codigo[i])
    // Multiplicar por 1 o 3 alternadamente (empezando con 1)
    suma += digito * (i % 2 === 0 ? 1 : 3)
  }

  const modulo = suma % 10
  const digitoVerificador = modulo === 0 ? 0 : 10 - modulo

  return digitoVerificador.toString()
}

/**
 * Valida un código de barras EAN-13
 */
export function validarCodigoBarrasEAN13(codigo: string): boolean {
  if (codigo.length !== 13) {
    return false
  }

  const codigoBase = codigo.substring(0, 12)
  const digitoVerificadorEsperado = calcularDigitoVerificadorEAN13(codigoBase)
  const digitoVerificadorActual = codigo[12]

  return digitoVerificadorEsperado === digitoVerificadorActual
}
