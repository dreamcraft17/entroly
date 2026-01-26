import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { auth } from '@/lib/auth';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

const SYSTEM_PROMPT = `You are an expert web designer creating beautiful, unique link-in-bio pages for creators.

IMPORTANT RULES:
1. Generate COMPLETE, self-contained HTML using Tailwind CSS classes
2. The HTML should be a full page layout (not wrapped in html/head/body tags - just the content)
3. Be CREATIVE - each page should be unique, not templated
4. Include modern design elements: gradients, shadows, animations, glassmorphism when appropriate
5. All CSS must use Tailwind classes - no custom CSS or style tags
6. For images, use these placeholder services:
   - Backgrounds: https://picsum.photos/1920/1080?random=1
   - Avatars: https://ui-avatars.com/api/?name=Creator&background=random&size=200
   - Assets: https://picsum.photos/400/300?random=2
7. Make the design responsive (mobile-first)
8. Include hover effects and micro-animations using Tailwind

STRUCTURE GUIDELINES:
- Wrap everything in a main container div with min-h-screen
- Use semantic sections for different content areas
- Each element should have a unique data-element-id attribute for editing
- Animations should use Tailwind's animate-* or transition classes

The user has COMPLETE CREATIVE FREEDOM:
- They may or may not want: avatar, username, bio, links, cards, carousels, galleries, testimonials
- Background can be: solid colors, gradients, patterns
- Any layout style is valid: single column, grid, bento, asymmetric
- Typography, colors, and spacing are fully customizable

DO NOT INCLUDE:
- Any copyright text or footer credits
- "Powered by" or "Made with" text
- Any branding or attribution

Return ONLY the HTML code, no explanations or markdown code blocks.`;

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
        const { prompt, profession, style, colorScheme, importedProfile } = body;

        if (!prompt && !importedProfile) {
            return NextResponse.json(
                { error: 'Prompt or imported profile is required' },
                { status: 400 }
            );
        }

        // Build imported profile section for the prompt
        let importedProfileSection = '';
        if (importedProfile) {
            const linksDescription = importedProfile.links
                .map((link: { title: string; url: string }) => `- ${link.title}: ${link.url}`)
                .join('\n');

            importedProfileSection = `
REFERENCE PROFILE TO RECREATE:
This user is importing their existing link-in-bio profile. Create a beautiful NEW design that keeps the same content but with a fresh, unique look.

Original Name: ${importedProfile.displayName || 'Not provided'}
Original Bio: ${importedProfile.bio || 'Not provided'}
Original Avatar URL: ${importedProfile.avatarUrl || 'Use placeholder'}

Links to include (IMPORTANT - include ALL of these links with proper styling):
${linksDescription || 'No links provided'}

The new design should:
- Keep ALL the links from the original profile with proper buttons
- Use the same display name and bio
- Apply the selected style and color scheme
- Make it look MORE professional and visually impressive than the original
`;
        }

        const userPrompt = `Create a stunning link-in-bio page for a creator:

CONTEXT: This is a LINK-IN-BIO profile page - a single-page website where creators share their links, social profiles, portfolio, and contact info with their audience. Think of it like Linktree, but more beautiful and customizable.
${importedProfileSection}
${prompt ? `ADDITIONAL INSTRUCTIONS FROM USER:\n${prompt}` : (importedProfile ? '' : 'ABOUT THE CREATOR:\nA creative professional who wants a modern, eye-catching link-in-bio page to share with their audience.')}

${profession ? `PROFESSION: ${profession}` : (importedProfile ? '' : 'PROFESSION: Content Creator / Digital Professional')}

STYLE PREFERENCE: ${style || 'modern'}
COLOR SCHEME: ${colorScheme || 'dark'}

${!importedProfile ? `MUST INCLUDE:
- A profile section (avatar placeholder, name, short bio)
- At least 3-5 link buttons with icons (social media, portfolio, contact, etc.)
- Proper hover effects and animations
- Mobile-responsive layout` : `MUST INCLUDE:
- Profile section with the provided name, bio, and avatar
- ALL the links listed above as styled buttons with hover effects
- Proper responsive layout
- Modern animations and visual effects`}

Generate a beautiful, creative, and unique link-in-bio page that helps this creator stand out. Make it visually impressive with modern design trends.`;

        const model = genAI.getGenerativeModel({ model: 'gemini-3-pro-preview' });

        const result = await model.generateContent([
            { text: SYSTEM_PROMPT },
            { text: userPrompt }
        ]);

        const generatedHtml = result.response.text() || '';

        // Clean up HTML if it has markdown code blocks
        let cleanHtml = generatedHtml
            .replace(/^```html\n?/i, '')
            .replace(/^```\n?/i, '')
            .replace(/\n?```$/i, '')
            .trim();

        // Generate a slug suggestion from the prompt
        const slugBase = prompt
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 30);
        const suggestedSlug = `${slugBase}-${Date.now().toString(36)}`;

        return NextResponse.json({
            html: cleanHtml,
            suggestedSlug,
        });
    } catch (error) {
        console.error('AI Generation Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate page' },
            { status: 500 }
        );
    }
}
