import React from 'react';
import { SimulationType, SimulationResult } from '../types';

interface SimulationResultsProps {
    type: SimulationType;
    results: SimulationResult;
}

const SimulationResults: React.FC<SimulationResultsProps> = ({type, results}) => {
    // Componente común para mostrar un par de etiqueta/valor
    const ResultItem = ({ label, value }: { label: string, value: string | number }) => (
        <div className="p-3 rounded-lg bg-white/5 backdrop-blur-sm">
            <p className="text-white/60 text-sm mb-1">{label}</p>
            <p className="text-white font-medium">{value}</p>
        </div>
    );

    return (
        <div className="text-white">
            {type === 'inclinedPlane' && (
                <div className="grid grid-cols-2 gap-4">
                    <ResultItem
                        label="Fuerza Normal"
                        value={`${results.normalForce?.toFixed(2)} N`}
                    />
                    <ResultItem
                        label="Fuerza de Fricción"
                        value={`${results.frictionForce?.toFixed(2)} N`}
                    />
                    <ResultItem
                        label="Fuerza Gravitacional"
                        value={`${results.gravitationalForce?.toFixed(2)} N`}
                    />
                    <ResultItem
                        label="Aceleración"
                        value={`${results.acceleration?.toFixed(2)} m/s²`}
                    />
                    <ResultItem
                        label="Dirección"
                        value={
                            results.direction === "upward" ? "Arriba"
                                : results.direction === "downward" ? "Abajo"
                                    : "Estático"
                        }
                    />
                </div>
            )}
            {type === 'freeFall' && (
                <div className="grid grid-cols-2 gap-4">
                    <ResultItem
                        label="Tiempo de Caída"
                        value={`${results.time?.toFixed(2)} s`}
                    />
                    <ResultItem
                        label="Velocidad Final"
                        value={`${results.finalVelocity?.toFixed(2)} m/s`}
                    />
                    <ResultItem
                        label="Aceleración"
                        value={`${results.acceleration?.toFixed(2)} m/s²`}
                    />
                </div>
            )}
            {type === 'variableForces' && (
                <div className="space-y-4">
                    <p className="text-white/60 mb-2">Fuerzas en el tiempo:</p>
                    <div className="grid grid-cols-2 gap-4">
                        {results.forceAtTime?.map((force, index) => (
                            <ResultItem
                                key={index}
                                label={`Tiempo ${index + 1}`}
                                value={`${force.toFixed(2)} N`}
                            />
                        ))}
                    </div>
                </div>
            )}
            {type === 'equilibrium' && (
                <div className="grid grid-cols-2 gap-4">
                    <ResultItem
                        label="Fuerza Total en X"
                        value={`${results.totalForceX?.toFixed(2)} N`}
                    />
                    <ResultItem
                        label="Fuerza Total en Y"
                        value={`${results.totalForceY?.toFixed(2)} N`}
                    />
                    <ResultItem
                        label="¿Está en Equilibrio?"
                        value={results.isEquilibrium ? 'Sí' : 'No'}
                    />
                </div>
            )}
        </div>
    );
};

export default SimulationResults;