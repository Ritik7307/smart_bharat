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

    // Strict input validation
    for (const msg of messages) {
      if (!msg.role || typeof msg.role !== 'string' || !['user', 'assistant', 'system'].includes(msg.role)) {
        return NextResponse.json({ error: 'Invalid message role' }, { status: 400 });
      }
      if (!msg.content || typeof msg.content !== 'string') {
        return NextResponse.json({ error: 'Invalid message content' }, { status: 400 });
      }
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'Service is temporarily unavailable due to configuration.' },
        { status: 500 }
      );
    }

    const currentLanguage = language || 'English';

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are Smart Bharat AI, an intelligent civic companion for the citizens of India. 
Your goal is to strictly help citizens access government services, understand complex public information, report civic issues, and provide recommendations for government schemes in India. 
You MUST NOT answer questions outside of civic, government, health, public utility, or community-related topics. If a user asks something unrelated (like coding, generic trivia, or inappropriate content), politely inform them that you can only assist with civic and government-related queries.
Always be polite, helpful, clear, and concise. Use simple language.
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
  } catch (error: unknown) {
    console.error('Groq API Error:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred while processing your request.' },
      { status: 500 }
    );
  }
}
