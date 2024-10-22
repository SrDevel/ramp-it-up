import { SimulationType, SimulationData, SimulationResult, FunctionType } from '../types';

export const performCalculations = (type: SimulationType, data: SimulationData): SimulationResult => {
    switch (type) {
        case 'inclinedPlane':
            return calculateInclinedPlane(data);
        case 'freeFall':
            return calculateFreeFall(data);
        case 'variableForces':
            const result = calculateVariableForces(data);
            if (!data.forces) {
                data.forces = [{ magnitude: 0, angle: 0 }];
            }
            return {
                ...result,
                forces: data.forces.map((force, index) => ({
                    magnitude: result.forceValues ? result.forceValues[index] : 0,
                    angle: force.angle,
                })),
            }
        case 'equilibrium':
            return calculateEquilibrium(data);
        default:
            throw new Error('Tipo de simulación no válido');
    }
};

const calculateInclinedPlane = (data: SimulationData): SimulationResult => {
    const {mass, angle, frictionCoefficient} = data as { mass: number; angle: number; frictionCoefficient: number };

    if (angle < 0 || angle > 90) {
        throw new Error('El ángulo debe estar entre 0 y 90 grados');
    }

    if (!mass || mass <= 0) {
        throw new Error('La masa debe ser un valor positivo');
    }

    if (frictionCoefficient < 0) {
        throw new Error('El coeficiente de fricción no puede ser negativo');
    } else if (frictionCoefficient > 1) {
        throw new Error('El coeficiente de fricción no puede ser mayor a 1');
    }

    const g = 9.8;
    const angleRad = (angle * Math.PI) / 180;

    const normalForce = mass * g * Math.cos(angleRad);
    const frictionForce = frictionCoefficient * normalForce;
    const gravitationalForce = mass * g * Math.sin(angleRad);
    const acceleration = (gravitationalForce - frictionForce) / mass;

    return {
        normalForce,
        frictionForce,
        gravitationalForce,
        acceleration,
        direction: acceleration > 0 ? 'downward' : acceleration < 0 ? 'upward' : 'stationary',
    };
};

const calculateFreeFall = (data: SimulationData): SimulationResult => {
    const {mass, height, airResistance} = data as { mass: number; height: number; airResistance: number };
    const g = 9.8;
    const time = Math.sqrt((2 * height) / g);
    const finalVelocity = g * time;
    const acceleration = airResistance ? g - (airResistance / mass) : g;

    return {
        time,
        finalVelocity,
        acceleration,
    };
};

const generateForceFunction = (functionType: FunctionType, params: any): (t: number) => number => {
    switch (functionType) {
        case 'linear':
            return (t: number) => params.slope * t;
        case 'quadratic':
            return (t: number) => params.a * t * t + params.b * t + params.c;
        case 'sinusoidal':
            return (t: number) => params.amplitude * Math.sin(params.frequency * t);
        default:
            throw new Error('Tipo de función no válido');
    }
};

const calculateVariableForces = (data: SimulationData): SimulationResult => {
    const {
        mass,
        functionType = 'linear',
        functionParameters,
        timeStart = 0,
        timeEnd = 10,
        timeStep = 0.1
    } = data;

    if (!mass || mass <= 0) {
        throw new Error('La masa debe ser un valor positivo');
    }

    if (!functionParameters) {
        throw new Error('Se requieren parámetros de función');
    }

    // Generar la función de fuerza basada en el tipo y parámetros
    const forceFunction = generateForceFunction(functionType, functionParameters);

    // Arrays para almacenar los resultados en cada punto del tiempo
    const timePoints: number[] = [];
    const forceValues: number[] = [];
    const velocityValues: number[] = [];
    const positionValues: number[] = [];

    let currentTime = timeStart;
    let currentVelocity = 0;
    let currentPosition = 0;

    // Calculamos los valores en cada punto del tiempo
    while (currentTime <= timeEnd) {
        const force = forceFunction(currentTime);
        const acceleration = force / mass;

        // Actualizar valores usando el método de Euler
        currentVelocity += acceleration * timeStep;
        currentPosition += currentVelocity * timeStep;

        // Almacenar valores
        timePoints.push(currentTime);
        forceValues.push(force);
        velocityValues.push(currentVelocity);
        positionValues.push(currentPosition);

        currentTime += timeStep;
    }

    // Calcular valores finales
    const finalForce = forceValues[forceValues.length - 1];
    const finalVelocity = velocityValues[velocityValues.length - 1];
    const displacement = positionValues[positionValues.length - 1];
    const acceleration = finalForce / mass;

    return {
        acceleration,
        velocity: finalVelocity,
        displacement,
        timePoints,
        forceValues,
        velocityValues,
        positionValues,
        forceAtTime: forceValues, // Para mantener compatibilidad con la interfaz anterior
    };
};


const calculateEquilibrium = (data: SimulationData): SimulationResult => {
    const { forces } = data;

    // Validación de entrada
    if (!forces || forces.length === 0) {
        throw new Error('Se requieren fuerzas para calcular el equilibrio');
    }

    // Calculo de las fuerzas totales usando reduce
    const { totalForceX, totalForceY } = forces.reduce(
        (acc, force) => {
            const angleRad = (force.angle * Math.PI) / 180;
            acc.totalForceX += force.magnitude * Math.cos(angleRad); // Proyección en el eje X
            acc.totalForceY += force.magnitude * Math.sin(angleRad); // Proyección en el eje Y
            return acc;
        },
        { totalForceX: 0, totalForceY: 0 } // Valor inicial del acumulador
    );

    // Verifica si el sistema está en equilibrio
    const isEquilibrium = Math.abs(totalForceX) < 0.01 && Math.abs(totalForceY) < 0.01;

    return {
        totalForceX,
        totalForceY,
        isEquilibrium,
    };

};
