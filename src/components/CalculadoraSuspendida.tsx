import React from 'react'
import { ArrowDown } from 'lucide-react'

interface CalculadoraSuspendidaProps {
  resultados: {
    fuerzaGravitacional: number
  }
  datos: {
    masa: number
  }
}

const CalculadoraSuspendida: React.FC<CalculadoraSuspendidaProps> = ({ resultados, datos }) => {
  const { masa } = datos
  const g = 9.8 // Aceleración debido a la gravedad (m/s^2)

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Objeto Suspendido</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
            <h4 className="text-md font-medium text-gray-900 mb-2">Resultados</h4>
            <dl className="grid grid-cols-1 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Fuerza Gravitacional</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{resultados.fuerzaGravitacional} N</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Tensión de la Cuerda</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{resultados.fuerzaGravitacional} N</dd>
              </div>
            </dl>
          </div>
          <div className="bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
            <h4 className="text-md font-medium text-gray-900 mb-2">Diagrama</h4>
            <div className="relative w-full h-64">
              {/* Cuerda */}
              <div className="absolute top-0 left-1/2 w-1 h-32 bg-gray-400"></div>
              
              {/* Objeto */}
              <div className="absolute top-32 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-blue-500 rounded-full"></div>
              
              {/* Fuerza Gravitacional */}
              <ArrowDown
                className="absolute text-purple-500"
                size={50}
                style={{
                  top: '60%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}
              />
              
              {/* Etiquetas */}
              <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-medium">
                Tensión
              </div>
              <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 translate-y-1/2 text-sm font-medium">
                Peso
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
          <h4 className="text-md font-medium text-gray-900 mb-2">Fórmulas utilizadas:</h4>
          <ul className="list-disc list-inside text-sm text-gray-600">
            <li>Fuerza Gravitacional (Peso) = m * g</li>
            <li>Tensión de la Cuerda = Fuerza Gravitacional</li>
          </ul>
          <p className="mt-2 text-sm text-gray-600">Donde: m = {masa} kg, g = 9.8 m/s² (gravedad)</p>
        </div>
      </div>
    </div>
  )
}

export default CalculadoraSuspendida