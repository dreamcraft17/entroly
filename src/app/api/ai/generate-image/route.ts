import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

// Using free placeholder image services instead of DALL-E
// This provides high-quality images without API costs

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
        const { prompt, type = 'asset' } = body;

        if (!prompt) {
            return NextResponse.json(
                { error: 'Prompt is required' },
                { status: 400 }
            );
        }

        // Generate a random seed for consistent but unique images
        const seed = Date.now();

        let imageUrl: string;

        switch (type) {
            case 'background':
                // High-quality landscape background
                imageUrl = `https://picsum.photos/1920/1080?random=${seed}`;
                break;
            case 'avatar':
                // Use UI Avatars for profile pictures (can include name)
                const name = prompt.split(' ').slice(0, 2).join('+') || 'User';
                imageUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=200&bold=true&format=png`;
                break;
            case 'asset':
            default:
                // Square image for general assets
                imageUrl = `https://picsum.photos/400/400?random=${seed}`;
                break;
        }

        return NextResponse.json({
            imageUrl,
            note: 'Using free placeholder image service. For custom AI-generated images, add OpenAI billing.',
        });
    } catch (error) {
        console.error('Image Generation Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate image' },
            { status: 500 }
        );
    }
}
