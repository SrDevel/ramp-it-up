import React from 'react'

interface ResultadosCalculadoraProps {
  resultados: {
    fuerzaNormal: number
    fuerzaFriccion: number
    fuerzaGravitacional: number
    aceleracion: number
    direccion: 'izquierda' | 'derecha' | 'equilibrio'
    movimiento: 'sube' | 'baja' | 'estático'
  }
  datos: {
    masa: number
    angulo: number
    coeficienteFriccion: number
  }
}

const ResultadosCalculadora: React.FC<ResultadosCalculadoraProps> = ({ resultados, datos }) => {
  const { masa, angulo, coeficienteFriccion } = datos
  const g = 9.8 // Aceleración debido a la gravedad (m/s^2)

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Resultados y Cálculos</h3>
        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Fuerza Normal</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{resultados.fuerzaNormal} N</dd>
            <p className="mt-2 text-sm text-gray-600">FN = m * g * cos(θ)</p>
            <p className="text-sm text-gray-600">= {masa} * {g} * cos({angulo}°)</p>
          </div>
          <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Fuerza de Fricción</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{resultados.fuerzaFriccion} N</dd>
            <p className="mt-2 text-sm text-gray-600">Ff = μ * FN</p>
            <p className="text-sm text-gray-600">= {coeficienteFriccion} * {resultados.fuerzaNormal}</p>
          </div>
          <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Componente Gravitacional</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{resultados.fuerzaGravitacional} N</dd>
            <p className="mt-2 text-sm text-gray-600">Fg = m * g * sin(θ)</p>
            <p className="text-sm text-gray-600">= {masa} * {g} * sin({angulo}°)</p>
          </div>
          <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Aceleración</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{resultados.aceleracion} m/s²</dd>
            <p className="mt-2 text-sm text-gray-600">a = (Fg - Ff) / m</p>
            <p className="text-sm text-gray-600">= ({resultados.fuerzaGravitacional} - {resultados.fuerzaFriccion}) / {masa}</p>
          </div>
          <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Dirección del Movimiento</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{resultados.direccion}</dd>
            <p className="mt-2 text-sm text-gray-600">Basado en la aceleración resultante</p>
          </div>
          <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Tipo de Movimiento</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{resultados.movimiento}</dd>
            <p className="mt-2 text-sm text-gray-600">Basado en la relación entre Fg y Ff</p>
          </div>
        </dl>
        <div className="mt-6 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
          <h4 className="text-md font-medium text-gray-900 mb-2">Fórmulas utilizadas:</h4>
          <ul className="list-disc list-inside text-sm text-gray-600">
            <li>Fuerza Normal (FN) = m * g * cos(θ)</li>
            <li>Fuerza de Fricción (Ff) = μ * FN</li>
            <li>Componente Gravitacional (Fg) = m * g * sin(θ)</li>
            <li>Aceleración (a) = (Fg - Ff) / m</li>
            <li>Dirección: basada en el signo de la aceleración</li>
            <li>Movimiento: comparación entre Fg y Ff</li>
          </ul>
          <p className="mt-2 text-sm text-gray-600">Donde: m = masa, g = 9.8 m/s² (gravedad), θ = ángulo de inclinación, μ = coeficiente de fricción</p>
        </div>
      </div>
    </div>
  )
}

export default ResultadosCalculadora