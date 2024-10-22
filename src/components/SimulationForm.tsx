import React, {useState} from 'react';
import {SimulationData, SimulationType} from '../types';

interface SimulationFormProps {
    onSimulate: (type: SimulationType, data: SimulationData) => void;
}

const SimulationForm: React.FC<SimulationFormProps> = ({onSimulate}) => {
    const [simulationType, setSimulationType] = useState<SimulationType>('inclinedPlane');
    const [simulationData, setSimulationData] = useState<SimulationData>({});
    const [functionType, setFunctionType] = useState('linear');
    const [forces, setForces] = useState<{ magnitude: number; angle: number }[]>([{magnitude: 0, angle: 0}]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setSimulationData(prev => ({...prev, [name]: parseFloat(value)}));
    };

    const handleForceChange = (index: number, field: 'magnitude' | 'angle', value: number) => {
        const newForces = [...forces];
        newForces[index][field] = value;
        setForces(newForces);
    };

    const addForce = () => {
        setForces([...forces, {magnitude: 0, angle: 0}]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const baseData = {...simulationData};

        // Asegurarse de que forces esté incluido para el tipo 'equilibrium'
        if (simulationType === 'equilibrium') {
            baseData.forces = forces.filter(force =>
                // Filtramos fuerzas inválidas o vacías
                !isNaN(force.magnitude) && !isNaN(force.angle) &&
                force.magnitude !== undefined && force.angle !== undefined
            );

            // Verificar que hay al menos una fuerza válida
            if (!baseData.forces.length) {
                alert('Por favor, añade al menos una fuerza con valores válidos');
                return;
            }
        }

        if (simulationType === 'variableForces') {
            baseData.forceFunction = generateForceFunction();
        }

        onSimulate(simulationType, baseData);
    };

    const handleFunctionParameterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setSimulationData(prev => ({
            ...prev,
            functionParameters: {
                ...(prev.functionParameters || {}),
                [name]: parseFloat(value)
            }
        }));
    };

    const generateForceFunction = () => {
        const params = simulationData.functionParameters || {};
        switch (functionType) {
            case 'linear':
                return `${params.slope || 0} * t`;
            case 'quadratic':
                return `${params.a || 0} * t^2 + ${params.b || 0} * t + ${params.c || 0}`;
            case 'sinusoidal':
                return `${params.amplitude || 0} * sin(${params.frequency || 0} * t)`;
            default:
                return '';
        }
    };

    const removeForce = (index: number) => {
        const newForces = forces.filter((_, i) => i !== index);
        setForces(newForces);
    };

    const renderFunctionControls = () => {
        switch (functionType) {
            case 'linear':
                return (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="slope" className="block text-gray-700 text-sm font-bold mb-2">
                                Pendiente (N/s)
                            </label>
                            <input
                                type="range"
                                id="slope"
                                name="slope"
                                min="-100"
                                max="100"
                                step="1"
                                onChange={handleFunctionParameterChange}
                                className="w-full"
                            />
                            <input
                                type="number"
                                value={simulationData.functionParameters?.slope || 0}
                                onChange={handleFunctionParameterChange}
                                name="slope"
                                className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            />
                        </div>
                        <div className="text-gray-600 italic">
                            Función resultante: F(t) = {simulationData.functionParameters?.slope || 0} * t
                        </div>
                    </div>
                );
            case 'quadratic':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Coeficientes (at² + bt + c)
                            </label>
                            {['a', 'b', 'c'].map(param => (
                                <div key={param} className="mb-4">
                                    <label htmlFor={param} className="block text-gray-700 text-sm mb-1">
                                        {param.toUpperCase()}:
                                    </label>
                                    <input
                                        type="range"
                                        id={param}
                                        name={param}
                                        min="-50"
                                        max="50"
                                        step="0.1"
                                        onChange={handleFunctionParameterChange}
                                        className="w-full"
                                    />
                                    <input
                                        type="number"
                                        value={simulationData.functionParameters?.[param] || 0}
                                        onChange={handleFunctionParameterChange}
                                        name={param}
                                        className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'sinusoidal':
                return (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="amplitude" className="block text-gray-700 text-sm font-bold mb-2">
                                Amplitud (N)
                            </label>
                            <input
                                type="range"
                                id="amplitude"
                                name="amplitude"
                                min="0"
                                max="100"
                                step="1"
                                onChange={handleFunctionParameterChange}
                                className="w-full"
                            />
                            <input
                                type="number"
                                value={simulationData.functionParameters?.amplitude || 0}
                                onChange={handleFunctionParameterChange}
                                name="amplitude"
                                className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            />
                        </div>
                        <div>
                            <label htmlFor="frequency" className="block text-gray-700 text-sm font-bold mb-2">
                                Frecuencia (Hz)
                            </label>
                            <input
                                type="range"
                                id="frequency"
                                name="frequency"
                                min="0"
                                max="10"
                                step="0.1"
                                onChange={handleFunctionParameterChange}
                                className="w-full"
                            />
                            <input
                                type="number"
                                value={simulationData.functionParameters?.frequency || 0}
                                onChange={handleFunctionParameterChange}
                                name="frequency"
                                className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div>
                <label htmlFor="simulationType" className="block text-gray-700 text-sm font-bold mb-2">
                    Tipo de Simulación
                </label>
                <select
                    id="simulationType"
                    value={simulationType}
                    onChange={(e) => setSimulationType(e.target.value as SimulationType)}
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option value="inclinedPlane">Plano Inclinado</option>
                    <option value="freeFall">Caída Libre</option>
                    <option value="variableForces">Fuerzas Variables</option>
                    <option value="equilibrium">Cuerpos en Equilibrio</option>
                </select>
            </div>

            {simulationType === 'inclinedPlane' && (
                <>
                    <div>
                        <label htmlFor="mass" className="block text-gray-700 text-sm font-bold mb-2">
                            Masa (kg)
                        </label>
                        <input
                            type="number"
                            id="mass"
                            name="mass"
                            onChange={handleInputChange}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label htmlFor="angle" className="block text-gray-700 text-sm font-bold mb-2">
                            Ángulo (grados)
                        </label>
                        <input
                            type="number"
                            id="angle"
                            name="angle"
                            onChange={handleInputChange}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label htmlFor="frictionCoefficient" className="block text-gray-700 text-sm font-bold mb-2">
                            Coeficiente de Fricción
                        </label>
                        <input
                            type="number"
                            id="frictionCoefficient"
                            name="frictionCoefficient"
                            onChange={handleInputChange}
                            required
                            step="0.01"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                </>
            )}

            {simulationType === 'freeFall' && (
                <>
                    <div>
                        <label htmlFor="mass" className="block text-gray-700 text-sm font-bold mb-2">
                            Masa (kg)
                        </label>
                        <input
                            type="number"
                            id="mass"
                            name="mass"
                            onChange={handleInputChange}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label htmlFor="height" className="block text-gray-700 text-sm font-bold mb-2">
                            Altura (m)
                        </label>
                        <input
                            type="number"
                            id="height"
                            name="height"
                            onChange={handleInputChange}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label htmlFor="airResistance" className="block text-gray-700 text-sm font-bold mb-2">
                            Resistencia del Aire (N)
                        </label>
                        <input
                            type="number"
                            id="airResistance"
                            name="airResistance"
                            onChange={handleInputChange}
                            step="0.01"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                </>
            )}

            {simulationType === 'variableForces' && (
                <>
                    <div>
                        <label htmlFor="mass" className="block text-gray-700 text-sm font-bold mb-2">
                            Masa (kg)
                        </label>
                        <input
                            type="number"
                            id="mass"
                            name="mass"
                            onChange={handleInputChange}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label htmlFor="functionType" className="block text-gray-700 text-sm font-bold mb-2">
                            Tipo de Función
                        </label>
                        <select
                            id="functionType"
                            value={functionType}
                            onChange={(e) => setFunctionType(e.target.value)}
                            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="linear">Lineal (F = mt)</option>
                            <option value="quadratic">Cuadrática (F = at² + bt + c)</option>
                            <option value="sinusoidal">Sinusoidal (F = A·sin(ωt))</option>
                        </select>
                    </div>
                    {renderFunctionControls()}
                    <div>
                        <label htmlFor="timeStart" className="block text-gray-700 text-sm font-bold mb-2">
                            Tiempo Inicial (s)
                        </label>
                        <input
                            type="number"
                            id="timeStart"
                            name="timeStart"
                            onChange={handleInputChange}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label htmlFor="timeEnd" className="block text-gray-700 text-sm font-bold mb-2">
                            Tiempo Final (s)
                        </label>
                        <input
                            type="number"
                            id="timeEnd"
                            name="timeEnd"
                            onChange={handleInputChange}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label htmlFor="timeStep" className="block text-gray-700 text-sm font-bold mb-2">
                            Intervalo de Tiempo (s)
                        </label>
                        <input
                            type="number"
                            id="timeStep"
                            name="timeStep"
                            onChange={handleInputChange}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                </>
            )}

            {simulationType === 'equilibrium' && (
                <div>
                    <h3 className="font-bold text-lg mb-4">Fuerzas en Equilibrio</h3>
                    {forces.length === 0 && (
                        <div className="text-red-600 mb-4">Añade al menos una fuerza</div>
                    )}
                    {forces.map((force, index) => (
                        <div key={index} className="flex items-center space-x-2 mb-4">
                            <div className="flex-1">
                                <label className="block text-gray-700 text-sm mb-1">
                                    Magnitud (N)
                                </label>
                                <input
                                    type="number"
                                    value={force.magnitude}
                                    onChange={(e) => handleForceChange(index, 'magnitude', parseFloat(e.target.value))}
                                    className="border rounded w-full py-2 px-3"
                                    required
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-gray-700 text-sm mb-1">
                                    Ángulo (°)
                                </label>
                                <input
                                    type="number"
                                    value={force.angle}
                                    onChange={(e) => handleForceChange(index, 'angle', parseFloat(e.target.value))}
                                    className="border rounded w-full py-2 px-3"
                                    required
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => removeForce(index)}
                                className="mt-6 text-red-600 hover:text-red-800 font-bold"
                            >
                                Eliminar
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addForce}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Añadir Fuerza
                    </button>
                </div>
            )}

            <div>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Simular
                </button>
            </div>
        </form>
    );
};

export default SimulationForm;