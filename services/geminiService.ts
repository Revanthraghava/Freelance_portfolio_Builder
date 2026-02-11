
import { GoogleGenAI } from "@google/genai";

// Access the API key from process.env. In Vite, this is often polyfilled via define.
const getApiKey = () => {
  try {
    return process.env.API_KEY || "";
  } catch (e) {
    return "";
  }
};

export const polishBio = async (bio: string, category: string, name: string) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn("Gemini API Key is missing. Check your environment variables.");
    return bio;
  }
  
  const ai = new GoogleGenAI({ apiKey });
  
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
  const apiKey = getApiKey();
  if (!apiKey) {
    return `Specializing in ${category}.`;
  }

  const ai = new GoogleGenAI({ apiKey });

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
