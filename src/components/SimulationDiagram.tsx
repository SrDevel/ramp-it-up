import React, { useRef, useEffect } from 'react';
import { SimulationType, SimulationResult } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";

interface SimulationDiagramProps {
    type: SimulationType;
    results: SimulationResult;
}

const SimulationDiagram: React.FC<SimulationDiagramProps> = ({ type, results }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        switch (type) {
            case 'inclinedPlane':
                drawInclinedPlane(ctx);
                break;
            case 'freeFall':
                drawFreeFall(ctx, results);
                break;
            case 'variableForces':
                if (results.forceValues && results.timePoints) {
                    drawForces(ctx, results.forceValues, results.timePoints, canvas);
                }
                break;
            case 'equilibrium':
                drawEquilibrium(ctx, results);
                break;
        }
    }, [type, results]);

    const drawInclinedPlane = (ctx: CanvasRenderingContext2D) => {
        ctx.beginPath();
        ctx.moveTo(50, 250);
        ctx.lineTo(350, 50);
        ctx.stroke();

        drawArrow(ctx, 200, 150, 200, 100, 'red', 'Normal');
        drawArrow(ctx, 200, 150, 250, 150, 'blue', 'Fricción');
        drawArrow(ctx, 200, 150, 200, 200, 'green', 'Gravedad');
    };

    const drawFreeFall = (ctx: CanvasRenderingContext2D, results: SimulationResult) => {
        ctx.beginPath();
        ctx.arc(200, 50, 20, 0, 2 * Math.PI);
        ctx.fill();

        drawArrow(ctx, 200, 50, 200, 250, 'green', 'Gravedad');
        if (results.airResistance) {
            drawArrow(ctx, 200, 150, 200, 100, 'red', 'Resistencia del aire');
        }
    };

    function drawForces(ctx: CanvasRenderingContext2D, forceValues: number[], timePoints: number[], canvas: HTMLCanvasElement) {
        if (!forceValues || forceValues.length === 0 || !timePoints || timePoints.length === 0) {
            console.error('No hay datos para dibujar');
            return;
        }

        const maxForce = Math.max(...forceValues);
        const minForce = Math.min(...forceValues);
        const maxTime = Math.max(...timePoints);
        const minTime = Math.min(...timePoints);

        const margin = 40;
        const graphWidth = canvas.width - 2 * margin;
        const graphHeight = canvas.height - 2 * margin;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;

        ctx.moveTo(margin, margin);
        ctx.lineTo(margin, canvas.height - margin);
        ctx.moveTo(margin, canvas.height - margin);
        ctx.lineTo(canvas.width - margin, canvas.height - margin);
        ctx.stroke();

        const scaleX = (x: number) => margin + ((x - minTime) / (maxTime - minTime)) * graphWidth;
        const scaleY = (y: number) => canvas.height - margin - ((y - minForce) / (maxForce - minForce)) * graphHeight;

        ctx.beginPath();
        ctx.strokeStyle = 'cyan';
        ctx.lineWidth = 2;

        forceValues.forEach((force, index) => {
            const x = scaleX(timePoints[index]);
            const y = scaleY(force);

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();

        ctx.font = '12px Arial';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'right';
        for (let i = 0; i <= 5; i++) {
            const force = minForce + (maxForce - minForce) * (i / 5);
            const y = scaleY(force);
            ctx.fillText(force.toFixed(0) + ' N', margin - 5, y + 4);
        }

        ctx.textAlign = 'center';
        for (let i = 0; i <= 5; i++) {
            const time = minTime + (maxTime - minTime) * (i / 5);
            const x = scaleX(time);
            ctx.fillText(time.toFixed(1) + ' s', x, canvas.height - margin + 15);
        }

        ctx.save();
        ctx.translate(15, canvas.height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Fuerza (N)', 0, 0);
        ctx.restore();
        ctx.fillText('Tiempo (s)', canvas.width / 2, canvas.height - 10);
    }

    const drawArrow = (ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number, color: string, label: string) => {
        const headlen = 10;
        const dx = toX - fromX;
        const dy = toY - fromY;
        const angle = Math.atan2(dy, dx);

        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(toX, toY);
        ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.fillText(label, (fromX + toX) / 2, (fromY + toY) / 2);
    };

    const drawEquilibrium = (ctx: CanvasRenderingContext2D, results: SimulationResult) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        const originX = ctx.canvas.width / 2;
        const originY = ctx.canvas.height / 2;
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(originX, originY, 5, 0, 2 * Math.PI);
        ctx.fill();

        if (results.forces) {
            results.forces.forEach((force, index) => {
                drawForceEquilibrium(ctx, force, index, originX, originY);
            });
        }

        ctx.fillStyle = '#fff';
        ctx.font = '16px Arial';
        ctx.fillText(
            results.isEquilibrium ? 'Equilibrio' : 'Desequilibrio',
            originX,
            originY + 30
        );
    };

    const drawForceEquilibrium = (
        ctx: CanvasRenderingContext2D,
        force: { magnitude: number; angle: number },
        index: number,
        originX: number,
        originY: number
    ) => {
        const headlen = 10; // longitud de la cabeza de la flecha
        const angle = force.angle * Math.PI / 180; // convertir ángulo a radianes
        const toX = originX + force.magnitude * Math.cos(angle); // calcular coordenada X final
        const toY = originY - force.magnitude * Math.sin(angle); // calcular coordenada Y final

        ctx.strokeStyle = `hsl(${(index * 137.5) % 360}, 70%, 45%)`; // color basado en el índice
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(toX, toY); // dibujar línea hacia la fuerza
        // dibujar cabeza de la flecha
        ctx.lineTo(
            toX - headlen * Math.cos(angle - Math.PI / 6),
            toY + headlen * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(toX, toY);
        ctx.lineTo(
            toX - headlen * Math.cos(angle + Math.PI / 6),
            toY + headlen * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();

        ctx.fillStyle = 'blue';
        ctx.fillText(
            `${force.magnitude.toFixed(2)} N`,
            (originX + toX) / 2,
            (originY + toY) / 2
        ); // mostrar magnitud de la fuerza
    };

    return (
        <Card className="backdrop-blur-sm bg-white/10 border-white/20 h-full">
            <CardHeader>
                <CardTitle className="text-xl text-white">
                    Diagrama de la Simulación
                </CardTitle>
            </CardHeader>
            <CardContent>
                <canvas ref={canvasRef} width={400} height={300} className="border border-gray-300"></canvas>
            </CardContent>
        </Card>
    );
};

export default SimulationDiagram;
