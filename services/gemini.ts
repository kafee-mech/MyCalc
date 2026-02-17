
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const solveMathProblem = async (query: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Solve this mathematical query and provide a structured JSON response. 
      Query: "${query}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            expression: {
              type: Type.STRING,
              description: "The mathematical expression extracted from the query.",
            },
            result: {
              type: Type.STRING,
              description: "The numerical or algebraic result of the query.",
            },
            explanation: {
              type: Type.STRING,
              description: "A very brief 1-sentence explanation if it's a word problem.",
            }
          },
          required: ["expression", "result"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};
