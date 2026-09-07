
import { GoogleGenAI, Type } from "@google/genai";
import { Artwork, ArtworkDetail, Language } from '../types';

export class GeminiRateLimitError extends Error {
  constructor() {
    super('Gemini API rate limit exceeded');
    this.name = 'GeminiRateLimitError';
  }
}

export const isGeminiRateLimitError = (error: unknown): error is GeminiRateLimitError =>
  error instanceof GeminiRateLimitError;

const isRateLimitError = (error: unknown): boolean => {
  if (error instanceof GeminiRateLimitError) return true;

  const inspect = (value: unknown): string => {
    if (value instanceof Error) return `${value.name} ${value.message}`;
    if (typeof value === 'string') return value;
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  };

  const haystack = inspect(error).toLowerCase();
  const rateLimitPatterns = [
    '429',
    'rate limit',
    'rate_limit',
    'too many requests',
    'quota exceeded',
    'quota_exceeded',
    'resource_exhausted',
    'resource exhausted',
    'exceeded your current quota',
    'requests per minute',
    'requests per day',
  ];

  if (rateLimitPatterns.some((pattern) => haystack.includes(pattern))) {
    return true;
  }

  const anyError = error as {
    status?: number;
    code?: number | string;
    error?: { code?: number | string; status?: string; message?: string };
  };

  return (
    anyError?.status === 429 ||
    anyError?.code === 429 ||
    anyError?.code === 'RESOURCE_EXHAUSTED' ||
    anyError?.error?.code === 429 ||
    anyError?.error?.status === 'RESOURCE_EXHAUSTED'
  );
};

const throwIfRateLimited = (error: unknown): void => {
  if (isRateLimitError(error)) {
    throw new GeminiRateLimitError();
  }
};

const getClient = () => {
  // import.meta.env: Vite の環境変数を使用する際の文言
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const fetchArtworkDetails = async (artwork: Artwork, language: Language = 'en'): Promise<ArtworkDetail | null> => {
  const ai = getClient();
  if (!ai) return null;

  const title = artwork.title;
  const artist = artwork.artist;

  const langInstruction = language === 'ja' 
    ? `OUTPUT IN JAPANESE. 美術初心者にもわかりやすい平易な日本語で書いてください。
       専門用語や美術用語を使う場合は、必ず直後に（）内で短く説明を添えてください。
       例：厚塗り（絵の具をたっぷり重ねて描く技法）、遠近法（遠くのものを小さく描いて奥行きを出す方法）
       1文は短めにし、難しい言い回しは避けてください。`
    : `Output in English. Write for art beginners with no prior knowledge.
       Whenever you use a technical or art-historical term, immediately follow it with a brief plain-language explanation in parentheses.
       Example: chiaroscuro (the contrast of light and dark to create depth), impasto (thick layers of paint applied with visible brushstrokes)
       Use short sentences and avoid jargon without explanation.`;

  const prompt = `
    You are a friendly museum curator who explains art to beginners.
    Provide an accessible, easy-to-understand analysis of the painting "${title}" by ${artist} (${artwork.year}).

    ${langInstruction}

    The response must be valid JSON with the following structure:
    {
      "fullDescription": "What you see in the painting — subjects, colors, composition — explained simply.",
      "technicalAnalysis": "How it was painted (materials, brushwork, style) in beginner-friendly language.",
      "historicalContext": "When and why it was made, and what was happening in the world at that time.",
      "symbolism": "Hidden meanings or symbols in the work, explained clearly."
    }

    Tone: Warm, clear, and encouraging — like a curator giving a gallery tour to first-time visitors.
    Assume the reader knows nothing about art history.
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
    throwIfRateLimited(error);
    console.error("絵画詳細の生成に失敗。", error);
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

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: { systemInstruction },
      history
    });

    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    throwIfRateLimited(error);
    throw error;
  }
};
