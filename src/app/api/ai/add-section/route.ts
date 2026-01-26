import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { auth } from '@/lib/auth';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

const SYSTEM_PROMPT = `You are an expert web designer adding new sections to a link-in-bio page.

RULES:
1. You will receive the current page HTML and a request to add a new section
2. Add the new section at the specified position (top, bottom, or after a specific element)
3. The new section should match the existing page's design style and colors
4. Use Tailwind CSS classes only
5. Add a unique data-element-id attribute to the new section
6. Make the section visually consistent with the rest of the page
7. Include appropriate animations and hover effects
8. For any images, use placeholder services:
   - https://picsum.photos/WIDTH/HEIGHT?random=NUMBER
   - https://ui-avatars.com/api/?name=NAME&background=random

Return ONLY the complete updated HTML with the new section added, no explanations or markdown code blocks.`;

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
        const { fullPageHtml, sectionType, sectionPrompt, position = 'bottom' } = body;

        if (!fullPageHtml || !sectionPrompt) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const userPrompt = `CURRENT PAGE HTML:
\`\`\`html
${fullPageHtml}
\`\`\`

ADD NEW SECTION:
Type: ${sectionType || 'custom'}
Description: ${sectionPrompt}
Position: ${position}

Create and add this new section to the page. Make sure it:
- Matches the existing design language
- Has proper spacing and alignment
- Includes appropriate Tailwind classes for styling and animations
- Has a unique data-element-id attribute`;

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
        console.error('AI Add Section Error:', error);
        return NextResponse.json(
            { error: 'Failed to add section' },
            { status: 500 }
        );
    }
}
