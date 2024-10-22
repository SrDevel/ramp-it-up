export type SimulationType = 'inclinedPlane' | 'freeFall' | 'variableForces' | 'equilibrium';

export type FunctionType = 'linear' | 'quadratic' | 'sinusoidal';

export interface FunctionParameters {
    [key: string]: number | undefined;
    slope?: number;      // Para función lineal
    a?: number;          // Para función cuadrática
    b?: number;          // Para función cuadrática
    c?: number;          // Para función cuadrática
    amplitude?: number;  // Para función sinusoidal
    frequency?: number;  // Para función sinusoidal
}

export interface SimulationData {
    // Común a varios tipos
    mass?: number;

    // Plano Inclinado
    angle?: number;
    frictionCoefficient?: number;

    // Caída Libre
    height?: number;
    airResistance?: number;

    // Fuerzas Variables
    forceFunction?: string;
    functionType?: FunctionType;
    functionParameters?: FunctionParameters;
    timeStart?: number;
    timeEnd?: number;
    timeStep?: number;

    // Cuerpos en Equilibrio o Fuerzas Variables
    forceMagnitude?: number;
    forceDirection?: number;

    // Equilibrio
    forces?: { magnitude: number; angle: number }[];
}

export interface SimulationResult {
    normalForce?: number;
    frictionForce?: number;
    gravitationalForce?: number;
    acceleration?: number;
    direction?: 'upward' | 'downward' | 'stationary';
    time?: number;
    finalVelocity?: number;
    displacement?: number;
    forces?: { magnitude: number; angle: number }[];
    velocity?: number;

    // Para equilibrio
    totalForceX?: number;
    totalForceY?: number;
    isEquilibrium?: boolean;

    // Para fuerzas variables
    forceAtTime?: number[];
    timePoints?: number[];        // Puntos de tiempo para la simulación
    forceValues?: number[];       // Valores de fuerza correspondientes
    velocityValues?: number[];    // Valores de velocidad en cada punto
    positionValues?: number[];    // Valores de posición en cada punto

    airResistance?: number;
}