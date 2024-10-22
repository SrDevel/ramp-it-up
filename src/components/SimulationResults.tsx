import React from 'react';
import {SimulationType, SimulationResult} from '../types';

interface SimulationResultsProps {
    type: SimulationType;
    results: SimulationResult;
}

const SimulationResults: React.FC<SimulationResultsProps> = ({type, results}) => {
    return (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-2xl font-bold mb-4">Resultados de la Simulación</h2>
            {type === 'inclinedPlane' && (
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="font-bold">Fuerza Normal:</p>
                        <p>{results.normalForce?.toFixed(2)} N</p>
                    </div>
                    <div>
                        <p className="font-bold">Fuerza de Fricción:</p>
                        <p>{results.frictionForce?.toFixed(2)} N</p>
                    </div>
                    <div>
                        <p className="font-bold">Fuerza Gravitacional:</p>
                        <p>{results.gravitationalForce?.toFixed(2)} N</p>
                    </div>
                    <div>
                        <p className="font-bold">Aceleración:</p>
                        <p>{results.acceleration?.toFixed(2)} m/s²</p>
                    </div>
                    <div>
                        <p className="font-bold">Dirección:</p>
                        <p>{
                            results.direction === "upward"? "Arriba" 
                            : results.direction === "downward" ? "Abajo" 
                            : "Estático"
                        }</p>
                    </div>
                </div>
            )}
            {type === 'freeFall' && (
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="font-bold">Tiempo de Caída:</p>
                        <p>{results.time?.toFixed(2)} s</p>
                    </div>
                    <div>
                        <p className="font-bold">Velocidad Final:</p>
                        <p>{results.finalVelocity?.toFixed(2)} m/s</p>
                    </div>
                    <div>
                        <p className="font-bold">Aceleración:</p>
                        <p>{results.acceleration?.toFixed(2)} m/s²</p>
                    </div>
                </div>
            )}
            {type === 'variableForces' && (
                <div>
                    <p className="font-bold">Fuerzas en el tiempo:</p>
                    <ul>
                        {results.forceAtTime?.map((force, index) => (
                            <li key={index}>
                                <p className="font-bold mb-2">Fuerza en el tiempo {index + 1}: {force.toFixed(2)} s</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {type === 'equilibrium' && (
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="font-bold">Fuerza Total en X:</p>
                        <p>{results.totalForceX?.toFixed(2)} N</p>
                    </div>
                    <div>
                        <p className="font-bold">Fuerza Total en Y:</p>
                        <p>{results.totalForceY?.toFixed(2)} N</p>
                    </div>
                    <div>
                        <p className="font-bold">¿Está en Equilibrio?</p>
                        <p>{results.isEquilibrium ? 'Sí' : 'No'}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SimulationResults;