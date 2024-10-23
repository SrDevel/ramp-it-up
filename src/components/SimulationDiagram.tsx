import {useRef, useEffect} from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import {Compass} from 'lucide-react';
import {Card, CardContent, CardHeader, CardTitle} from "./ui/Card.tsx";

const EnhancedSimulationDiagram = ({type, results}: { type: string; results: any }
) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (type !== 'variableForces') {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Set high-quality rendering
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            switch (type) {
                case 'inclinedPlane':
                    drawEnhancedInclinedPlane(ctx, results);
                    break;
                case 'freeFall':
                    drawEnhancedFreeFall(ctx, results);
                    break;
                case 'equilibrium':
                    drawEnhancedEquilibrium(ctx, results);
                    break;
            }
        }
    }, [type, results]);

    const drawEnhancedInclinedPlane = (ctx: CanvasRenderingContext2D, results: {
        normalForce: number;
        frictionForce: number;
        gravitationalForce: number;
        acceleration: number
    }) => {
        const { normalForce, frictionForce, gravitationalForce, acceleration } = results;

        // Draw background grid
        drawGrid(ctx);

        // Configurar puntos del plano inclinado
        const startX = 100;
        const startY = 250;
        const endX = 300;
        const endY = 100;

        ctx.save();

        // Draw horizontal reference line
        ctx.strokeStyle = '#4B5563';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]); // Línea punteada para referencia
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, startY);
        ctx.stroke();

        // Draw inclined plane
        ctx.setLineDash([]); // Restaurar línea sólida
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Calculate block position (center of the plane)
        const blockX = (startX + endX) / 2;
        const blockY = (startY + endY) / 2;
        const blockSize = 30;

        // Draw block
        ctx.fillStyle = '#60A5FA';
        ctx.fillRect(blockX - blockSize/2, blockY - blockSize/2, blockSize, blockSize);

        // Calculate angle for forces
        const angle = Math.atan2(startY - endY, endX - startX);
        const degrees = angle * 180 / Math.PI;

        // Scale factor for force arrows
        const scale = 0.3;

        // Draw forces with correct angles
        // Normal force (perpendicular to plane)
        drawForceArrow(
            ctx,
            blockX,
            blockY,
            normalForce * scale,
            degrees - 90,
            '#EF4444',
            'N = ' + normalForce?.toFixed(1) + ' N'
        );

        // Friction force (parallel to plane, opposite to motion)
        drawForceArrow(
            ctx,
            blockX,
            blockY,
            frictionForce * scale,
            degrees + 180,
            '#F59E0B',
            'f = ' + frictionForce?.toFixed(1) + ' N'
        );

        // Gravitational force (straight down)
        drawForceArrow(
            ctx,
            blockX,
            blockY,
            gravitationalForce * scale,
            -90,
            '#10B981',
            'mg = ' + gravitationalForce?.toFixed(1) + ' N'
        );

        // Draw acceleration indicator
        if (acceleration) {
            const accText = `a = ${acceleration.toFixed(2)} m/s²`;
            ctx.fillStyle = '#8B5CF6';
            ctx.font = '14px Arial';
            ctx.fillText(accText, blockX + 50, blockY - 30);
        }

        // Draw angle arc and indicator at the intersection
        drawAngleArc(ctx, startX, startY, 30);

        ctx.restore();
    };

    const drawAngleArc = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
        const startAngle = 0;
        const endAngle = -45 * Math.PI / 180; // 45 grados en radianes

        ctx.beginPath();
        ctx.arc(x, y, radius, startAngle, endAngle, true);
        ctx.strokeStyle = '#8B5CF6';
        ctx.stroke();

        // Draw angle label
        const labelAngle = endAngle / 2; // Ángulo medio para el texto
        const labelRadius = radius + 10;
        ctx.fillStyle = '#8B5CF6';
        ctx.font = '14px Arial';
        ctx.fillText(
            '45°',
            x + labelRadius * Math.cos(labelAngle),
            y - labelRadius * Math.sin(labelAngle)
        );
    };

    const drawForceArrow = (ctx: CanvasRenderingContext2D, x: number, y: number, magnitude: number, angle: number, color: string, label: string) => {
        const radians = (angle - 90) * Math.PI / 180;
        const length = magnitude;
        const dx = length * Math.cos(radians);
        const dy = length * Math.sin(radians);

        ctx.save();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 2;

        // Draw main line
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + dx, y + dy);
        ctx.stroke();

        // Draw arrowhead
        const headLength = 10;
        const headAngle = Math.PI / 6;
        ctx.beginPath();
        ctx.moveTo(x + dx, y + dy);
        ctx.lineTo(
            x + dx - headLength * Math.cos(radians - headAngle),
            y + dy - headLength * Math.sin(radians - headAngle)
        );
        ctx.lineTo(
            x + dx - headLength * Math.cos(radians + headAngle),
            y + dy - headLength * Math.sin(radians + headAngle)
        );
        ctx.closePath();
        ctx.fill();

        // Adjust label position based on angle
        const labelOffsetX = dx / 2;
        const labelOffsetY = dy / 2;

        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(label, x + labelOffsetX, y + labelOffsetY - 5);
        ctx.restore();
    };

    const drawEnhancedFreeFall = (ctx: CanvasRenderingContext2D, results: {
        airResistance?: any;
        acceleration?: any;
        finalVelocity?: any;
        time?: any;
    }) => {
        const {acceleration, finalVelocity, time} = results;

        // Draw background grid
        drawGrid(ctx);

        // Draw falling object at different positions
        const positions = 5;
        for (let i = 0; i < positions; i++) {
            const alpha = 1 - (i / positions);
            ctx.fillStyle = `rgba(96, 165, 250, ${alpha})`;
            ctx.beginPath();
            ctx.arc(200, 50 + (i * 50), 15, 0, 2 * Math.PI);
            ctx.fill();
        }

        // Draw forces
        drawForceArrow(ctx, 200, 150, 60, -90, '#10B981', 'mg');
        if (results.airResistance) {
            drawForceArrow(ctx, 200, 150, 30, 90, '#EF4444', 'Fair');
        }

        // Draw information panel
        drawInfoPanel(ctx, [
            `v₀ = 0 m/s`,
            `v = ${finalVelocity?.toFixed(2)} m/s`,
            `t = ${time?.toFixed(2)} s`,
            `a = ${acceleration?.toFixed(2)} m/s²`
        ]);
    };

    const drawEnhancedEquilibrium = (ctx: CanvasRenderingContext2D, results: {
        forces: any;
        isEquilibrium: any;
        totalForceX: any;
        totalForceY: any;
    }) => {
        const {forces, isEquilibrium, totalForceX, totalForceY} = results;

        // Draw background grid
        drawGrid(ctx);

        const centerX = ctx.canvas.width / 2;
        const centerY = ctx.canvas.height / 2;

        // Draw central point
        ctx.fillStyle = '#60A5FA';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
        ctx.fill();

        // Draw forces
        if (forces) {
            forces.forEach((force: { magnitude: number; angle: any; }, index: number) => {
                const color = `hsl(${(index * 137.5) % 360}, 70%, 50%)`;
                drawForceArrow(
                    ctx,
                    centerX,
                    centerY,
                    force.magnitude,
                    force.angle,
                    color,
                    `F${index + 1} = ${force.magnitude.toFixed(1)} N`
                );
            });
        }

        // Draw resultant force
        if (totalForceX !== undefined && totalForceY !== undefined) {
            const resultantMagnitude = Math.sqrt(totalForceX * totalForceX + totalForceY * totalForceY);
            const resultantAngle = Math.atan2(totalForceY, totalForceX) * 180 / Math.PI;

            if (resultantMagnitude > 0.01) {
                drawForceArrow(
                    ctx,
                    centerX,
                    centerY,
                    resultantMagnitude * 2,
                    resultantAngle,
                    '#EF4444',
                    `R = ${resultantMagnitude.toFixed(1)} N`
                );
            }
        }

        // Draw equilibrium status
        ctx.font = '16px Arial';
        ctx.fillStyle = isEquilibrium ? '#10B981' : '#EF4444';
        ctx.textAlign = 'center';
        ctx.fillText(
            isEquilibrium ? '✓ Sistema en equilibrio' : '× Sistema en desequilibrio',
            centerX,
            centerY + 100
        );
    };

    const drawGrid = (ctx: CanvasRenderingContext2D) => {
        ctx.save();
        ctx.strokeStyle = '#4B556320';
        ctx.lineWidth = 1;

        for (let i = 0; i < ctx.canvas.width; i += 20) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, ctx.canvas.height);
            ctx.stroke();
        }

        for (let i = 0; i < ctx.canvas.height; i += 20) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(ctx.canvas.width, i);
            ctx.stroke();
        }
        ctx.restore();
    };

    const drawInfoPanel = (ctx: CanvasRenderingContext2D, lines: any[]) => {
        ctx.save();
        ctx.fillStyle = 'rgba(17, 24, 39, 0.8)';
        ctx.strokeStyle = '#4B5563';
        ctx.lineWidth = 1;

        const padding = 10;
        const lineHeight = 20;
        const width = 150;
        const height = lines.length * lineHeight + 2 * padding;
        const x = ctx.canvas.width - width - 20;
        const y = 20;

        // Draw panel background
        ctx.beginPath();
        ctx.roundRect(x, y, width, height, 5);
        ctx.fill();
        ctx.stroke();

        // Draw text
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        lines.forEach((line, index) => {
            ctx.fillText(line, x + padding, y + padding + lineHeight * index + 14);
        });
        ctx.restore();
    };

    const VariableForcesChart = () => {
        // Si no hay datos, crear datos de ejemplo
        const defaultData = Array.from({length: 100}, (_, i) => ({
            time: i * 0.1,
            force: Math.sin(i * 0.1) * 10,
            velocity: Math.sin(i * 0.1 - 1) * 5,
            position: Math.sin(i * 0.1 - 2) * 3
        }));

        const data = results?.timePoints
            ? results.timePoints.map((time: any, index: string | number) => ({
                time,
                force: results.forceValues?.[index] || 0,
                velocity: results.velocityValues?.[index] || 0,
                position: results.positionValues?.[index] || 0,
            }))
            : defaultData;

        return (
            <div className="w-full h-[400px] p-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 15,
                            bottom: 65
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#666"/>
                        <XAxis
                            dataKey="time"
                            stroke="#fff"
                            label={{
                                value: 'Tiempo (s)',
                                position: 'bottom',
                                offset: 5,
                                fill: '#fff'
                            }}
                        />
                        <YAxis
                            stroke="#fff"
                            label={{
                                value: 'Valores',
                                angle: -90,
                                position: 'left',
                                offset: 10,
                                fill: '#fff'
                            }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                border: '1px solid #666',
                                borderRadius: '4px',
                                color: '#fff'
                            }}
                        />
                        <Legend
                            wrapperStyle={{
                                color: '#fff',
                                paddingTop: '20px',
                                marginLeft: '40px'
                            }}
                            verticalAlign="bottom"
                            height={36}
                        />
                        <Line
                            type="monotone"
                            dataKey="force"
                            stroke="#8884d8"
                            name="Fuerza (N)"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{r: 6}}
                        />
                        <Line
                            type="monotone"
                            dataKey="velocity"
                            stroke="#82ca9d"
                            name="Velocidad (m/s)"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{r: 6}}
                        />
                        <Line
                            type="monotone"
                            dataKey="position"
                            stroke="#ffc658"
                            name="Posición (m)"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{r: 6}}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    }

    return (
        <Card className="backdrop-blur-sm bg-white/10 border-white/20">
            <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                    <Compass className="w-6 h-6"/>
                    {type === 'inclinedPlane' && 'Plano Inclinado'}
                    {type === 'freeFall' && 'Caída Libre'}
                    {type === 'variableForces' && 'Fuerzas Variables'}
                    {type === 'equilibrium' && 'Sistema en Equilibrio'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {type === 'variableForces' ? (
                    <VariableForcesChart/>
                ) : (
                    <canvas
                        ref={canvasRef}
                        width={400}
                        height={300}
                        className="border border-gray-300 rounded-lg bg-gray-900"
                    />
                )}
            </CardContent>
        </Card>
    );
};

export default EnhancedSimulationDiagram;