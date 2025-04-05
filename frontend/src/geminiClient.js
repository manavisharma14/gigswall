// frontend/src/geminiClient.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDZbL0-y5_H01wLmzsGJipm9MI-xQ083ng");

export async function generateJobDescription(title, skills, timeline) {
  const prompt = `Write a student freelance gig description for a job titled "${title}". Required skills: ${skills}. Timeline: ${timeline}. Keep it clear and engaging.`;

  const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro-latest" });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
