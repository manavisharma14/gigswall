// frontend/src/geminiClient.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDZbL0-y5_H01wLmzsGJipm9MI-xQ083ng");

export async function generateJobDescription(title, skills, timeline) {
  const prompt = `Write a clear and engaging freelance gig description for a job titled "${title}". 
  This gig is being posted by a student who wants to hire someone to complete this task. 
  Include what the task is about, what the person is expected to deliver, and any helpful context. 
  Mention the required skills: ${skills}, and the timeline: ${timeline} .  Don't talk about budget 
  Keep it informative and give important details.`;
  
  
  const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro-latest" });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
