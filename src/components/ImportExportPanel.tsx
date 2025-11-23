"use client"

import { useState, useRef } from 'react'
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react'
import {
  importFromExcel,
  importFromCSV,
  validateProductData,
  validateClientData,
  generateProductTemplate,
  generateClientTemplate,
  exportToExcel,
  exportToCSV
} from '@/lib/import-export'

interface ImportExportPanelProps {
  type: 'productos' | 'clientes'
  empresaId: string
  onImportComplete?: (data: any[]) => void
}

export function ImportExportPanel({ type, empresaId, onImportComplete }: ImportExportPanelProps) {
  const [importing, setImporting] = useState(false)
  const [validationResults, setValidationResults] = useState<{ valid: any[], errors: any[] } | null>(null)
  const [step, setStep] = useState<'select' | 'validate' | 'complete'>('select')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImporting(true)
    setStep('validate')

    try {
      // Importar archivo
      let data: any[]
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        data = await importFromExcel(file)
      } else if (file.name.endsWith('.csv')) {
        data = await importFromCSV(file)
      } else {
        throw new Error('Formato de archivo no soportado')
      }

      // Validar datos según el tipo
      const results = type === 'productos'
        ? validateProductData(data)
        : validateClientData(data)

      setValidationResults(results)
      setImporting(false)
    } catch (error) {
      console.error('Error importando archivo:', error)
      alert('Error al importar el archivo. Por favor verifica el formato.')
      setImporting(false)
      setStep('select')
    }
  }

  const handleImport = async () => {
    if (!validationResults || validationResults.valid.length === 0) return

    setImporting(true)

    try {
      // Aquí iría la llamada a la API para guardar los datos
      // Por ahora solo simulamos
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (onImportComplete) {
        onImportComplete(validationResults.valid)
      }

      setStep('complete')
    } catch (error) {
      console.error('Error guardando datos:', error)
      alert('Error al guardar los datos')
    } finally {
      setImporting(false)
    }
  }

  const handleReset = () => {
    setValidationResults(null)
    setStep('select')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const downloadTemplate = () => {
    if (type === 'productos') {
      generateProductTemplate()
    } else {
      generateClientTemplate()
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <FileSpreadsheet size={20} />
        Importar/Exportar {type === 'productos' ? 'Productos' : 'Clientes'}
      </h3>

      {step === 'select' && (
        <div className="space-y-4">
          {/* Importar */}
          <div>
            <h4 className="font-medium text-slate-900 mb-2">Importar datos</h4>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload size={48} className="text-slate-400 mb-3" />
                <span className="text-sm text-slate-600 mb-2">
                  Arrastra un archivo o haz click para seleccionar
                </span>
                <span className="text-xs text-slate-500">
                  Formatos soportados: Excel (.xlsx, .xls) y CSV (.csv)
                </span>
              </label>
            </div>
          </div>

          {/* Template */}
          <div>
            <h4 className="font-medium text-slate-900 mb-2">Descargar plantilla</h4>
            <button
              onClick={downloadTemplate}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={18} />
              Descargar Plantilla de Ejemplo
            </button>
            <p className="text-xs text-slate-500 mt-2">
              Descarga una plantilla con el formato correcto para importar datos
            </p>
          </div>
        </div>
      )}

      {step === 'validate' && validationResults && (
        <div className="space-y-4">
          {/* Resumen */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-900 mb-1">
                <CheckCircle size={18} />
                <span className="font-semibold">Válidos</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {validationResults.valid.length}
              </div>
              <div className="text-xs text-green-700 mt-1">
                Registros listos para importar
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-900 mb-1">
                <AlertCircle size={18} />
                <span className="font-semibold">Con errores</span>
              </div>
              <div className="text-2xl font-bold text-red-600">
                {validationResults.errors.length}
              </div>
              <div className="text-xs text-red-700 mt-1">
                Registros con problemas
              </div>
            </div>
          </div>

          {/* Errores */}
          {validationResults.errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-h-60 overflow-y-auto">
              <h5 className="font-semibold text-red-900 mb-2">Errores encontrados:</h5>
              <div className="space-y-2">
                {validationResults.errors.slice(0, 10).map((error, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-mono text-red-800">Fila {error.row}:</span>
                    <ul className="list-disc list-inside ml-4 text-red-700">
                      {error.errors.map((err: string, i: number) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              {validationResults.errors.length > 10 && (
                <div className="text-xs text-red-600 mt-2">
                  ... y {validationResults.errors.length - 10} errores más
                </div>
              )}
            </div>
          )}

          {/* Acciones */}
          <div className="flex gap-3">
            {validationResults.valid.length > 0 && (
              <button
                onClick={handleImport}
                disabled={importing}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-slate-300 transition-colors"
              >
                {importing ? 'Importando...' : `Importar ${validationResults.valid.length} registros`}
              </button>
            )}
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {step === 'complete' && (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">✅</div>
          <h4 className="text-xl font-semibold text-slate-900 mb-2">
            Importación completada
          </h4>
          <p className="text-slate-600 mb-6">
            Se han importado {validationResults?.valid.length} registros exitosamente
          </p>
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            Importar más datos
          </button>
        </div>
      )}
    </div>
  )
}
