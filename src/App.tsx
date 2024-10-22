import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import SimulationForm from './components/SimulationForm'
import SimulationResults from './components/SimulationResults'
import SimulationDiagram from './components/SimulationDiagram'
import { performCalculations } from './utils/calculations'
import { SimulationType, SimulationData, SimulationResult } from './types'
import { askGemini } from './services/geminiAI.ts'
import MarkdownRenderer from "./components/MarkdownRenderer.tsx";

function App() {
  const [results, setResults] = useState<SimulationResult | null>(null)
  const [simulationType, setSimulationType] = useState<SimulationType | null>(null)
  const [aiExplanation, setAiExplanation] = useState<string | null>(null)

  const handleSimulate = async (type: SimulationType, data: SimulationData) => {
    const calculationResults = performCalculations(type, data)
    setResults(calculationResults)
    setSimulationType(type)

    try {
      const prompt = `Explica los siguientes resultados de una simulación de ${type}:\n${JSON.stringify(calculationResults, null, 2)} (devuelve la explicación en español, con un máximo de 1500 caracteres y en formato markdown)`
      const explanation = await askGemini(prompt)
      if (!explanation) {
        throw new Error('No se pudo obtener una explicación de Gemini AI')
      }
      setAiExplanation(explanation)
    } catch (error) {
      console.error('Error al obtener la explicación de Claude AI:', error)
      setAiExplanation('No se pudo obtener una explicación en este momento.')
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <SimulationForm onSimulate={handleSimulate} />
          </div>
          <div>
            {results && simulationType && (
              <>
                <SimulationResults type={simulationType} results={results} />
                <SimulationDiagram type={simulationType} results={results} />
              </>
            )}
          </div>
        </div>
        {aiExplanation && (
          <div className="mt-8 bg-white shadow-md rounded px-8 pt-6 pb-8">
            <h2 className="text-2xl font-bold mb-4">Explicación de los resultados</h2>
            <MarkdownRenderer
              markdownText={aiExplanation}
            />
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default App