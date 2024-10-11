import React, { useState, useEffect } from 'react'
import { ArrowDown, ArrowRight, ArrowUp, ArrowLeft } from 'lucide-react'

interface DiagramaFuerzasProps {
  angulo: number
  fuerzaNormal: number
  fuerzaFriccion: number
  fuerzaGravitacional: number
  direccion: 'izquierda' | 'derecha' | 'equilibrio'
  movimiento: 'sube' | 'baja' | 'estático'
}

const DiagramaFuerzas: React.FC<DiagramaFuerzasProps> = ({
  angulo,
  fuerzaNormal,
  fuerzaFriccion,
  fuerzaGravitacional,
  direccion,
  movimiento,
}) => {
  const escala = 100 / Math.max(fuerzaNormal, fuerzaFriccion, fuerzaGravitacional)
  const [posicion, setPosicion] = useState(50)

  useEffect(() => {
    if (movimiento !== 'estático') {
      const animacion = setInterval(() => {
        setPosicion((prev) => {
          if (movimiento === 'baja') {
            return (prev + 1) % 101
          } else {
            return prev > 0 ? prev - 1 : 100
          }
        })
      }, 50)

      return () => clearInterval(animacion)
    }
  }, [movimiento])

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
          <ArrowUp
            className="absolute text-green-500"
            size={fuerzaNormal * escala}
            style={{
              bottom: `${yPos + 4}%`,
              left: `${xPos}%`,
              transform: `rotate(${angulo}deg)`,
            }}
          />

          {/* Fuerza de Fricción */}
          {direccion === 'derecha' ? (
            <ArrowLeft
              className="absolute text-red-500"
              size={fuerzaFriccion * escala}
              style={{
                bottom: `${yPos}%`,
                left: `${xPos + 4}%`,
                transform: `rotate(${-angulo}deg)`,
              }}
            />
          ) : (
            <ArrowRight
              className="absolute text-red-500"
              size={fuerzaFriccion * escala}
              style={{
                bottom: `${yPos}%`,
                left: `${xPos + 4}%`,
                transform: `rotate(${-angulo}deg)`,
              }}
            />
          )}

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
            <p>Dirección: {direccion}</p>
            <p>Movimiento: {movimiento}</p>
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