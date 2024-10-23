import React, { useState, useEffect } from 'react';
import { FunctionType, SimulationData, SimulationType } from '../types';
import { SimulationValidator } from '../validators/SimulationValidator.ts';

interface SimulationFormProps {
    onSimulate: (type: SimulationType, data: SimulationData) => void;
}

const SimulationForm: React.FC<SimulationFormProps> = ({ onSimulate }) => {
    const [simulationType, setSimulationType] = useState<SimulationType>('inclinedPlane');
    const [simulationData, setSimulationData] = useState<SimulationData>({});
    const [functionType, setFunctionType] = useState('linear');
    const [forces, setForces] = useState<{ magnitude: number; angle: number }[]>([{ magnitude: 0, angle: 0 }]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        if (Object.keys(touched).length > 0) {
            validateForm();
        }
    }, [simulationData, forces, simulationType, functionType]);

    const validateForm = () => {
        const dataToValidate = {
            ...simulationData,
            forces: simulationType === 'equilibrium' ? forces : undefined,
            functionType: simulationType === 'variableForces' ? (functionType as FunctionType) : undefined,
        };

        const validationErrors = SimulationValidator.validate(simulationType, dataToValidate);
        const errorMap = validationErrors.reduce(
            (acc, error) => ({
                ...acc,
                [error.field]: error.message,
            }),
            {}
        );

        setErrors(errorMap);
        return Object.keys(errorMap).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSimulationData((prev) => ({ ...prev, [name]: parseFloat(value) }));
        setTouched((prev) => ({ ...prev, [name]: true }));
    };

    const handleFunctionParameterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSimulationData((prev) => ({
            ...prev,
            functionParameters: {
                ...(prev.functionParameters || {}),
                [name]: parseFloat(value),
            },
        }));
        setTouched((prev) => ({ ...prev, [`functionParameters.${name}`]: true }));
    };

    const handleBlur = (fieldName: string) => {
        setTouched((prev) => ({ ...prev, [fieldName]: true }));
    };

    const handleForceChange = (index: number, field: 'magnitude' | 'angle', value: number) => {
        const newForces = [...forces];
        newForces[index][field] = value;
        setForces(newForces);
        setTouched((prev) => ({ ...prev, [`forces[${index}].${field}`]: true }));
    };

    const renderError = (fieldName: string) => {
        if (touched[fieldName] && errors[fieldName]) {
            return <p className="text-red-500 text-xs italic mt-1">{errors[fieldName]}</p>;
        }
        return null;
    };

    const renderInput = (name: string, label: string, props = {}) => (
        <div className="mb-4">
            <label htmlFor={name} className="block text-white text-sm font-bold mb-2">
                {label}
            </label>
            <input
                type="number"
                id={name}
                name={name}
                onChange={handleInputChange}
                onBlur={() => handleBlur(name)}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    touched[name] && errors[name] ? 'border-red-500' : ''
                }`}
                {...props}
            />
            {renderError(name)}
        </div>
    );

    const renderFunctionControls = () => {
        switch (functionType) {
            case 'linear':
                return (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="slope" className="block text-white text-sm font-bold mb-2">
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
                                onBlur={() => handleBlur('functionParameters.slope')}
                                name="slope"
                                className={`mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 ${
                                    touched['functionParameters.slope'] && errors['functionParameters.slope'] ? 'border-red-500' : ''
                                }`}
                            />
                            {renderError('functionParameters.slope')}
                        </div>
                        <div className="text-gray-300 italic">
                            Función resultante: F(t) = {simulationData.functionParameters?.slope || 0} * t
                        </div>
                    </div>
                );
            case 'quadratic':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-white text-sm font-bold mb-2">Coeficientes (at² + bt + c)</label>
                            {['a', 'b', 'c'].map((param) => (
                                <div key={param} className="mb-4">
                                    <label htmlFor={param} className="block text-white text-sm mb-1">
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
                                        onBlur={() => handleBlur(`functionParameters.${param}`)}
                                        name={param}
                                        className={`mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 ${
                                            touched[`functionParameters.${param}`] && errors[`functionParameters.${param}`] ? 'border-red-500' : ''
                                        }`}
                                    />
                                    {renderError(`functionParameters.${param}`)}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'sinusoidal':
                return (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="amplitude" className="block text-white text-sm font-bold mb-2">
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
                                onBlur={() => handleBlur('functionParameters.amplitude')}
                                name="amplitude"
                                className={`mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 ${
                                    touched['functionParameters.amplitude'] && errors['functionParameters.amplitude'] ? 'border-red-500' : ''
                                }`}
                            />
                            {renderError('functionParameters.amplitude')}
                        </div>
                        <div>
                            <label htmlFor="frequency" className="block text-white text-sm font-bold mb-2">
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
                                onBlur={() => handleBlur('functionParameters.frequency')}
                                name="frequency"
                                className={`mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 ${
                                    touched['functionParameters.frequency'] && errors['functionParameters.frequency'] ? 'border-red-500' : ''
                                }`}
                            />
                            {renderError('functionParameters.frequency')}
                        </div>
                    </div>
                );
        }
    };

    const handleSimulate = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSimulate(simulationType, {
                ...simulationData,
                forces: simulationType === 'equilibrium' ? forces : undefined,
                functionType: simulationType === 'variableForces' ? (functionType as FunctionType) : undefined,
            });
        }
    };

    return (
        <form onSubmit={handleSimulate} className="max-w-lg mx-auto p-6 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-6">Configuración de Simulación</h2>

            <div className="mb-4">
                <label htmlFor="simulationType" className="block text-white text-sm font-bold mb-2">
                    Tipo de Simulación
                </label>
                <select
                    id="simulationType"
                    value={simulationType}
                    onChange={(e) => setSimulationType(e.target.value as SimulationType)}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded shadow focus:outline-none focus:shadow-outline"
                >
                    <option value="inclinedPlane">Plano Inclinado</option>
                    <option value="freeFall">Caída Libre</option>
                    <option value="variableForces">Fuerzas Variables</option>
                    <option value="equilibrium">Equilibrio</option>
                </select>
            </div>

            {simulationType === 'inclinedPlane' &&
                <>
                    {renderInput('mass', 'Masa (kg)', { required: true })}
                    {renderInput('angle', 'Ángulo (grados)', { required: true })}
                    {renderInput('frictionCoefficient', 'Coeficiente de Fricción', { required: true, step: "0.01" })}
                </>
            }


            {simulationType === 'freeFall' &&
                <>
                    {renderInput('mass', 'Masa (kg)', { required: true })}
                    {renderInput('height', 'Altura (m)', { required: true })}
                    {renderInput('airResistance', 'Resistencia del Aire (N)', { step: "0.01" })}
                </>
            }

            {simulationType === 'variableForces' && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Grid para dividir en dos columnas */}
                        {renderInput('mass', 'Masa (kg)', { required: true })}
                        <div className="mb-4">
                            <label htmlFor="functionType" className="block text-white text-sm font-bold mb-2">
                                Tipo de Función
                            </label>
                            <select
                                id="functionType"
                                value={functionType}
                                onChange={(e) => {
                                    setFunctionType(e.target.value);
                                    setSimulationData(prev => ({
                                        ...prev,
                                        functionParameters: {}
                                    }));
                                }}
                                className="w-full px-3 py-2 bg-gray-700 text-white rounded shadow focus:outline-none focus:shadow-outline"
                            >
                                <option value="linear">Lineal (F = mt)</option>
                                <option value="quadratic">Cuadrática (F = at² + bt + c)</option>
                                <option value="sinusoidal">Sinusoidal (F = A·sin(ωt))</option>
                            </select>
                        </div>
                    </div>

                    {/* Controles de función y tiempo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Grid para dividir los controles de función */}
                        {renderFunctionControls()}
                        {renderInput('timeStart', 'Tiempo Inicial (s)', { required: true })}
                        {renderInput('timeEnd', 'Tiempo Final (s)', { required: true })}
                        {renderInput('timeStep', 'Intervalo de Tiempo (s)', { required: true, step: "0.1" })}
                    </div>
                </>
            )}

            {simulationType === 'variableForces' && renderFunctionControls()}

            {simulationType === 'equilibrium' && (
                <div className="space-y-4">
                    {forces.map((force, index) => (
                        <div key={index} className="flex space-x-2">
                            <div className="flex-1">
                                <label className="block text-white text-sm font-bold mb-1">Magnitud (N)</label>
                                <input
                                    type="number"
                                    value={force.magnitude}
                                    onChange={(e) => handleForceChange(index, 'magnitude', parseFloat(e.target.value))}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-white text-sm font-bold mb-1">Ángulo (°)</label>
                                <input
                                    type="number"
                                    value={force.angle}
                                    onChange={(e) => handleForceChange(index, 'angle', parseFloat(e.target.value))}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => setForces([...forces, { magnitude: 0, angle: 0 }])}
                        className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Añadir Fuerza
                    </button>
                </div>
            )}

            {
                Object.keys(errors).length > 0 && (
                    <div className="mt-4 p-4 bg-red-500 text-white rounded">
                        <p className="font-bold">Por favor, corrige los siguientes errores:</p>
                        <ul className="list-disc list-inside mt-2">
                            {Object.keys(errors).map((key) => (
                                <li key={key}>{errors[key]}</li>
                            ))}
                        </ul>
                    </div>
                )
            }
            {
                // Desactivamos el botón de simulación si hay errores
                Object.keys(errors).length > 0 && (
                    <button
                        type="submit"
                        className="mt-4 bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-not-allowed"
                        disabled
                    >
                        Simular
                    </button>
                ) || (
                    <button
                        type="submit"
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Simular
                    </button>
                )
            }
        </form>
    );
};

export default SimulationForm;