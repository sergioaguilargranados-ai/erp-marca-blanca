// Utilidades para generación de reportes
// Para Excel: usar 'xlsx' (ya instalado)
// Para PDF: agregar 'jspdf' y 'jspdf-autotable'

import * as XLSX from 'xlsx';

// Tipos de reportes
export type TipoReporte =
  | 'ventas'
  | 'inventario'
  | 'facturacion'
  | 'rentabilidad'
  | 'clientes'
  | 'proveedores'
  | 'cuentas-cobrar'
  | 'cuentas-pagar'
  | 'auditoria';

export interface ConfigReporte {
  tipo: TipoReporte;
  titulo: string;
  fechaInicio?: Date;
  fechaFin?: Date;
  sucursalId?: string;
  formato: 'excel' | 'pdf' | 'csv';
  incluirGraficas?: boolean;
}

export interface DatosReporte {
  encabezados: string[];
  filas: any[][];
  totales?: Record<string, number>;
  graficas?: {
    titulo: string;
    tipo: 'bar' | 'line' | 'pie';
    datos: any[];
  }[];
}

// Clase para generar reportes
export class GeneradorReportes {
  // Generar reporte en Excel
  static async generarExcel(config: ConfigReporte, datos: DatosReporte): Promise<Blob> {
    const workbook = XLSX.utils.book_new();

    // Crear hoja principal
    const worksheet = XLSX.utils.aoa_to_sheet([
      [config.titulo],
      [],
      [`Generado: ${new Date().toLocaleString('es-MX')}`],
      [],
      datos.encabezados,
      ...datos.filas,
    ]);

    // Agregar totales si existen
    if (datos.totales) {
      const filaTotales = ['TOTALES'];
      Object.values(datos.totales).forEach(valor => {
        filaTotales.push(valor.toString());
      });
      XLSX.utils.sheet_add_aoa(worksheet, [filaTotales], { origin: -1 });
    }

    // Aplicar estilos (ancho de columnas)
    const maxWidth = datos.encabezados.map((header, i) => {
      const maxLength = Math.max(
        header.length,
        ...datos.filas.map(row => String(row[i] || '').length)
      );
      return { wch: Math.min(maxLength + 2, 50) };
    });
    worksheet['!cols'] = maxWidth;

    // Agregar hoja al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte');

    // Generar archivo
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    return new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
  }

  // Generar reporte en CSV
  static async generarCSV(config: ConfigReporte, datos: DatosReporte): Promise<Blob> {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([
      datos.encabezados,
      ...datos.filas,
    ]);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte');

    const csvBuffer = XLSX.write(workbook, { bookType: 'csv', type: 'string' });
    return new Blob([csvBuffer], { type: 'text/csv;charset=utf-8;' });
  }

  // Generar reporte en PDF (simulado - requiere jspdf)
  static async generarPDF(config: ConfigReporte, datos: DatosReporte): Promise<Blob> {
    // Implementación real requeriría jspdf y jspdf-autotable
    // import jsPDF from 'jspdf';
    // import autoTable from 'jspdf-autotable';

    // const doc = new jsPDF();
    // doc.text(config.titulo, 14, 20);
    // autoTable(doc, {
    //   head: [datos.encabezados],
    //   body: datos.filas,
    // });
    // return doc.output('blob');

    // Simulación para desarrollo
    const pdfContent = `
      ${config.titulo}
      Generado: ${new Date().toLocaleString('es-MX')}

      ${datos.encabezados.join(' | ')}
      ${datos.filas.map(fila => fila.join(' | ')).join('\n')}
    `;

    return new Blob([pdfContent], { type: 'application/pdf' });
  }

  // Descargar archivo
  static descargarArchivo(blob: Blob, nombreArchivo: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // Generar y descargar reporte
  static async generarYDescargar(config: ConfigReporte, datos: DatosReporte) {
    let blob: Blob;
    let extension: string;

    switch (config.formato) {
      case 'excel':
        blob = await this.generarExcel(config, datos);
        extension = 'xlsx';
        break;
      case 'csv':
        blob = await this.generarCSV(config, datos);
        extension = 'csv';
        break;
      case 'pdf':
        blob = await this.generarPDF(config, datos);
        extension = 'pdf';
        break;
      default:
        throw new Error('Formato de reporte no soportado');
    }

    const timestamp = new Date().toISOString().split('T')[0];
    const nombreArchivo = `${config.tipo}_${timestamp}.${extension}`;
    this.descargarArchivo(blob, nombreArchivo);
  }
}

// Utilidades para análisis de datos
export class AnalizadorDatos {
  // Calcular totales
  static calcularTotales(datos: any[], campo: string): number {
    return datos.reduce((sum, item) => sum + (Number(item[campo]) || 0), 0);
  }

  // Calcular promedio
  static calcularPromedio(datos: any[], campo: string): number {
    if (datos.length === 0) return 0;
    return this.calcularTotales(datos, campo) / datos.length;
  }

  // Agrupar por campo
  static agruparPor<T>(datos: T[], campo: keyof T): Record<string, T[]> {
    return datos.reduce((grupos, item) => {
      const clave = String(item[campo]);
      if (!grupos[clave]) {
        grupos[clave] = [];
      }
      grupos[clave].push(item);
      return grupos;
    }, {} as Record<string, T[]>);
  }

  // Calcular porcentaje de crecimiento
  static calcularCrecimiento(valorAnterior: number, valorActual: number): number {
    if (valorAnterior === 0) return 0;
    return ((valorActual - valorAnterior) / valorAnterior) * 100;
  }

  // Calcular ranking (top N)
  static obtenerTop<T>(
    datos: T[],
    campo: keyof T,
    limite: number = 10,
    orden: 'asc' | 'desc' = 'desc'
  ): T[] {
    return [...datos]
      .sort((a, b) => {
        const valorA = Number(a[campo]) || 0;
        const valorB = Number(b[campo]) || 0;
        return orden === 'desc' ? valorB - valorA : valorA - valorB;
      })
      .slice(0, limite);
  }

  // Calcular distribución por rangos
  static distribucionPorRangos(
    datos: any[],
    campo: string,
    rangos: { min: number; max: number; label: string }[]
  ): Record<string, number> {
    const distribucion: Record<string, number> = {};

    rangos.forEach(rango => {
      distribucion[rango.label] = datos.filter(item => {
        const valor = Number(item[campo]) || 0;
        return valor >= rango.min && valor < rango.max;
      }).length;
    });

    return distribucion;
  }

  // Calcular tendencia lineal simple
  static calcularTendencia(valores: number[]): 'subiendo' | 'bajando' | 'estable' {
    if (valores.length < 2) return 'estable';

    const primero = valores[0];
    const ultimo = valores[valores.length - 1];
    const diferencia = ultimo - primero;

    if (Math.abs(diferencia) < primero * 0.05) return 'estable';
    return diferencia > 0 ? 'subiendo' : 'bajando';
  }

  // Análisis ABC (Pareto)
  static analisisABC<T>(
    datos: T[],
    campoValor: keyof T
  ): { A: T[]; B: T[]; C: T[] } {
    const ordenados = [...datos].sort((a, b) => {
      const valorA = Number(a[campoValor]) || 0;
      const valorB = Number(b[campoValor]) || 0;
      return valorB - valorA;
    });

    const total = this.calcularTotales(datos as any[], String(campoValor));
    let acumulado = 0;
    const resultado = { A: [] as T[], B: [] as T[], C: [] as T[] };

    ordenados.forEach(item => {
      const valor = Number(item[campoValor]) || 0;
      acumulado += valor;
      const porcentaje = (acumulado / total) * 100;

      if (porcentaje <= 80) {
        resultado.A.push(item);
      } else if (porcentaje <= 95) {
        resultado.B.push(item);
      } else {
        resultado.C.push(item);
      }
    });

    return resultado;
  }
}

// Formateadores de datos
export class FormateadorDatos {
  static formatearMoneda(valor: number, moneda: string = 'MXN'): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: moneda,
    }).format(valor);
  }

  static formatearNumero(valor: number, decimales: number = 2): string {
    return new Intl.NumberFormat('es-MX', {
      minimumFractionDigits: decimales,
      maximumFractionDigits: decimales,
    }).format(valor);
  }

  static formatearPorcentaje(valor: number, decimales: number = 2): string {
    return `${this.formatearNumero(valor, decimales)}%`;
  }

  static formatearFecha(fecha: Date | string): string {
    return new Date(fecha).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
