import { useState } from 'react'
import CalculadoraForm from './components/CalculadoraForm'
import ResultadosCalculadora from './components/ResultadosCalculadora'
import DiagramaFuerzas from './components/DiagramaFuerzas'

interface Resultados {
  fuerzaNormal: number
  fuerzaFriccion: number
  fuerzaGravitacional: number
  aceleracion: number
}

interface Datos {
  masa: number
  angulo: number
  coeficienteFriccion: number
}

function App() {
  const [resultados, setResultados] = useState<Resultados | null>(null)
  const [datos, setDatos] = useState<Datos | null>(null)

  const calcularFuerzas = (masa: number, angulo: number, coeficienteFriccion: number) => {
    const g = 9.8 // Aceleración debido a la gravedad (m/s^2)
    const anguloRad = (angulo * Math.PI) / 180 // Convertir ángulo a radianes

    const fuerzaGravitacional = masa * g * Math.sin(anguloRad)
    const fuerzaNormal = masa * g * Math.cos(anguloRad)
    const fuerzaFriccion = coeficienteFriccion * fuerzaNormal
    const aceleracion = (fuerzaGravitacional - fuerzaFriccion) / masa

    setResultados({
      fuerzaNormal: parseFloat(fuerzaNormal.toFixed(2)),
      fuerzaFriccion: parseFloat(fuerzaFriccion.toFixed(2)),
      fuerzaGravitacional: parseFloat(fuerzaGravitacional.toFixed(2)),
      aceleracion: parseFloat(aceleracion.toFixed(2)),
    })

    setDatos({ masa, angulo, coeficienteFriccion })
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Calculadora de Fuerzas en Rampas y Planos Inclinados
          </h1>
          <CalculadoraForm onCalcular={calcularFuerzas} />
          {resultados && datos && (
            <div className="mt-8 grid grid-cols-1 gap-6">
              <ResultadosCalculadora resultados={resultados} datos={datos} />
              <DiagramaFuerzas
                angulo={datos.angulo}
                fuerzaNormal={resultados.fuerzaNormal}
                fuerzaFriccion={resultados.fuerzaFriccion}
                fuerzaGravitacional={resultados.fuerzaGravitacional}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App