import { useState } from 'react'
import CalculadoraForm from './components/CalculadoraForm'
import ResultadosCalculadora from './components/ResultadosCalculadora'
import DiagramaFuerzas from './components/DiagramaFuerzas'
import CalculadoraSuspendida from './components/CalculadoraSuspendida'
import FuerzasEstaticas from './components/FuerzasEstaticas'

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
  tipoCalculo: 'rampa' | 'suspendido' | 'estatico'
  problemaFisico: string
}

function App() {
  const [resultados, setResultados] = useState<Resultados | null>(null)
  const [datos, setDatos] = useState<Datos | null>(null)

  const calcularFuerzas = (masa: number, angulo: number, coeficienteFriccion: number, tipoCalculo: 'rampa' | 'suspendido' | 'estatico', problemaFisico: string) => {
    // Aquí iría la lógica para procesar el problema físico con IA
    // Por ahora, usaremos los valores ingresados directamente

    const g = 9.8 // Aceleración debido a la gravedad (m/s^2)
    const anguloRad = (angulo * Math.PI) / 180 // Convertir ángulo a radianes

    let fuerzaGravitacional, fuerzaNormal, fuerzaFriccion, aceleracion

    if (tipoCalculo === 'rampa') {
      fuerzaGravitacional = masa * g * Math.sin(anguloRad)
      fuerzaNormal = masa * g * Math.cos(anguloRad)
      fuerzaFriccion = coeficienteFriccion * fuerzaNormal
      aceleracion = (fuerzaGravitacional - fuerzaFriccion) / masa
    } else if (tipoCalculo === 'suspendido') {
      fuerzaGravitacional = masa * g
      fuerzaNormal = 0
      fuerzaFriccion = 0
      aceleracion = g
    } else {
      // Cálculos para fuerzas estáticas
      fuerzaGravitacional = masa * g
      fuerzaNormal = fuerzaGravitacional * Math.cos(anguloRad)
      fuerzaFriccion = fuerzaGravitacional * Math.sin(anguloRad)
      aceleracion = 0
    }

    setResultados({
      fuerzaNormal: parseFloat(fuerzaNormal.toFixed(2)),
      fuerzaFriccion: parseFloat(fuerzaFriccion.toFixed(2)),
      fuerzaGravitacional: parseFloat(fuerzaGravitacional.toFixed(2)),
      aceleracion: parseFloat(aceleracion.toFixed(2)),
    })

    setDatos({ masa, angulo, coeficienteFriccion, tipoCalculo, problemaFisico })
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Calculadora Avanzada de Fuerzas
          </h1>
          <CalculadoraForm onCalcular={calcularFuerzas} />
          {resultados && datos && (
            <div className="mt-8 grid grid-cols-1 gap-6">
              {datos.tipoCalculo === 'rampa' && (
                <>
                  <ResultadosCalculadora resultados={resultados} datos={datos} />
                  <DiagramaFuerzas
                    angulo={datos.angulo}
                    fuerzaNormal={resultados.fuerzaNormal}
                    fuerzaFriccion={resultados.fuerzaFriccion}
                    fuerzaGravitacional={resultados.fuerzaGravitacional}
                    aceleracion={resultados.aceleracion}
                  />
                </>
              )}
              {datos.tipoCalculo === 'suspendido' && (
                <CalculadoraSuspendida resultados={resultados} datos={datos} />
              )}
              {datos.tipoCalculo === 'estatico' && (
                <FuerzasEstaticas resultados={resultados} datos={datos} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App