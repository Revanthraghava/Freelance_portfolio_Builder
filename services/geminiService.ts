
import { GoogleGenAI, Type } from "@google/genai";

// The Google GenAI SDK client must be initialized with the API key from process.env.API_KEY.
// Note: In a Netlify environment, this variable is usually injected at build time.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const polishBio = async (bio: string, category: string, name: string) => {
  // Guard against missing API key to prevent runtime errors in the browser.
  if (!process.env.API_KEY) {
    console.warn("Gemini API Key is missing. Check your environment variables.");
    return bio;
  }
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `I am a ${category} freelancer named ${name}. Here is a draft of my bio: "${bio}". 
                 Please polish this into a professional, engaging, and concise portfolio "About Me" section (2-3 sentences max). 
                 Focus on tone and impact. Return ONLY the polished text.`,
    });
    return response.text?.trim() || bio;
  } catch (error) {
    console.error("Gemini Error:", error);
    return bio;
  }
};

export const generateTagline = async (name: string, category: string, skills: string[]) => {
  if (!process.env.API_KEY) {
    return `Specializing in ${category}.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a punchy, ultra-professional one-sentence tagline for a ${category} freelancer named ${name}. 
                 Include these skills if relevant: ${skills.join(', ')}. 
                 Max 10 words. Return ONLY the tagline.`,
    });
    return response.text?.trim() || `Crafting excellence in ${category}.`;
  } catch (error) {
    console.error("Gemini Error:", error);
    return `Specializing in ${category}.`;
  }
};
