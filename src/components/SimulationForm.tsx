import React, { useState, useEffect } from 'react';
import {FunctionType, SimulationData, SimulationType} from '../types';
import {SimulationValidator} from "../validators/SimulationValidator.ts";

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
            functionType: simulationType === 'variableForces' ? functionType as FunctionType : undefined
        };

        const validationErrors = SimulationValidator.validate(simulationType, dataToValidate);
        const errorMap = validationErrors.reduce((acc, error) => ({
            ...acc,
            [error.field]: error.message
        }), {});

        setErrors(errorMap);
        return Object.keys(errorMap).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSimulationData(prev => ({ ...prev, [name]: parseFloat(value) }));
        setTouched(prev => ({ ...prev, [name]: true }));
    };

    const handleFunctionParameterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSimulationData(prev => ({
            ...prev,
            functionParameters: {
                ...(prev.functionParameters || {}),
                [name]: parseFloat(value)
            }
        }));
        setTouched(prev => ({ ...prev, [`functionParameters.${name}`]: true }));
    };

    const handleBlur = (fieldName: string) => {
        setTouched(prev => ({ ...prev, [fieldName]: true }));
    };

    const handleForceChange = (index: number, field: 'magnitude' | 'angle', value: number) => {
        const newForces = [...forces];
        newForces[index][field] = value;
        setForces(newForces);
        setTouched(prev => ({ ...prev, [`forces[${index}].${field}`]: true }));
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

    const renderError = (fieldName: string) => {
        if (touched[fieldName] && errors[fieldName]) {
            return (
                <p className="text-red-500 text-xs italic mt-1">
                    {errors[fieldName]}
                </p>
            );
        }
        return null;
    };

    const renderInput = (name: string, label: string, props = {}) => (
        <div className="mb-4">
            <label htmlFor={name} className="block text-gray-700 text-sm font-bold mb-2">
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
                                onBlur={() => handleBlur('functionParameters.slope')}
                                name="slope"
                                className={`mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 ${
                                    touched['functionParameters.slope'] && errors['functionParameters.slope'] ? 'border-red-500' : ''
                                }`}
                            />
                            {renderError('functionParameters.slope')}
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
                                onBlur={() => handleBlur('functionParameters.amplitude')}
                                name="amplitude"
                                className={`mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 ${
                                    touched['functionParameters.amplitude'] && errors['functionParameters.amplitude'] ? 'border-red-500' : ''
                                }`}
                            />
                            {renderError('functionParameters.amplitude')}
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
            default:
                return null;
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const isValid = validateForm();

        if (!isValid) {
            // Marcar todos los campos como tocados para mostrar todos los errores
            const allFields = Object.keys(simulationData).reduce((acc, key) => ({
                ...acc,
                [key]: true
            }), {});
            setTouched(allFields);
            return;
        }

        const finalData = {
            ...simulationData,
            forces: simulationType === 'equilibrium' ? forces : undefined,
            functionType: simulationType === 'variableForces' ? functionType as FunctionType : undefined,
            forceFunction: simulationType === 'variableForces' ? generateForceFunction() : undefined
        };


        onSimulate(simulationType, finalData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
                <label htmlFor="simulationType" className="block text-gray-700 text-sm font-bold mb-2">
                    Tipo de Simulación
                </label>
                <select
                    id="simulationType"
                    value={simulationType}
                    onChange={(e) => {
                        setSimulationType(e.target.value as SimulationType);
                        setErrors({});
                        setTouched({});
                        setSimulationData({});
                    }}
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
                    {renderInput('mass', 'Masa (kg)', { required: true })}
                    {renderInput('angle', 'Ángulo (grados)', { required: true })}
                    {renderInput('frictionCoefficient', 'Coeficiente de Fricción', { required: true, step: "0.01" })}
                </>
            )}

            {simulationType === 'freeFall' && (
                <>
                    {renderInput('mass', 'Masa (kg)', { required: true })}
                    {renderInput('height', 'Altura (m)', { required: true })}
                    {renderInput('airResistance', 'Resistencia del Aire (N)', { step: "0.01" })}
                </>
            )}

            {simulationType === 'variableForces' && (
                <>
                    {renderInput('mass', 'Masa (kg)', { required: true })}
                    <div className="mb-4">
                        <label htmlFor="functionType" className="block text-gray-700 text-sm font-bold mb-2">
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
                            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="linear">Lineal (F = mt)</option>
                            <option value="quadratic">Cuadrática (F = at² + bt + c)</option>
                            <option value="sinusoidal">Sinusoidal (F = A·sin(ωt))</option>
                        </select>
                    </div>
                    {renderFunctionControls()}
                    {renderInput('timeStart', 'Tiempo Inicial (s)', { required: true })}
                    {renderInput('timeEnd', 'Tiempo Final (s)', { required: true })}
                    {renderInput('timeStep', 'Intervalo de Tiempo (s)', { required: true, step: "0.1" })}
                </>
            )}

            {simulationType === 'equilibrium' && (
                <div>
                    <h3 className="font-bold text-lg mb-4">Fuerzas en Equilibrio</h3>
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
                                    onBlur={() => handleBlur(`forces[${index}].magnitude`)}
                                    className={`border rounded w-full py-2 px-3 ${
                                        touched[`forces[${index}].magnitude`] && errors[`forces[${index}].magnitude`]
                                            ? 'border-red-500'
                                            : ''
                                    }`}
                                    required
                                />
                                {renderError(`forces[${index}].magnitude`)}
                            </div>
                            <div className="flex-1">
                                <label className="block text-gray-700 text-sm mb-1">
                                    Ángulo (grados)
                                </label>
                                <input
                                    type="number"
                                    value={force.angle}
                                    onChange={(e) => handleForceChange(index, 'angle', parseFloat(e.target.value))}
                                    onBlur={() => handleBlur(`forces[${index}].angle`)}
                                    className={`border rounded w-full py-2 px-3 ${
                                        touched[`forces[${index}].angle`] && errors[`forces[${index}].angle`]
                                            ? 'border-red-500'
                                            : ''
                                    }`}
                                    required
                                />
                                {renderError(`forces[${index}].angle`)}
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => setForces([...forces, { magnitude: 0, angle: 0 }])}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Agregar Fuerza
                    </button>
                </div>
            )}
            {/*
                Lista de errores
                debe tener un cuadrado rojo recubriendo los errores
            */
            }
            {
                Object.keys(errors).length > 0 && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">¡Error!</strong>
                        <ul>
                            {Object.keys(errors).map((key, index) => (
                                <li key={index}>{errors[key]}</li>
                            ))}
                        </ul>
                    </div>
                )
            }
            {
                Object.keys(errors).length > 0 && (
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-not-allowed"
                        disabled
                    >
                        Simular
                    </button>
                ) || (
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Simular
                    </button>
                )
            }
        </form>
    );
}

export default SimulationForm;