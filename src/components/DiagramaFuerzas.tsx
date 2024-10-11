import React, { useState, useEffect } from 'react'
import { ArrowDown, ArrowRight } from 'lucide-react'

interface DiagramaFuerzasProps {
  angulo: number
  fuerzaNormal: number
  fuerzaFriccion: number
  fuerzaGravitacional: number
  aceleracion: number
}

const DiagramaFuerzas: React.FC<DiagramaFuerzasProps> = ({
  angulo,
  fuerzaNormal,
  fuerzaFriccion,
  fuerzaGravitacional,
  aceleracion,
}) => {
  const escala = 100 / Math.max(fuerzaNormal, fuerzaFriccion, fuerzaGravitacional)
  const [posicion, setPosicion] = useState(50)

  useEffect(() => {
    const animacion = setInterval(() => {
      setPosicion((prev) => {
        const nuevaPosicion = prev + aceleracion / 10
        if (nuevaPosicion > 100 || nuevaPosicion < 0) {
          return 50 // Reinicia la posición si se sale de los límites
        }
        return nuevaPosicion
      })
    }, 50)

    return () => clearInterval(animacion)
  }, [aceleracion])

  const anguloRad = (angulo * Math.PI) / 180
  const xPos = posicion * Math.cos(anguloRad)
  const yPos = posicion * Math.sin(anguloRad)

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Diagrama de Fuerzas</h3>
        <div className="relative w-full h-64">
          {/* Plano inclinado */}
          <div
            className="absolute bottom-0 left-0 w-full h-1 bg-gray-400"
            style={{
              transform: `rotate(-${angulo}deg)`,
              transformOrigin: 'bottom left',
            }}
          ></div>

          {/* Objeto */}
          <div
            className="absolute w-8 h-8 bg-blue-500 rounded-full transition-all duration-50 ease-linear"
            style={{
              bottom: `${yPos}%`,
              left: `${xPos}%`,
            }}
          ></div>

          {/* Fuerza Normal */}
          <ArrowDown
            className="absolute text-green-500"
            size={fuerzaNormal * escala}
            style={{
              bottom: `${yPos + 4}%`,
              left: `${xPos}%`,
              transform: `rotate(${90 - angulo}deg)`,
            }}
          />

          {/* Fuerza de Fricción */}
          <ArrowRight
            className="absolute text-red-500"
            size={fuerzaFriccion * escala}
            style={{
              bottom: `${yPos}%`,
              left: `${xPos + 4}%`,
              transform: `rotate(${aceleracion >= 0 ? -angulo : 180 - angulo}deg)`,
            }}
          />

          {/* Fuerza Gravitacional */}
          <ArrowDown
            className="absolute text-purple-500"
            size={fuerzaGravitacional * escala}
            style={{
              bottom: `${yPos + 4}%`,
              left: `${xPos}%`,
            }}
          />

          {/* Datos en el diagrama */}
          <div className="absolute top-0 right-0 bg-white bg-opacity-75 p-2 text-xs">
            <p>Ángulo: {angulo.toFixed(1)}°</p>
            <p>FN: {fuerzaNormal.toFixed(2)} N</p>
            <p>Ff: {fuerzaFriccion.toFixed(2)} N</p>
            <p>Fg: {fuerzaGravitacional.toFixed(2)} N</p>
            <p>a: {aceleracion.toFixed(2)} m/s²</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 mr-2"></div>
            <span>Fuerza Normal</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 mr-2"></div>
            <span>Fuerza de Fricción</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-500 mr-2"></div>
            <span>Fuerza Gravitacional</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DiagramaFuerzas