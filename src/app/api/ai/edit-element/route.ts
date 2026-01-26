import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { auth } from '@/lib/auth';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

const SYSTEM_PROMPT = `You are an expert web designer editing specific elements in a link-in-bio page.

IMPORTANT RULES:
1. You will receive the FULL PAGE HTML and a SPECIFIC ELEMENT to edit
2. Apply the user's requested changes ONLY to the specified element
3. Return the COMPLETE page HTML with the element updated
4. Keep all other elements exactly as they were
5. Maintain all existing Tailwind CSS classes unless explicitly asked to change them
6. Preserve the data-element-id attributes
7. Ensure the edit is cohesive with the rest of the page design
8. For any new images, use placeholder services:
   - https://picsum.photos/WIDTH/HEIGHT?random=NUMBER
   - https://ui-avatars.com/api/?name=NAME&background=random

Return ONLY the complete updated HTML, no explanations or markdown code blocks.`;

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
        const { fullPageHtml, elementHtml, elementPath, editPrompt } = body;

        if (!fullPageHtml || !elementHtml || !editPrompt) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const userPrompt = `FULL PAGE HTML:
\`\`\`html
${fullPageHtml}
\`\`\`

ELEMENT TO EDIT (located at: ${elementPath || 'unspecified'}):
\`\`\`html
${elementHtml}
\`\`\`

USER'S EDIT REQUEST:
${editPrompt}

Apply the requested changes to ONLY this element and return the complete updated page HTML.`;

        const model = genAI.getGenerativeModel({ model: 'gemini-3-pro-preview' });

        const result = await model.generateContent([
            { text: SYSTEM_PROMPT },
            { text: userPrompt }
        ]);

        const updatedHtml = result.response.text() || '';

        // Clean up HTML if it has markdown code blocks
        let cleanHtml = updatedHtml
            .replace(/^```html\n?/i, '')
            .replace(/^```\n?/i, '')
            .replace(/\n?```$/i, '')
            .trim();

        return NextResponse.json({
            updatedHtml: cleanHtml,
        });
    } catch (error) {
        console.error('AI Edit Element Error:', error);
        return NextResponse.json(
            { error: 'Failed to edit element' },
            { status: 500 }
        );
    }
}
