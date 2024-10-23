import { SimulationType, SimulationData } from '../types';

interface ValidationError {
    field: string;
    message: string;
}

export class SimulationValidator {
    static validate(type: SimulationType, data: SimulationData): ValidationError[] {
        const errors: ValidationError[] = [];

        // Validaciones comunes
        if (data.mass !== undefined && !this.isValidMass(data.mass)) {
            errors.push({
                field: 'mass',
                message: 'La masa debe ser un número positivo mayor que 0'
            });
        }

        // Validaciones específicas por tipo
        switch (type) {
            case 'inclinedPlane':
                errors.push(...this.validateInclinedPlane(data));
                break;
            case 'freeFall':
                errors.push(...this.validateFreeFall(data));
                break;
            case 'variableForces':
                errors.push(...this.validateVariableForces(data));
                break;
            case 'equilibrium':
                errors.push(...this.validateEquilibrium(data));
                break;
            default:
                errors.push({
                    field: 'type',
                    message: 'Tipo de simulación no válido'
                });
        }

        return errors;
    }

    private static isValidMass(mass: number): boolean {
        return mass > 0 && isFinite(mass) && mass <= 1000000;
    }

    private static isValidAngle(angle: number): boolean {
        return angle >= 0 && angle <= 360 && isFinite(angle);
    }

    private static isValidCoefficient(coefficient: number): boolean {
        return coefficient >= 0 && coefficient <= 1 && isFinite(coefficient);
    }

    private static isValidHeight(height: number): boolean {
        return height >= 0 && height <= 1000000 && isFinite(height);
    }

    private static isValidTime(time: number): boolean {
        return time >= 0 && time <= 3600 && isFinite(time);
    }

    private static isValidForce(magnitude: number): boolean {
        return isFinite(magnitude) && magnitude <= 1000000;
    }

    private static validateInclinedPlane(data: SimulationData): ValidationError[] {
        const errors: ValidationError[] = [];
        const { angle, frictionCoefficient } = data;

        if (angle !== undefined && !this.isValidAngle(angle)) {
            errors.push({
                field: 'angle',
                message: 'El ángulo debe estar entre 0 y 90 grados'
            });
        }

        if (frictionCoefficient !== undefined && !this.isValidCoefficient(frictionCoefficient)) {
            errors.push({
                field: 'frictionCoefficient',
                message: 'El coeficiente de fricción debe estar entre 0 y 1'
            });
        }

        return errors;
    }

    private static validateFreeFall(data: SimulationData): ValidationError[] {
        const errors: ValidationError[] = [];
        const { height, airResistance } = data;

        if (height !== undefined && !this.isValidHeight(height)) {
            errors.push({
                field: 'height',
                message: 'La altura debe ser un número positivo y menor a 1,000,000 metros'
            });
        }

        if (airResistance !== undefined && !this.isValidForce(airResistance)) {
            errors.push({
                field: 'airResistance',
                message: 'La resistencia del aire debe ser un número válido y menor a 1,000,000 N'
            });
        }

        return errors;
    }

    private static validateVariableForces(data: SimulationData): ValidationError[] {
        const errors: ValidationError[] = [];
        const { timeStart, timeEnd, timeStep, functionType, functionParameters } = data;

        if (timeStart !== undefined && !this.isValidTime(timeStart)) {
            errors.push({
                field: 'timeStart',
                message: 'El tiempo inicial debe ser un número no negativo y menor a 3600 segundos'
            });
        }

        if (timeEnd !== undefined && !this.isValidTime(timeEnd)) {
            errors.push({
                field: 'timeEnd',
                message: 'El tiempo final debe ser un número positivo y menor a 3600 segundos'
            });
        }

        if (timeStart !== undefined && timeEnd !== undefined && timeStart >= timeEnd) {
            errors.push({
                field: 'timeRange',
                message: 'El tiempo inicial debe ser menor que el tiempo final'
            });
        }

        if (timeEnd !== undefined && timeStep === undefined) {
            errors.push({
                field: 'timeStep',
                message: 'Se requiere un intervalo de tiempo para el rango de tiempo especificado'
            });
        }

        const timeRange = timeEnd !== undefined && timeStart !== undefined ? timeEnd - timeStart : 0;


        if (timeStep !== undefined && (timeStep <= 0 || timeStep > (timeRange))) {
            errors.push({
                field: 'timeStep',
                message: 'El paso de tiempo debe ser positivo y menor que el rango de tiempo total'
            });
        }

        if (!functionType || !['linear', 'quadratic', 'sinusoidal'].includes(functionType)) {
            errors.push({
                field: 'functionType',
                message: 'Tipo de función no válido'
            });
        }

        if (!functionParameters) {
            errors.push({
                field: 'functionParameters',
                message: 'Se requieren parámetros de función'
            });
        } else {
            // Validar parámetros según el tipo de función
            switch (functionType) {
                case 'linear':
                    if (typeof functionParameters.slope !== 'number') {
                        errors.push({
                            field: 'functionParameters.slope',
                            message: 'Se requiere un valor numérico para la pendiente'
                        });
                    }
                    break;
                case 'quadratic':
                    if (typeof functionParameters.a !== 'number' ||
                        typeof functionParameters.b !== 'number' ||
                        typeof functionParameters.c !== 'number') {
                        errors.push({
                            field: 'functionParameters',
                            message: 'Se requieren coeficientes a, b y c para la función cuadrática'
                        });
                    }
                    break;
                case 'sinusoidal':
                    if (typeof functionParameters.amplitude !== 'number' ||
                        typeof functionParameters.frequency !== 'number') {
                        errors.push({
                            field: 'functionParameters',
                            message: 'Se requieren amplitud y frecuencia para la función sinusoidal'
                        });
                    }
                    break;
            }
        }

        return errors;
    }

    private static validateEquilibrium(data: SimulationData): ValidationError[] {
        const errors: ValidationError[] = [];
        const { forces } = data;

        if (!Array.isArray(forces) || forces.length === 0) {
            errors.push({
                field: 'forces',
                message: 'Se requiere al menos una fuerza para el cálculo de equilibrio'
            });
            return errors;
        }

        forces.forEach((force, index) => {
            if (!this.isValidForce(force.magnitude)) {
                errors.push({
                    field: `forces[${index}].magnitude`,
                    message: `La magnitud de la fuerza ${index + 1} debe ser un número válido y menor a 1,000,000 N`
                });
            }

            if (!this.isValidAngle(force.angle)) {
                errors.push({
                    field: `forces[${index}].angle`,
                    message: `El ángulo de la fuerza ${index + 1} debe estar entre 0 y 360 grados`
                });
            }
        });

        return errors;
    }
}