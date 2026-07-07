import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages, language } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'Groq API key not configured. Please add GROQ_API_KEY to your .env.local file.' },
        { status: 500 }
      );
    }

    const currentLanguage = language || 'English';

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are Smart Bharat AI, an intelligent civic companion for the citizens of India. 
Your goal is to help citizens access government services, understand complex public information, report civic issues, and provide recommendations for government schemes. 
Always be polite, helpful, clear, and concise. Use simple language that is easy for anyone to understand. If asked about how to report an issue, explain the process clearly. If asked about documents, list them out neatly.
IMPORTANT: You MUST respond in ${currentLanguage}.`
        },
        ...messages,
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1024,
    });

    const reply = chatCompletion.choices[0]?.message?.content || "I'm sorry, I couldn't process your request at the moment.";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('Groq API Error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during your request.' },
      { status: 500 }
    );
  }
}
