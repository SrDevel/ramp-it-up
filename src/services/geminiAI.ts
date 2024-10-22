import {GoogleGenerativeAI} from "@google/generative-ai";

const VITE_GENERATIVE_AI_API_KEY = import.meta.env.VITE_GENERATIVE_AI_API_KEY;

const genAI = new GoogleGenerativeAI(VITE_GENERATIVE_AI_API_KEY);

export const askGemini = async (prompt: string) => {
    const model = genAI.getGenerativeModel({model: 'gemini-1.5-flash'});
    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        return response.text();
    } catch (error) {
        console.error('Error al obtener respuesta de Gemini AI:', error);
        return null;
    }
};
