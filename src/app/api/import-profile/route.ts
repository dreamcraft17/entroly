import { NextRequest, NextResponse } from "next/server";

interface ImportedLink {
    title: string;
    url: string;
    icon: string;
}

interface ImportedProfile {
    displayName: string;
    bio: string;
    avatarUrl: string;
    links: ImportedLink[];
    source: 'linktree' | 'beacons' | 'unknown';
}

// Common social media icons mapping
const ICON_MAPPING: Record<string, string> = {
    'instagram': 'Instagram',
    'tiktok': 'Video',
    'twitter': 'Twitter',
    'x.com': 'Twitter',
    'youtube': 'Youtube',
    'spotify': 'Music',
    'soundcloud': 'Music',
    'apple': 'Music',
    'facebook': 'Facebook',
    'linkedin': 'Linkedin',
    'github': 'Github',
    'discord': 'MessageCircle',
    'twitch': 'Twitch',
    'pinterest': 'Pin',
    'snapchat': 'Ghost',
    'whatsapp': 'MessageCircle',
    'telegram': 'Send',
    'email': 'Mail',
    'mailto': 'Mail',
    'shop': 'ShoppingBag',
    'store': 'ShoppingBag',
    'merch': 'ShoppingBag',
    'patreon': 'Heart',
    'ko-fi': 'Coffee',
    'paypal': 'DollarSign',
    'venmo': 'DollarSign',
    'cashapp': 'DollarSign',
    'onlyfans': 'Lock',
    'website': 'Globe',
    'blog': 'FileText',
    'portfolio': 'Briefcase',
    'resume': 'FileText',
    'cv': 'FileText',
    'book': 'BookOpen',
    'podcast': 'Mic',
    'music': 'Music',
    'video': 'Video',
    'photo': 'Camera',
};

function guessIconFromUrl(url: string, title: string): string {
    const lowerUrl = url.toLowerCase();
    const lowerTitle = title.toLowerCase();

    for (const [keyword, icon] of Object.entries(ICON_MAPPING)) {
        if (lowerUrl.includes(keyword) || lowerTitle.includes(keyword)) {
            return icon;
        }
    }

    return 'Link';
}

async function scrapeLinktree(url: string): Promise<ImportedProfile> {
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch Linktree profile: ${response.status}`);
    }

    const html = await response.text();

    // Extract profile data from the HTML
    // Linktree stores data in a script tag with id="__NEXT_DATA__"
    const nextDataMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);

    let displayName = '';
    let bio = '';
    let avatarUrl = '';
    const links: ImportedLink[] = [];

    if (nextDataMatch) {
        try {
            const data = JSON.parse(nextDataMatch[1]);
            const account = data?.props?.pageProps?.account;

            if (account) {
                displayName = account.pageTitle || account.username || '';
                bio = account.description || '';
                avatarUrl = account.profilePictureUrl || '';

                const accountLinks = account.links || [];
                for (const link of accountLinks) {
                    if (link.url && link.title) {
                        links.push({
                            title: link.title,
                            url: link.url,
                            icon: guessIconFromUrl(link.url, link.title)
                        });
                    }
                }
            }
        } catch (e) {
            console.error('Failed to parse Linktree data:', e);
        }
    }

    // Fallback: try to extract from HTML if JSON parsing failed
    if (!displayName) {
        const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
        if (titleMatch) displayName = titleMatch[1].trim();
    }

    if (!bio) {
        const bioMatch = html.match(/<p[^>]*class="[^"]*description[^"]*"[^>]*>([^<]+)<\/p>/i);
        if (bioMatch) bio = bioMatch[1].trim();
    }

    if (!avatarUrl) {
        const avatarMatch = html.match(/<img[^>]*class="[^"]*profile[^"]*"[^>]*src="([^"]+)"/i);
        if (avatarMatch) avatarUrl = avatarMatch[1];
    }

    // Fallback link extraction from HTML
    if (links.length === 0) {
        const linkMatches = html.matchAll(/<a[^>]*href="(https?:\/\/[^"]+)"[^>]*>[\s\S]*?<p[^>]*>([^<]+)<\/p>/gi);
        for (const match of linkMatches) {
            const url = match[1];
            const title = match[2].trim();
            if (url && title && !url.includes('linktr.ee')) {
                links.push({
                    title,
                    url,
                    icon: guessIconFromUrl(url, title)
                });
            }
        }
    }

    return {
        displayName,
        bio,
        avatarUrl,
        links,
        source: 'linktree'
    };
}

async function scrapeBeacons(url: string): Promise<ImportedProfile> {
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch Beacons profile: ${response.status}`);
    }

    const html = await response.text();

    let displayName = '';
    let bio = '';
    let avatarUrl = '';
    const links: ImportedLink[] = [];

    // Try to extract from script data
    const scriptDataMatch = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
    if (scriptDataMatch) {
        try {
            const data = JSON.parse(scriptDataMatch[1]);
            if (data.name) displayName = data.name;
            if (data.description) bio = data.description;
            if (data.image) avatarUrl = data.image;
        } catch (e) {
            console.error('Failed to parse Beacons LD+JSON:', e);
        }
    }

    // Extract title from og:title or page title
    if (!displayName) {
        const ogTitleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]+)"/);
        if (ogTitleMatch) displayName = ogTitleMatch[1].split('|')[0].trim();
    }

    // Extract bio from og:description
    if (!bio) {
        const ogDescMatch = html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]+)"/);
        if (ogDescMatch) bio = ogDescMatch[1];
    }

    // Extract avatar from og:image
    if (!avatarUrl) {
        const ogImageMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/);
        if (ogImageMatch) avatarUrl = ogImageMatch[1];
    }

    // Extract links - Beacons uses various patterns
    // Look for link buttons
    const linkMatches = html.matchAll(/<a[^>]*href="(https?:\/\/[^"]+)"[^>]*>[\s\S]*?(?:<span[^>]*>([^<]+)<\/span>|<p[^>]*>([^<]+)<\/p>|>([^<]+)<)/gi);
    for (const match of linkMatches) {
        const url = match[1];
        const title = (match[2] || match[3] || match[4] || '').trim();
        if (url && title && !url.includes('beacons.ai') && title.length > 0 && title.length < 100) {
            // Avoid duplicate links
            if (!links.some(l => l.url === url)) {
                links.push({
                    title,
                    url,
                    icon: guessIconFromUrl(url, title)
                });
            }
        }
    }

    return {
        displayName,
        bio,
        avatarUrl,
        links,
        source: 'beacons'
    };
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { url } = body;

        if (!url || typeof url !== 'string') {
            return NextResponse.json(
                { error: 'URL is required' },
                { status: 400 }
            );
        }

        // Validate and determine the source
        const normalizedUrl = url.trim().toLowerCase();
        let profile: ImportedProfile;

        if (normalizedUrl.includes('linktr.ee') || normalizedUrl.includes('linktree.com')) {
            profile = await scrapeLinktree(url.trim());
        } else if (normalizedUrl.includes('beacons.ai')) {
            profile = await scrapeBeacons(url.trim());
        } else {
            return NextResponse.json(
                { error: 'Unsupported URL. Please enter a Linktree or Beacons.ai profile URL.' },
                { status: 400 }
            );
        }

        // Validate that we got some data
        if (!profile.displayName && !profile.bio && profile.links.length === 0) {
            return NextResponse.json(
                { error: 'Could not extract profile data from the provided URL. The profile may be private or the URL may be incorrect.' },
                { status: 404 }
            );
        }

        return NextResponse.json({ profile });

    } catch (error) {
        console.error('Import profile error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to import profile' },
            { status: 500 }
        );
    }
}
