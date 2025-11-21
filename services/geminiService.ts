
import { GoogleGenAI, Type } from "@google/genai";
import { Artwork, ArtworkDetail, Language } from '../types';

const getClient = () => {
  // import.meta.env: Vite の環境変数を使用する際の文言
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const fetchArtworkDetails = async (artwork: Artwork, language: Language = 'en'): Promise<ArtworkDetail | null> => {
  const ai = getClient();
  if (!ai) return null;

  // Artwork object is already localized by the UI layer, but we can use raw data if needed for context
  const title = artwork.title;
  const artist = artwork.artist;

  const langInstruction = language === 'ja' 
    ? "OUTPUT IN JAPANESE. Translate all fields naturally for a Japanese art museum context." 
    : "Output in English.";

  const prompt = `
    You are a senior museum curator and art historian.
    Provide a detailed academic analysis of the painting "${title}" by ${artist} (${artwork.year}).
    
    ${langInstruction}
    
    The response must be valid JSON with the following structure:
    {
      "fullDescription": "A comprehensive visual description of the composition.",
      "technicalAnalysis": "Analysis of brushwork, color palette, and medium.",
      "historicalContext": "The social, political, or personal context of the creation.",
      "symbolism": "Interpretation of key symbols and metaphors."
    }
    
    Tone: Academic, sophisticated, objective, yet engaging for an art enthusiast.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                fullDescription: { type: Type.STRING },
                technicalAnalysis: { type: Type.STRING },
                historicalContext: { type: Type.STRING },
                symbolism: { type: Type.STRING }
            },
            required: ["fullDescription", "technicalAnalysis", "historicalContext", "symbolism"]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return {
        ...artwork,
        fullDescription: data.fullDescription,
        technicalAnalysis: data.technicalAnalysis,
        historicalContext: data.historicalContext,
        symbolism: data.symbolism
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching details:", error);
    return null;
  }
};

export const chatWithCurator = async (history: { role: string, parts: { text: string }[] }[], message: string, currentArt?: Artwork, language: Language = 'ja') => {
  const ai = getClient();
  if (!ai) throw new Error("❌ Gemini API キーがありません。");

  const langInstruction = language === 'ja' 
    ? "You must reply in Japanese. Use polite, formal Japanese (Desu/Masu) suitable for a museum curator." 
    : "Reply in English.";

  let systemInstruction = `
    You are "The Archivist," a knowledgeable, polite, and slightly formal art museum curator.
    Your goal is to educate users about art history, techniques, and specific masterpieces.
    Keep answers concise (under 150 words) unless asked for elaboration.
    Use sophisticated vocabulary but explain complex terms.
    ${langInstruction}
  `;

  if (currentArt) {
    systemInstruction += `\nThe user is currently viewing "${currentArt.title}" by ${currentArt.artist}. Focus answers on this work if relevant.`;
  }

  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: { systemInstruction },
    history
  });

  const response = await chat.sendMessage({ message });
  return response.text;
};
