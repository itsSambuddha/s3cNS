import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY || '',
})

const SYSTEM_PROMPT = `
You are a summariser for the SECMUN Help & Docs page.

You receive ONLY the text content of the current help page.
Your job is to produce a brief, clear summary (3–5 sentences) of what the platform modules do.

Rules:
- Do not answer questions beyond this page.
- Do not invent extra features that are not mentioned in the text.
- If asked anything else, say: "I only summarise the Help & Docs page."
`

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { text } = body as { text?: string }

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Missing text' }, { status: 400 })
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // or 'gemini-1.5-flash' if you prefer
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: SYSTEM_PROMPT + '\n\nHelp page content:\n' + text,
            },
          ],
        },
      ],
    })

    const summary = response.text

    return NextResponse.json({ summary })
  } catch (err: any) {
    console.error('docs summary error', err?.message ?? err)
    return NextResponse.json(
      { error: 'Failed to summarise Help & Docs' },
      { status: 500 },
    )
  }
}
