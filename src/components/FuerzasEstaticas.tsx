import React from 'react';
import { ArrowDown, ArrowUp, ArrowRight } from 'lucide-react';

interface FuerzasEstaticasProps {
  resultados: {
    fuerzaNormal: number;
    fuerzaFriccion: number;
    fuerzaGravitacional: number;
  };
  datos: {
    masa: number;
    angulo: number;
  };
}

const FuerzasEstaticas: React.FC<FuerzasEstaticasProps> = ({
  resultados,
  datos,
}) => {
  const { masa, angulo } = datos;
  const g = 9.8; // Aceleración debido a la gravedad (m/s^2)

  const escala =
    100 /
    Math.max(
      resultados.fuerzaNormal,
      resultados.fuerzaFriccion,
      resultados.fuerzaGravitacional
    );

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Fuerzas Estáticas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
            <h4 className="text-md font-medium text-gray-900 mb-2">
              Resultados
            </h4>
            <dl className="grid grid-cols-1 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Fuerza Normal
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {resultados.fuerzaNormal.toFixed(2)} N
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Fuerza de Fricción Estática
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {resultados.fuerzaFriccion.toFixed(2)} N
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Fuerza Gravitacional
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {resultados.fuerzaGravitacional.toFixed(2)} N
                </dd>
              </div>
            </dl>
          </div>
          <div className="bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
            <h4 className="text-md font-medium text-gray-900 mb-2">Diagrama</h4>
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
                className="absolute w-16 h-16 bg-blue-500 rounded-lg"
                style={{
                  bottom: '20%',
                  left: '40%',
                  transform: `rotate(-${angulo}deg)`,
                }}
              ></div>

              {/* Fuerza Normal */}
              <ArrowUp
                className="absolute text-green-500"
                size={resultados.fuerzaNormal * escala}
                style={{
                  bottom: '30%',
                  left: '45%',
                  transform: `rotate(${angulo}deg)`,
                }}
              />

              {/* Fuerza de Fricción */}
              <ArrowRight
                className="absolute text-red-500"
                size={resultados.fuerzaFriccion * escala}
                style={{
                  bottom: '25%',
                  left: '50%',
                  transform: `rotate(-${angulo}deg)`,
                }}
              />

              {/* Fuerza Gravitacional */}
              <ArrowDown
                className="absolute text-purple-500"
                size={resultados.fuerzaGravitacional * escala}
                style={{
                  bottom: '30%',
                  left: '45%',
                }}
              />

              {/* Etiquetas */}
              <div className="absolute top-1/4 left-3/4 text-sm font-medium text-green-500">
                FN
              </div>
              <div className="absolute bottom-1/4 right-1/4 text-sm font-medium text-red-500">
                Ff
              </div>
              <div className="absolute bottom-1/2 left-1/4 text-sm font-medium text-purple-500">
                Fg
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
          <h4 className="text-md font-medium text-gray-900 mb-2">
            Fórmulas utilizadas:
          </h4>
          <ul className="list-disc list-inside text-sm text-gray-600">
            <li>Fuerza Gravitacional (Fg) = m * g</li>
            <li>Fuerza Normal (FN) = m * g * cos(θ)</li>
            <li>Fuerza de Fricción Estática (Ff) = m * g * sin(θ)</li>
          </ul>
          <p className="mt-2 text-sm text-gray-600">
            Donde: m = {masa} kg, g = 9.8 m/s² (gravedad), θ = {angulo}° (ángulo
            de inclinación)
          </p>
        </div>
      </div>
    </div>
  );
};

export default FuerzasEstaticas;