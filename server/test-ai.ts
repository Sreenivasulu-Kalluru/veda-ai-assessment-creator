import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function test() {
  try {
    console.log("Testing with API Key:", process.env.GEMINI_API_KEY?.substring(0, 10) + '...');
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'hello',
    });
    console.log("Success:", response.text);
  } catch (e: any) {
    console.error("Error Name:", e.name);
    console.error("Error Message:", e.message);
  }
}

test();
