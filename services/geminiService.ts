
import { GoogleGenAI } from "@google/genai";

// Ensure the API key is available from environment variables
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function personalizeMessage(baseMessage: string, name?: string): Promise<string> {
  try {
    let prompt: string;
    
    if (name) {
      prompt = `You are an expert copywriter. Rephrase the following SMS message for a person named "${name}" to make it sound more personal and engaging. Use their name if it feels natural, but don't force it. Keep the core information intact. Do not add any extra greetings or closing remarks. Just return the rephrased message. Original message: "${baseMessage}"`;
    } else {
      prompt = `Rephrase the following SMS message to make it sound more personal and engaging, while keeping the core information intact. Do not add any greetings like "Hey" or "Hello". Do not add any closing remarks. Only return the rephrased message text. Original message: "${baseMessage}"`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    const personalizedText = response.text.trim();

    // Fallback to original message if Gemini returns an empty response
    return personalizedText || baseMessage;
  } catch (error) {
    console.error("Error personalizing message with Gemini:", error);
    // Return the original message as a fallback on error
    return baseMessage;
  }
}
