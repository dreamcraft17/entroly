import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { auth } from '@/lib/auth';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

const SYSTEM_PROMPT = `You are an expert icon designer creating custom SVG icons.

RULES:
1. Return ONLY valid SVG code
2. The SVG should be simple, clean, and scalable
3. Use a single viewBox of "0 0 24 24" for consistency
4. Keep stroke-width at 2 for outline style, or use fill for filled style
5. The SVG should be monochromatic (use "currentColor" for color inheritance)
6. No external dependencies or images
7. Keep the SVG minimal - under 2KB

Return ONLY the SVG code, nothing else.`;

export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { prompt, style = 'outline', color } = body;

        if (!prompt) {
            return NextResponse.json(
                { error: 'Prompt is required' },
                { status: 400 }
            );
        }

        const userPrompt = `Create an SVG icon for: ${prompt}

Style: ${style} (${style === 'outline' ? 'use strokes, no fill' : style === 'filled' ? 'use solid fills' : 'use both strokes and subtle fills'})
${color ? `Color hint: ${color} (but use currentColor in the actual SVG)` : ''}

The icon should be recognizable, modern, and suitable for a link-in-bio page.`;

        const model = genAI.getGenerativeModel({ model: 'gemini-3-pro-preview' });

        const result = await model.generateContent([
            { text: SYSTEM_PROMPT },
            { text: userPrompt }
        ]);

        let svg = result.response.text() || '';

        // Clean up response
        svg = svg
            .replace(/^```svg\n?/i, '')
            .replace(/^```xml\n?/i, '')
            .replace(/^```\n?/i, '')
            .replace(/\n?```$/i, '')
            .trim();

        // Basic SVG validation
        if (!svg.startsWith('<svg') || !svg.endsWith('</svg>')) {
            return NextResponse.json(
                { error: 'Invalid SVG generated' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            svg,
        });
    } catch (error) {
        console.error('AI Icon Generation Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate icon' },
            { status: 500 }
        );
    }
}
