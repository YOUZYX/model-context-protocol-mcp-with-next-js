// NOTE: The import below works in Next.js Edge Runtime (Vercel). If you see a type error locally, it is safe to ignore for deployment.
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const { json, prompt } = await req.json();
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response('Missing Gemini API key', { status: 500 });
  }

  // Prepare the Gemini API request
  const geminiRes = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:streamGenerateContent?key=' + apiKey,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { parts: [{ text: `${prompt}\n\n${JSON.stringify(json, null, 2)}` }] }
        ]
      })
    }
  );

  if (!geminiRes.body) {
    return new Response('No response body from Gemini', { status: 500 });
  }

  // Stream Gemini's response as SSE
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // Type guard for geminiRes.body
      const body = geminiRes.body;
      if (!body) {
        controller.error('No response body from Gemini');
        return;
      }
      const reader = body.getReader();
      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += new TextDecoder().decode(value);
        // Gemini streams JSON objects separated by newlines
        let lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const obj = JSON.parse(line);
            const text = obj.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              controller.enqueue(encoder.encode(`data: ${text}\n\n`));
            }
          } catch (e) {
            // Ignore parse errors
          }
        }
      }
      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
} 