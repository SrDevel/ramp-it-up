import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import SimulationForm from './components/SimulationForm';
import SimulationResults from './components/SimulationResults';
import SimulationDiagram from './components/SimulationDiagram';
import { performCalculations } from './utils/calculations';
import { SimulationType, SimulationData, SimulationResult } from './types';
import { askGemini } from './services/geminiAI.ts';
import MarkdownRenderer from "./components/MarkdownRenderer.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/Card";
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [results, setResults] = useState<SimulationResult | null>(null);
  const [simulationType, setSimulationType] = useState<SimulationType | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSimulate = async (type: SimulationType, data: SimulationData) => {
    const calculationResults = performCalculations(type, data);
    setResults(calculationResults);
    setSimulationType(type);
    setAiExplanation(null); // Resetea la explicación antes de pedirla
    setLoading(true); // Establece loading a true

    try {
      const prompt = `Explica los siguientes resultados de una simulación de ${type}:\n${JSON.stringify(calculationResults, null, 2)}. Incluye las fórmulas correspondientes utilizando el formato adecuado para Markdown, donde las fórmulas matemáticas deben utilizar la notación de KaTeX. Por ejemplo, utiliza \`$\\sum F_x = 0$\` para la fuerza total en X y \`$\\sum F_y = 0$\` para la fuerza total en Y. Explica los resultados obtenidos en cada caso, con un máximo de 1500 caracteres y en formato markdown.`;
      const explanation = await askGemini(prompt);
      if (!explanation) {
        console.error('No se pudo obtener una explicación de Gemini AI');
      }
      setAiExplanation(explanation);
    } catch (error) {
      console.error('Error al obtener la explicación de Gemini AI:', error);
      setAiExplanation('No se pudo obtener una explicación en este momento.');
    } finally {
      setLoading(false); // Establece loading a false cuando la carga termina
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-indigo-950 to-gray-900">
        <div className="relative">
          {/* Efectos de fondo */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-400/20 via-transparent to-transparent blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent blur-3xl" />

          {/* Contenido principal */}
          <div className="relative">
            <Header />

            <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-theme(space.32))]">
              {/* Formulario centrado */}
              <div className="max-w-2xl mx-auto mb-12">
                <Card className="backdrop-blur-sm bg-white/10 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-center text-2xl text-white">
                      Simulador
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SimulationForm onSimulate={handleSimulate} />
                  </CardContent>
                </Card>
              </div>

              {results && simulationType && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
                    {/* Resultados */}
                    <Card className="backdrop-blur-sm bg-white/10 border-white/20 h-full">
                      <CardHeader>
                        <CardTitle className="text-xl text-white">
                          Resultados
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <SimulationResults
                            type={simulationType}
                            results={results}
                        />
                      </CardContent>
                    </Card>

                    {/* Diagrama */}
                    <Card className="backdrop-blur-sm bg-white/10 border-white/20 h-full">
                      <CardHeader>
                        <CardTitle className="text-xl text-white">
                          Diagrama
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <SimulationDiagram
                            type={simulationType}
                            results={results}
                        />
                      </CardContent>
                    </Card>
                  </div>
              )}

              {loading ? ( // Muestra el spinner mientras se está cargando
                  <Card className="backdrop-blur-sm bg-white/10 border-white/20 max-w-4xl mx-auto">
                    <CardHeader>
                      <CardTitle className="text-xl text-white">
                        Esperando explicación...
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <LoadingSpinner />
                    </CardContent>
                  </Card>
              ) : aiExplanation && (
                  <Card className="backdrop-blur-sm bg-white/10 border-white/20 max-w-4xl mx-auto">
                    <CardHeader>
                      <CardTitle className="text-xl text-white">
                        Explicación:
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-invert prose-indigo max-w-none">
                        <MarkdownRenderer markdownText={aiExplanation} />
                      </div>
                    </CardContent>
                  </Card>
              )}
            </main>

            <Footer />
          </div>
        </div>
      </div>
  );
}

export default App;
