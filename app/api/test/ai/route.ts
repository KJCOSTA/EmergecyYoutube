import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const { provider, model, apiKey, prompt } = await req.json();

    if (!provider || !model || !apiKey || !prompt) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let text = '';
    let metadata = {};

    switch (provider) {
      case 'google':
        try {
          const genAI = new GoogleGenerativeAI(apiKey);
          const aiModel = genAI.getGenerativeModel({ model });
          const result = await aiModel.generateContent(prompt);
          const response = await result.response;
          text = response.text();
        } catch (error) {
          console.error('Google AI Error:', error);
          return NextResponse.json({ error: 'Failed to generate content with Google AI', details: error.message }, { status: 500 });
        }
        break;

      case 'anthropic':
        try {
          const anthropic = new Anthropic({ apiKey });
          const msg = await anthropic.messages.create({
            model,
            max_tokens: 1024,
            messages: [{ role: 'user', content: prompt }],
          });
          text = msg.content[0].text;
        } catch (error) {
          console.error('Anthropic AI Error:', error);
          return NextResponse.json({ error: 'Failed to generate content with Anthropic AI', details: error.message }, { status: 500 });
        }
        break;

      case 'openai':
        try {
          const openai = new OpenAI({ apiKey });
          const completion = await openai.chat.completions.create({
            model,
            messages: [{ role: 'user', content: prompt }],
          });
          text = completion.choices[0].message.content;
        } catch (error) {
          console.error('OpenAI Error:', error);
          return NextResponse.json({ error: 'Failed to generate content with OpenAI', details: error.message }, { status: 500 });
        }
        break;

      default:
        return NextResponse.json({ error: 'Invalid provider' }, { status: 400 });
    }

    return NextResponse.json({
      provider,
      model,
      text,
      metadata,
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
