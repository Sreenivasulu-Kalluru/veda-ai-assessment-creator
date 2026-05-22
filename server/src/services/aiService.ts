import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateQuestionPaper = async (promptData: any): Promise<any> => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('CRITICAL ERROR: GEMINI_API_KEY is missing in your production environment variables! Please add it in your Render dashboard.');
  }

  const { topic, totalQuestions, totalMarks, instructions, questionTypes } = promptData;

  const prompt = `
    You are an expert teacher. Create a question paper based on the following requirements:
    Topic/Context: ${topic || 'General Knowledge'}
    Total Questions: ${totalQuestions}
    Total Marks: ${totalMarks}
    Instructions: ${instructions || 'None'}
    Distribution: ${JSON.stringify(questionTypes)}

    Generate a structured JSON response.
    The JSON should have a "sections" array. Each section should have:
    - "title": (e.g., "Section A")
    - "instruction": (e.g., "Attempt all short answer questions")
    - "questions": an array of objects with:
      - "text": The actual question text
      - "difficulty": strictly one of ["Easy", "Moderate", "Hard"]
      - "marks": number of marks for this question

    Ensure the total marks and number of questions perfectly match the requested values.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    let text = response.text || "{}";
    
    if (text.includes('```')) {
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    }
    
    return JSON.parse(text);
  } catch (error: any) {
    console.error('AI Generation Error:', error);
    throw new Error(error.message || 'Failed to generate content from AI');
  }
};
