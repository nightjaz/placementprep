import { NextRequest, NextResponse } from 'next/server';
import { generateGroqPrompt, getRandomRoast } from '@/lib/roast-generator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { missedDays = 1, currentStreak = 0, totalDebt = 0, dayNumber = 1 } = body;

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        roast: getRandomRoast(missedDays),
        source: 'fallback',
      });
    }

    const prompt = generateGroqPrompt({
      missedDays,
      currentStreak,
      totalDebt,
      dayNumber,
    });

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 150,
        temperature: 0.9,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Groq API error:', error);
      return NextResponse.json({
        roast: getRandomRoast(missedDays),
        source: 'fallback',
      });
    }

    const data = await response.json();
    const roast = data.choices[0]?.message?.content || getRandomRoast(missedDays);

    return NextResponse.json({
      roast,
      source: 'groq',
    });
  } catch (error) {
    console.error('Roast API error:', error);
    return NextResponse.json({
      roast: getRandomRoast(1),
      source: 'fallback',
    });
  }
}
