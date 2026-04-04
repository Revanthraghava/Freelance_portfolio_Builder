
import { GoogleGenAI } from "@google/genai";

const getApiKey = () => {
  try {
    return process.env.GEMINI_API_KEY || "";
  } catch {
    return "";
  }
};

export const generateBio = async (name: string, category: string, skills: string[], experience: string) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return `I am a ${category} specializing in ${skills.slice(0, 3).join(', ')}.`;
  }
  
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a professional, engaging portfolio bio for a ${category} named ${name}. 
                 Skills: ${skills.join(', ')}. 
                 Experience Level: ${experience}.
                 The bio should be 2-3 sentences, highlighting expertise and value. 
                 Return ONLY the bio text.`,
    });
    return response.text?.trim() || "";
  } catch (err) {
    console.error("Gemini Error:", err);
    return `I am a dedicated ${category} with expertise in ${skills.slice(0, 3).join(', ')}.`;
  }
};

export const generateTagline = async (name: string, category: string) => {
  const apiKey = getApiKey();
  if (!apiKey) return `Expert ${category}`;

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a punchy, one-sentence tagline for a ${category} named ${name}. Max 10 words. Return ONLY the tagline.`,
    });
    return response.text?.trim() || `Crafting excellence in ${category}.`;
  } catch (err) {
    console.error(err);
    return `Specializing in ${category}.`;
  }
};

export const recommendSkills = async (category: string) => {
  const apiKey = getApiKey();
  if (!apiKey) return ["Communication", "Problem Solving", "Time Management"];

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `List 8 essential technical and soft skills for a ${category}. Return ONLY a comma-separated list of skills.`,
    });
    const text = response.text?.trim() || "";
    return text.split(',').map(s => s.trim()).filter(s => s.length > 0);
  } catch (err) {
    console.error(err);
    return ["Creativity", "Technical Proficiency", "Collaboration"];
  }
};
