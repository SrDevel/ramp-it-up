import React, { useState } from 'react'

interface CalculadoraFormProps {
  onCalcular: (masa: number, angulo: number, coeficienteFriccion: number, tipoCalculo: 'rampa' | 'suspendido' | 'estatico') => void
}

const CalculadoraForm: React.FC<CalculadoraFormProps> = ({ onCalcular }) => {
  const [masa, setMasa] = useState('')
  const [angulo, setAngulo] = useState('')
  const [coeficienteFriccion, setCoeficienteFriccion] = useState('')
  const [tipoCalculo, setTipoCalculo] = useState<'rampa' | 'suspendido' | 'estatico'>('rampa')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCalcular(parseFloat(masa), parseFloat(angulo), parseFloat(coeficienteFriccion), tipoCalculo)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="tipoCalculo" className="block text-sm font-medium text-gray-700">
          Tipo de cálculo
        </label>
        <select
          id="tipoCalculo"
          value={tipoCalculo}
          onChange={(e) => setTipoCalculo(e.target.value as 'rampa' | 'suspendido' | 'estatico')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="rampa">Rampa</option>
          <option value="suspendido">Objeto Suspendido</option>
          <option value="estatico">Fuerzas Estáticas</option>
        </select>
      </div>
      <div>
        <label htmlFor="masa" className="block text-sm font-medium text-gray-700">
          Masa del objeto (kg)
        </label>
        <input
          type="number"
          id="masa"
          value={masa}
          onChange={(e) => setMasa(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      {tipoCalculo !== 'suspendido' && (
        <div>
          <label htmlFor="angulo" className="block text-sm font-medium text-gray-700">
            Ángulo de inclinación (grados)
          </label>
          <input
            type="number"
            id="angulo"
            value={angulo}
            onChange={(e) => setAngulo(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      )}
      {tipoCalculo === 'rampa' && (
        <div>
          <label htmlFor="coeficienteFriccion" className="block text-sm font-medium text-gray-700">
            Coeficiente de fricción
          </label>
          <input
            type="number"
            id="coeficienteFriccion"
            value={coeficienteFriccion}
            onChange={(e) => setCoeficienteFriccion(e.target.value)}
            required
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      )}
      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Calcular
        </button>
      </div>
    </form>
  )
}

export default CalculadoraForm