import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { auth } from '@/lib/auth';
import { chromium, type Browser } from 'playwright-core';

import { Profile, Link } from '@/types';


const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

interface ImportedLink {
    title: string;
    url: string;
    thumbnail?: string;
}

interface LinktreeData {
    displayName: string;
    bio: string;
    avatarUrl: string;
    links: ImportedLink[];
    standardLinks: ImportedLink[];
    socialLinks: ImportedLink[];
    theme?: {
        background?: string;
        backgroundImage?: string;
        buttonStyle?: string;
        themeType?: string;
        colors?: Record<string, string>;
    };
}

// Helper function to extract a title from a URL when title is not provided
function extractTitleFromUrl(url: string): string {
    try {
        const urlObj = new URL(url);
        // Get the hostname without www
        const host = urlObj.hostname.replace(/^www\./, '');
        // Capitalize first letter
        return host.charAt(0).toUpperCase() + host.slice(1);
    } catch {
        return 'Link';
    }
}

// Scrape Linktree using Playwright - capture FULL HTML with computed styles AND screenshot
async function scrapeWithPlaywright(url: string): Promise<LinktreeData & { fullHtml: string; screenshot: Buffer }> {
    let browser: Browser | null = null;

    try {
        // Launch headless Chromium
        browser = await chromium.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            viewport: { width: 680, height: 1200 } // Mobile-like viewport for Linktree
        });

        const page = await context.newPage();

        // Navigate and wait for content to load
        await page.goto(url, {
            waitUntil: 'networkidle',
            timeout: 30000
        });

        // Wait for profile content to be visible
        await page.waitForSelector('h1', { timeout: 10000 }).catch(() => { });

        // Scroll to load all dynamically loaded content
        let previousHeight = 0;
        let scrollAttempts = 0;
        const maxScrollAttempts = 5;

        while (scrollAttempts < maxScrollAttempts) {
            const currentHeight = await page.evaluate(() => document.body.scrollHeight);
            if (currentHeight === previousHeight) {
                break;
            }
            previousHeight = currentHeight;
            await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
            await page.waitForTimeout(500);
            scrollAttempts++;
        }

        // Scroll back to top
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(1000);

        // Capture full page screenshot for Gemini Vision analysis
        const screenshot = await page.screenshot({ fullPage: true, type: 'png' });

        // Extract the FULL rendered HTML with inline computed styles
        const extractedData = await page.evaluate(() => {
            // Helper: Get computed styles as inline style string
            function getComputedStyleString(element: Element): string {
                const computed = window.getComputedStyle(element);
                const important = [
                    'background', 'background-color', 'background-image', 'background-size',
                    'color', 'font-family', 'font-size', 'font-weight', 'line-height',
                    'padding', 'margin', 'border', 'border-radius', 'box-shadow',
                    'display', 'flex-direction', 'justify-content', 'align-items', 'gap',
                    'width', 'max-width', 'min-height', 'height',
                    'text-align', 'text-decoration', 'letter-spacing',
                    'position', 'top', 'left', 'right', 'bottom',
                    'opacity', 'transform', 'transition', 'backdrop-filter',
                    'overflow', 'z-index'
                ];

                const styles: string[] = [];
                for (const prop of important) {
                    const value = computed.getPropertyValue(prop);
                    if (value && value !== 'none' && value !== 'normal' && value !== 'auto' && value !== '0px') {
                        styles.push(`${prop}: ${value}`);
                    }
                }
                return styles.join('; ');
            }

            // Helper: Clone element with inline styles
            function cloneWithStyles(element: Element): string {
                const clone = element.cloneNode(false) as HTMLElement;
                const styles = getComputedStyleString(element);
                if (styles) {
                    clone.setAttribute('style', styles);
                }

                // Process children
                for (const child of element.children) {
                    const childHtml = cloneWithStyles(child);
                    clone.innerHTML += childHtml;
                }

                // Add text content if no children
                if (element.children.length === 0 && element.textContent) {
                    clone.textContent = element.textContent;
                }

                return clone.outerHTML;
            }

            // Get profile info
            const h1 = document.querySelector('h1');
            const displayName = h1?.textContent?.trim().replace('@', '') || '';

            // Get bio from h2 or first meaningful paragraph
            let bio = '';
            const h2Elements = document.querySelectorAll('h2');
            for (const h2 of h2Elements) {
                const text = h2.textContent?.trim() || '';
                if (text.length > 5 && text.length < 500 && !text.includes('©')) {
                    bio = text;
                    break;
                }
            }
            if (!bio) {
                const pElements = document.querySelectorAll('p');
                for (const p of pElements) {
                    const text = p.textContent?.trim() || '';
                    if (text.length > 5 && text.length < 500 && !text.includes('©') && !text.includes('Privacy')) {
                        bio = text;
                        break;
                    }
                }
            }

            // Get avatar
            const avatarImg = document.querySelector('img[src*="profile"], img[alt*="profile"]') as HTMLImageElement;
            const avatarUrl = avatarImg?.src || '';

            // Extract all links with comprehensive title detection
            const links: { title: string; url: string; thumbnail?: string }[] = [];
            const standardLinks: { title: string; url: string; thumbnail?: string }[] = [];
            const socialLinks: { title: string; url: string; thumbnail?: string }[] = [];
            const seenUrls = new Set<string>();
            const allAnchors = document.querySelectorAll('a[href]');

            for (const anchor of allAnchors) {
                const href = anchor.getAttribute('href') || '';

                // Skip internal Linktree links and utility links
                if (!href ||
                    href.startsWith('#') ||
                    href.includes('linktr.ee') ||
                    href.includes('linktree.com') ||
                    href.includes('privacy') ||
                    href.includes('report') ||
                    href.includes('register') ||
                    href.includes('discover') ||
                    seenUrls.has(href)) {
                    continue;
                }

                // Determine if it's a social icon or standard link
                let isSocial = false;
                let current = anchor.parentElement;

                // Check up to 5 levels up for context
                for (let i = 0; i < 5 && current; i++) {
                    const className = (current.className || '').toString();
                    if (className.includes('SocialLinks') || className.includes('Header') || (className.includes('flex') && className.includes('justify-center') && anchor.querySelector('svg'))) { isSocial = true; break; }
                    if (className.includes('LinkContainer') || className.includes('StyledButton')) { isSocial = false; break; }
                    current = current.parentElement;
                }
                if (anchor.querySelector('svg') && !anchor.querySelector('p') && !anchor.querySelector('span')) isSocial = true;

                // Try multiple methods to get the title
                let title = '';

                // Method 1: Look for p or span elements inside
                const innerP = anchor.querySelector('p');
                const innerSpan = anchor.querySelector('span');

                if (innerP?.textContent?.trim()) {
                    title = innerP.textContent.trim();
                } else if (innerSpan?.textContent?.trim() && innerSpan.textContent.trim().length > 2) {
                    title = innerSpan.textContent.trim();
                }

                // Method 2: aria-label
                if (!title) {
                    title = anchor.getAttribute('aria-label') || '';
                }

                // Method 3: Direct text content (if not too long)
                if (!title) {
                    const directText = anchor.textContent?.trim() || '';
                    if (directText.length > 2 && directText.length < 100) {
                        title = directText;
                    }
                }

                // Method 4: Extract from URL if still no title
                if (!title || title.length < 2) {
                    try {
                        const urlObj = new URL(href);
                        const hostname = urlObj.hostname.replace('www.', '');
                        // Capitalize first letter
                        title = hostname.charAt(0).toUpperCase() + hostname.slice(1);
                    } catch {
                        title = 'Link';
                    }
                }

                // Check for thumbnail image
                const thumbnailImg = anchor.querySelector('img') as HTMLImageElement;
                const thumbnail = thumbnailImg?.src || undefined;

                // Clean up title
                title = title.replace(/\s+/g, ' ').trim();

                // Add link if we got a valid title
                if (title && title.length > 1) {
                    const linkObj = { title, url: href, thumbnail };
                    if (isSocial) socialLinks.push(linkObj);
                    else standardLinks.push(linkObj);

                    links.push(linkObj);
                    seenUrls.add(href);
                }
            }

            // Sort: social icons (shorter hrefs) last, main links first
            links.sort((a, b) => b.url.length - a.url.length);

            // Get the FULL body HTML with inline styles
            const bodyElement = document.body;
            const fullHtml = cloneWithStyles(bodyElement);

            // Also get all stylesheets content
            let cssContent = '';
            const styleSheets = document.styleSheets;
            for (let i = 0; i < styleSheets.length; i++) {
                try {
                    const rules = styleSheets[i].cssRules;
                    for (let j = 0; j < rules.length; j++) {
                        cssContent += rules[j].cssText + '\n';
                    }
                } catch (e) {
                    // Cross-origin stylesheet, skip
                }
            }

            return {
                displayName,
                bio,
                avatarUrl,
                links,
                standardLinks,
                socialLinks,
                fullHtml,
                cssContent
            };
        });

        await browser.close();
        browser = null;

        return {
            displayName: extractedData.displayName,
            bio: extractedData.bio,
            avatarUrl: extractedData.avatarUrl,
            links: extractedData.links,
            standardLinks: extractedData.standardLinks,
            socialLinks: extractedData.socialLinks,
            fullHtml: extractedData.fullHtml,
            screenshot,
            theme: {}
        };

    } catch (error) {
        console.error('Playwright scraping error:', error);
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

const CONVERSION_PROMPT = `You are a database migration expert. Your task is to extract profile data from Linktree HTML and convert it into a STRUCTURED JSON format matching our database schema.

I will provide:
1. Full HTML of the Linktree profile (with computed styles).
2. Extracted metadata.

YOUR TASK:
Return a JSON object matching this schema:

{
  displayName: string,
  username: string, // derive from URL or name
  bio: string,
  avatarUrl: string,
  
  // Theme Detection - CRITICAL
  backgroundType: 'solid' | 'gradient' | 'image',
  backgroundColor: string, // hex or rgba
  backgroundGradient?: string, // FULL CSS gradient string e.g. "linear-gradient(to bottom, #000000, #434343)"
  backgroundImage?: string, // URL if image background
  
  // Typography match
  fontFamily: 'Inter' | 'Space Grotesk', // Default to Space Grotesk if bold/modern/display, Inter if clean/simple
  
  // Colors (Extract exact colors)
  profileTextColor: string,
  profileAccentColor: string,
  profileBioColor: string,
  
  // Avatar
  avatarBorderColor: string, // default transparent
  avatarBorderWidth: number, // 0-4
  
  // Button Styling (Global) - LOOK FOR SPECIFIC STYLES
  linkButtonStyle: 'rounded' | 'square' | 'pill', // Detect border-radius: 0px -> square, 50%/9999px -> pill, anything else -> rounded
  linkButtonColor: string, // background color - CAPTURE RGBA for transparency!
  linkButtonTextColor: string,
  linkButtonBorder: 'none' | 'solid' | 'gradient',
  linkButtonBorderColor: string,
  linkButtonBorderWidth: number, // Detect border width
  linkButtonShadow: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'hard',
  linkButtonShadowColor: string, // Color of shadow
  linkButtonAnimation: 'scale' | 'slide' | 'glow' | 'none',
  
  // Links
  links: Array<{
    title: string,
    url: string,
    icon?: string, // only if social icon row
    type: 'classic' | 'icon', // 'icon' for small social icons ROW, 'classic' for main buttons
    thumbnail?: string, // URL if present in button
    // Override styles if this specific link looks different (e.g. highlight)
    buttonColor?: string,
    textColor?: string
  }>
}

CRITICAL RULES:
1. **Backgrounds**: If you see a gradient in the body or main container, set backgroundType='gradient' and put the FULL gradient string in backgroundGradient.
2. **Glassmorphism**: If buttons have semi-transparent backgrounds (rgba) or backdrop-filter, ensure linkButtonColor is the RGBA value (e.g., "rgba(255, 255, 255, 0.2)").
3. **Neo-Brutalism**: If buttons have black borders (2px+) and hard black shadows (offset), set linkButtonShadow='hard', linkButtonShadowColor='#000000', linkButtonBorder='solid', linkButtonBorderWidth=2.
4. **Shadows**: Look for box-shadow. If loose/diffuse -> 'lg'/'xl'. If solid offset -> 'hard'.
5. **Social Icons**: If there is a row of small icons (Instagram, TikTok, etc.) separate from main buttons, set their type='icon'. Main buttons are type='classic'.
6. **Links**: Include ALL links. Do not skip duplicates.
7. **Refinement**: If the profile looks "Clean" use 'Inter'. If it looks "Bold" or "Edgy" use 'Space Grotesk'.
8. **Output**: RETURN JSON ONLY. No markdown formatted blocks.
`;

async function scrapeLinktreeFull(url: string): Promise<{ data: LinktreeData; rawHtml: string }> {
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch Linktree profile: ${response.status}`);
    }

    const html = await response.text();

    // Extract profile data from __NEXT_DATA__
    const nextDataMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);

    let displayName = '';
    let bio = '';
    let avatarUrl = '';
    const links: ImportedLink[] = [];
    let theme: LinktreeData['theme'] = {};

    if (nextDataMatch) {
        try {
            const data = JSON.parse(nextDataMatch[1]);
            const account = data?.props?.pageProps?.account;

            if (account) {
                displayName = account.pageTitle || account.username || '';
                bio = account.description || '';
                avatarUrl = account.profilePictureUrl || '';

                // Extract theme/styling information
                if (account.theme) {
                    theme = {
                        background: account.theme.background || account.theme.backgroundGradient,
                        buttonStyle: account.theme.buttonStyle,
                        colors: account.theme.colors || {}
                    };
                }

                // Extract links - handle various formats
                const accountLinks = account.links || [];
                for (const link of accountLinks) {
                    // Handle regular links
                    if (link.url) {
                        const title = link.title || link.name || link.label || extractTitleFromUrl(link.url);
                        if (title) {
                            links.push({ title, url: link.url });
                        }
                    }
                    // Handle gallery/carousel items
                    if (link.items && Array.isArray(link.items)) {
                        for (const item of link.items) {
                            if (item.url) {
                                const itemTitle = item.title || item.name || item.label || extractTitleFromUrl(item.url);
                                if (itemTitle) {
                                    links.push({ title: itemTitle, url: item.url });
                                }
                            }
                        }
                    }
                }

                // Also check for socialLinks (social media icons at bottom)
                const socialLinks = account.socialLinks || [];
                for (const social of socialLinks) {
                    if (social.url) {
                        const platform = social.type || social.platform || 'Social Link';
                        links.push({
                            title: platform.charAt(0).toUpperCase() + platform.slice(1),
                            url: social.url
                        });
                    }
                }
            }
        } catch (e) {
            console.error('Failed to parse Linktree data:', e);
        }
    }

    // Fallback extraction from HTML
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

    // Enhanced link extraction from HTML (fallback or supplement)
    if (links.length < 3) {
        const seen = new Set(links.map(l => l.url));

        // Pattern 1: Links with data attributes (Linktree uses data-testid for links)
        const dataLinkMatches = html.matchAll(/<a[^>]*data-testid="[^"]*LinkButton[^"]*"[^>]*href="([^"]+)"[^>]*>[\s\S]*?<p[^>]*>([^<]+)<\/p>/gi);
        for (const match of dataLinkMatches) {
            const url = match[1];
            const title = match[2].trim();
            if (url && title && !url.includes('linktr.ee') && !seen.has(url)) {
                links.push({ title, url });
                seen.add(url);
            }
        }

        // Pattern 2: General anchor tags with paragraph titles
        const linkMatches = html.matchAll(/<a[^>]*href="(https?:\/\/[^"]+)"[^>]*>[\s\S]*?<p[^>]*>([^<]+)<\/p>/gi);
        for (const match of linkMatches) {
            const url = match[1];
            const title = match[2].trim();
            if (url && title && !url.includes('linktr.ee') && !seen.has(url)) {
                links.push({ title, url });
                seen.add(url);
            }
        }

        // Pattern 3: Look for links with aria-label
        const ariaLinkMatches = html.matchAll(/<a[^>]*href="(https?:\/\/[^"]+)"[^>]*aria-label="([^"]+)"/gi);
        for (const match of ariaLinkMatches) {
            const url = match[1];
            const title = match[2].trim();
            if (url && title && !url.includes('linktr.ee') && !seen.has(url)) {
                links.push({ title, url });
                seen.add(url);
            }
        }

        // Pattern 4: Look for external links with span titles
        const spanLinkMatches = html.matchAll(/<a[^>]*href="(https?:\/\/[^"]+)"[^>]*>[\s\S]*?<span[^>]*>([^<]+)<\/span>/gi);
        for (const match of spanLinkMatches) {
            const url = match[1];
            const title = match[2].trim();
            // Skip short titles (likely icons) and internal links
            if (url && title && title.length > 3 && !url.includes('linktr.ee') && !seen.has(url)) {
                links.push({ title, url });
                seen.add(url);
            }
        }
    }

    return {
        data: {
            displayName,
            bio,
            avatarUrl,
            links,
            standardLinks: links,
            socialLinks: [],
            theme
        },
        rawHtml: html
    };
}

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
        let { url } = body;

        if (!url || typeof url !== 'string') {
            return NextResponse.json(
                { error: 'URL is required' },
                { status: 400 }
            );
        }

        // Normalize URL - handle various input formats
        url = url.trim();

        // Detect platform from URL
        const isBeacons = url.includes('beacons.ai') || url.includes('beacons.page');
        const isLinktree = url.includes('linktr.ee') || url.includes('linktree.com');

        // If just a username (no dots or slashes), we need to ask which platform
        // For now, default to Linktree for backwards compatibility
        if (!url.includes('.') && !url.includes('/')) {
            url = `https://linktr.ee/${url}`;
        }
        // If has beacons.ai but no protocol
        else if (url.includes('beacons.ai') && !url.startsWith('http')) {
            url = `https://${url}`;
        }
        // If has linktr.ee but no protocol
        else if (url.includes('linktr.ee') && !url.startsWith('http')) {
            url = `https://${url}`;
        }
        // If starts with just "www."
        else if (url.startsWith('www.')) {
            url = `https://${url}`;
        }
        // If no protocol at all but has a domain
        else if (!url.startsWith('http') && url.includes('.')) {
            url = `https://${url}`;
        }

        const normalizedUrl = url.toLowerCase();
        const isSupportedPlatform =
            normalizedUrl.includes('linktr.ee') ||
            normalizedUrl.includes('linktree.com') ||
            normalizedUrl.includes('beacons.ai') ||
            normalizedUrl.includes('beacons.page');

        if (!isSupportedPlatform) {
            return NextResponse.json(
                { error: 'Please enter a valid Linktree or Beacons.ai URL' },
                { status: 400 }
            );
        }

        // Determine platform for logging
        const platform = normalizedUrl.includes('beacons') ? 'Beacons.ai' : 'Linktree';

        // Use Playwright to capture the full rendered HTML with styles
        let fullHtml = '';
        let cssContent = '';
        let displayName = '';

        try {
            console.log(`Attempting ${platform} scraping for raw HTML...`, url);
            const playwrightResult = await scrapeWithPlaywrightRaw(url);
            fullHtml = playwrightResult.fullHtml;
            cssContent = playwrightResult.cssContent;
            displayName = playwrightResult.displayName;
            console.log(`${platform} captured HTML (${fullHtml.length} chars) and CSS (${cssContent.length} chars)`);
        } catch (playwrightError) {
            console.error(`${platform} scraping failed:`, playwrightError);
            return NextResponse.json(
                { error: `Failed to capture the ${platform} page. Please try again.` },
                { status: 500 }
            );
        }

        if (!fullHtml || fullHtml.length < 100) {
            return NextResponse.json(
                { error: 'Could not extract page content. The profile may be private or the URL incorrect.' },
                { status: 404 }
            );
        }

        // Generate a slug from the username in the URL (support both platforms)
        let usernameMatch = url.match(/linktr\.ee\/([^/?#]+)/i);
        if (!usernameMatch) {
            usernameMatch = url.match(/beacons\.ai\/([^/?#]+)/i);
        }
        const username = usernameMatch ? usernameMatch[1] : 'profile';
        const suggestedSlug = `${username.toLowerCase().replace(/[^a-z0-9-]/g, '')}-${Date.now().toString(36)}`;

        return NextResponse.json({
            html: fullHtml,
            css: cssContent,
            suggestedSlug,
            sourceUrl: url,
            displayName: displayName || username,
            sourceType: 'clone',
            platform
        });

    } catch (error) {
        console.error('Clone Linktree Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to clone profile' },
            { status: 500 }
        );
    }
}

// Simplified Playwright scraper that captures the full visual appearance
async function scrapeWithPlaywrightRaw(url: string): Promise<{ fullHtml: string; cssContent: string; displayName: string }> {
    let browser: Browser | null = null;

    try {
        browser = await chromium.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-blink-features=AutomationControlled',
                '--disable-infobars',
            ]
        });

        const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            viewport: { width: 1920, height: 1080 },
            locale: 'en-US',
            timezoneId: 'America/New_York',
            extraHTTPHeaders: {
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
            },
            javaScriptEnabled: true,
        });

        const page = await context.newPage();

        // Collect CSS from network requests
        const collectedCss: string[] = [];

        page.on('response', async (response) => {
            try {
                const contentType = response.headers()['content-type'] || '';
                const url = response.url();
                if (contentType.includes('text/css') || url.endsWith('.css')) {
                    const css = await response.text();
                    collectedCss.push(`/* From: ${url} */\n${css}`);
                }
            } catch {
                // Ignore errors from failed responses
            }
        });

        await page.goto(url, {
            waitUntil: 'networkidle',
            timeout: 30000
        });

        // Wait for content to fully load
        await page.waitForSelector('h1', { timeout: 10000 }).catch(() => { });
        await page.waitForTimeout(3000);


        // Normalize all image URLs to absolute and convert profile images to data URLs
        await page.evaluate(async () => {
            // Helper function to convert image to data URL
            const toDataURL = (img: HTMLImageElement): Promise<string> => {
                return new Promise((resolve) => {
                    if (!img.complete) {
                        img.onload = () => resolve(toDataURL(img));
                        return;
                    }
                    try {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.naturalWidth || img.width;
                        canvas.height = img.naturalHeight || img.height;
                        const ctx = canvas.getContext('2d');
                        if (ctx && canvas.width > 0 && canvas.height > 0) {
                            ctx.drawImage(img, 0, 0);
                            resolve(canvas.toDataURL('image/png'));
                        } else {
                            resolve(img.src);
                        }
                    } catch {
                        resolve(img.src);
                    }
                });
            };

            // Convert all images to absolute URLs, and profile images to data URLs
            const images = document.querySelectorAll('img');
            for (const img of images) {
                // Handle lazy-loaded images
                const lazySrc = img.getAttribute('data-src') || img.getAttribute('data-lazy-src');
                if (lazySrc && !img.src) {
                    img.src = lazySrc;
                }

                // Check if this is a profile picture (usually in header/avatar areas)
                const isProfileImg = img.closest('[class*="profile"]') ||
                    img.closest('[class*="avatar"]') ||
                    img.closest('[data-testid*="avatar"]') ||
                    img.closest('[data-testid*="profile"]') ||
                    (img.width < 200 && img.height < 200 && img.src.includes('ugc'));

                if (isProfileImg && img.complete && img.naturalWidth > 0) {
                    try {
                        const dataUrl = await toDataURL(img);
                        if (dataUrl.startsWith('data:')) {
                            img.setAttribute('src', dataUrl);
                            img.removeAttribute('srcset');
                        }
                    } catch {
                        // Keep original src if conversion fails
                        if (img.src) {
                            img.setAttribute('src', img.src);
                        }
                    }
                } else if (img.src) {
                    // Ensure src is absolute
                    img.setAttribute('src', img.src);
                }

                // Handle srcset
                if (img.srcset) {
                    img.setAttribute('srcset', img.srcset);
                }
            }
        });

        // Remove Linktree footer section (parent of #profile-footer)
        await page.evaluate(() => {
            const footer = document.getElementById('profile-footer');
            if (footer && footer.parentElement) {
                footer.parentElement.remove();
            }

            // Remove "View on mobile" QR code section (find <p> with text, then remove parent)
            const allP = document.querySelectorAll('p');
            for (const p of allP) {
                if (p.textContent?.trim() === 'View on mobile' && p.parentElement) {
                    p.parentElement.remove();
                    break;
                }
            }

            // Remove topbar-buttons div
            const topbarButtons = document.getElementById('topbar-buttons');
            if (topbarButtons) {
                topbarButtons.remove();
            }

            // Clear all children inside TopBar (Entro.ly branding will be injected at render time)
            const topBar = document.getElementById('TopBar');
            if (topBar) {
                topBar.innerHTML = '';
            }
        });

        // Get page content including full HTML
        const { fullPageHtml, displayName, headContent, backgroundStyles } = await page.evaluate(() => {
            const h1 = document.querySelector('h1');
            const displayName = h1?.textContent?.trim() || '';

            // Get the full page HTML
            const fullPageHtml = document.documentElement.outerHTML;

            // Get inline style tags content
            const styleTags = Array.from(document.querySelectorAll('style'));
            const styleTagContent = styleTags.map(s => s.textContent || '').join('\n');

            // IMPORTANT: Also capture dynamically injected CSS rules from document.styleSheets
            // This captures Styled Components and other JS-injected CSS that doesn't appear in textContent
            const dynamicCss: string[] = [];
            try {
                for (const sheet of Array.from(document.styleSheets)) {
                    try {
                        // Skip external stylesheets (CORS blocked)
                        if (sheet.href && !sheet.href.includes(window.location.origin)) continue;

                        const rules = sheet.cssRules || sheet.rules;
                        if (rules) {
                            for (const rule of Array.from(rules)) {
                                // Only include rules that aren't already in textContent
                                const cssText = rule.cssText;
                                // Avoid duplicates by checking if the selector is already in style tags
                                if (cssText && !styleTagContent.includes(cssText.substring(0, 50))) {
                                    dynamicCss.push(cssText);
                                }
                            }
                        }
                    } catch {
                        // Skip sheets that throw SecurityError (external stylesheets)
                    }
                }
            } catch {
                // Ignore styleSheet access errors
            }

            const headContent = styleTagContent + '\n/* Dynamic CSS Rules */\n' + dynamicCss.join('\n');

            // Extract computed styles for background-related elements
            const bgStyles: string[] = [];

            // Find elements with background images or specific background IDs
            const bgElements = [
                document.getElementById('profile-background'),
                document.getElementById('profile-backdrop'),
                ...Array.from(document.querySelectorAll('*')).filter(el => {
                    const style = window.getComputedStyle(el);
                    return style.backgroundImage !== 'none' && style.backgroundImage !== '';
                })
            ].filter(Boolean);

            bgElements.forEach((el) => {
                if (!el) return;
                const style = window.getComputedStyle(el as Element);
                const selector = el.id ? `#${el.id}` : '';
                if (selector && style.backgroundImage !== 'none') {
                    bgStyles.push(`
                        ${selector} {
                            background-image: ${style.backgroundImage} !important;
                            background-color: ${style.backgroundColor} !important;
                            background-size: ${style.backgroundSize} !important;
                            background-position: ${style.backgroundPosition} !important;
                            background-repeat: ${style.backgroundRepeat} !important;
                            position: ${style.position} !important;
                            top: ${style.top};
                            left: ${style.left};
                            right: ${style.right};
                            bottom: ${style.bottom};
                            width: ${style.width};
                            height: ${style.height};
                            z-index: ${style.zIndex};
                        }
                    `);
                }
            });

            // Also capture body and html background
            const bodyStyle = window.getComputedStyle(document.body);
            if (bodyStyle.backgroundImage !== 'none' || bodyStyle.backgroundColor !== 'rgba(0, 0, 0, 0)') {
                bgStyles.push(`
                    body {
                        background-image: ${bodyStyle.backgroundImage} !important;
                        background-color: ${bodyStyle.backgroundColor} !important;
                        background-size: ${bodyStyle.backgroundSize} !important;
                    }
                `);
            }

            return { fullPageHtml, displayName, headContent, backgroundStyles: bgStyles.join('\n') };
        });

        // Wait a bit for all CSS to be collected
        await page.waitForTimeout(500);

        // Combine collected external CSS with inline styles and background styles
        const allCss = [...collectedCss, headContent, backgroundStyles].join('\n\n');

        // Inject collected CSS into the existing HTML by adding a style tag to head
        // This preserves all original class names and structure

        // Add Google Fonts that are commonly used (Inter, Roboto, etc.)
        // Also add fallback fonts for Linktree's custom fonts that are CORS-blocked
        const fontLinks = `
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        `;

        const fontFallbackCss = `
            /* Font fallbacks for CORS-blocked custom fonts */
            @font-face {
                font-family: 'Link Sans Product';
                src: local('Inter'), local('Arial');
                font-weight: 400;
            }
            @font-face {
                font-family: 'Link Sans Product';
                src: local('Inter'), local('Arial');
                font-weight: 500;
            }
            @font-face {
                font-family: 'Link Sans Product';
                src: local('Inter'), local('Arial');
                font-weight: 600;
            }
            @font-face {
                font-family: 'Link Sans Product';
                src: local('Inter'), local('Arial');
                font-weight: 700;
            }
            @font-face {
                font-family: 'LinkSans';
                src: local('Inter'), local('Arial');
            }
            /* Ensure Inter is used as primary fallback */
            body, h1, h2, h3, p, a, button, span, div {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            }
        `;

        const cssStyleTag = `${fontLinks}<style id="collected-css">\n${fontFallbackCss}\n${allCss}\n</style>`;

        // Remove script tags to prevent errors
        let fullHtml = fullPageHtml
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
            .replace(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi, ''); // Remove stylesheet links

        // Insert collected CSS before </head>
        if (fullHtml.toLowerCase().includes('</head>')) {
            fullHtml = fullHtml.replace(/<\/head>/i, cssStyleTag + '</head>');
        } else {
            // Fallback: wrap in proper structure
            fullHtml = `<!DOCTYPE html><html><head>${cssStyleTag}</head><body>${fullHtml}</body></html>`;
        }

        // Add carousel functionality script before </body>
        const carouselScript = `
        <script>
            // Carousel navigation - section-based detection
            (function() {
                function setupCarousels() {
                    console.log('Carousel setup starting...');
                    
                    // Find all sections that might contain carousels
                    // A carousel section typically has: a scrollable container AND navigation buttons
                    const sections = document.querySelectorAll('section, [class*="section"], div > div');
                    
                    sections.forEach((section, sectionIdx) => {
                        // Find scrollable container in this section
                        let scrollContainer = null;
                        section.querySelectorAll('*').forEach(el => {
                            if (scrollContainer) return;
                            if (el.getAttribute('data-carousel-wired')) return;
                            
                            const hasScrollableAttr = el.getAttribute('scrollable') === 'true';
                            const hasScrollClass = el.className && (
                                el.className.includes('overflow-x-scroll') ||
                                el.className.includes('scrollbar-hide') ||
                                el.className.includes('scroll-smooth')
                            );
                            const style = getComputedStyle(el);
                            const isScrollable = (style.overflowX === 'scroll' || style.overflowX === 'auto') && 
                                                 el.scrollWidth > el.clientWidth + 20;
                            
                            if ((hasScrollableAttr || hasScrollClass || isScrollable) && el.scrollWidth > el.clientWidth) {
                                scrollContainer = el;
                            }
                        });
                        
                        if (!scrollContainer) return;
                        
                        // Find navigation buttons in this section
                        const buttons = section.querySelectorAll('button');
                        let nextBtn = null, prevBtn = null;
                        
                        buttons.forEach(btn => {
                            if (btn.getAttribute('data-carousel-wired')) return;
                            
                            const text = (btn.textContent || '').toLowerCase();
                            const html = (btn.innerHTML || '').toLowerCase();
                            const aria = (btn.getAttribute('aria-label') || '').toLowerCase();
                            
                            // Exclude card buttons (More, Share, Buy, etc.)
                            const isCardButton = text.includes('more') || text.includes('share') || 
                                                 text.includes('buy') || text.includes('shop') ||
                                                 text.includes('view') || text.includes('listen');
                            if (isCardButton) return;
                            
                            // Check for next/prev indicators
                            const isNext = text.includes('next') || html.includes('next') || aria.includes('next') ||
                                          html.includes('chevron-right') || html.includes('arrow-right');
                            const isPrev = text.includes('prev') || html.includes('prev') || aria.includes('prev') ||
                                          html.includes('chevron-left') || html.includes('arrow-left');
                            
                            if (isNext && !nextBtn) nextBtn = btn;
                            if (isPrev && !prevBtn) prevBtn = btn;
                        });
                        
                        // Wire up the buttons if found
                        if ((nextBtn || prevBtn) && scrollContainer) {
                            scrollContainer.setAttribute('data-carousel-wired', 'true');
                            console.log('Wiring carousel section', sectionIdx, '- container:', scrollContainer.scrollWidth, 'buttons:', !!nextBtn, !!prevBtn);
                            
                            const scrollAmount = () => scrollContainer.clientWidth * 0.8;
                            
                            if (nextBtn) {
                                nextBtn.setAttribute('data-carousel-wired', 'true');
                                nextBtn.addEventListener('click', (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    e.stopImmediatePropagation();
                                    
                                    const amount = scrollAmount();
                                    const before = scrollContainer.scrollLeft;
                                    scrollContainer.scrollLeft += amount; // Direct manipulation
                                    scrollContainer.scrollBy({ left: amount, behavior: 'smooth' }); // Also try scrollBy
                                    
                                    console.log('NEXT: scrolled from', before, 'by', amount, 'to', scrollContainer.scrollLeft);
                                }, { capture: true, passive: false });
                            }
                            
                            if (prevBtn) {
                                prevBtn.setAttribute('data-carousel-wired', 'true');
                                prevBtn.addEventListener('click', (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    e.stopImmediatePropagation();
                                    
                                    const amount = scrollAmount();
                                    const before = scrollContainer.scrollLeft;
                                    scrollContainer.scrollLeft -= amount;
                                    scrollContainer.scrollBy({ left: -amount, behavior: 'smooth' });
                                    
                                    console.log('PREV: scrolled from', before, 'by', -amount, 'to', scrollContainer.scrollLeft);
                                }, { capture: true, passive: false });
                            }
                        }
                        
                        // Enable drag scrolling for all scrollable containers
                        if (scrollContainer && !scrollContainer.getAttribute('data-drag-setup')) {
                            scrollContainer.setAttribute('data-drag-setup', 'true');
                            scrollContainer.style.cursor = 'grab';
                            scrollContainer.style.scrollBehavior = 'smooth';
                            
                            let isDragging = false, startX = 0, scrollStart = 0;
                            
                            scrollContainer.addEventListener('mousedown', (e) => {
                                isDragging = true;
                                startX = e.pageX;
                                scrollStart = scrollContainer.scrollLeft;
                                scrollContainer.style.cursor = 'grabbing';
                            });
                            
                            scrollContainer.addEventListener('mousemove', (e) => {
                                if (!isDragging) return;
                                e.preventDefault();
                                const dx = e.pageX - startX;
                                scrollContainer.scrollLeft = scrollStart - dx;
                            });
                            
                            scrollContainer.addEventListener('mouseup', () => {
                                isDragging = false;
                                scrollContainer.style.cursor = 'grab';
                            });
                            
                            scrollContainer.addEventListener('mouseleave', () => {
                                isDragging = false;
                                scrollContainer.style.cursor = 'grab';
                            });
                        }
                    });
                }
                
                // Run multiple times to catch dynamically loaded content
                setTimeout(setupCarousels, 200);
                setTimeout(setupCarousels, 800);
                setTimeout(setupCarousels, 2000);
            })();
        </script>
        `;

        // Insert carousel script before </body>
        if (fullHtml.toLowerCase().includes('</body>')) {
            fullHtml = fullHtml.replace(/<\/body>/i, carouselScript + '</body>');
        }

        // Ensure it starts with DOCTYPE
        if (!fullHtml.trim().toLowerCase().startsWith('<!doctype')) {
            fullHtml = '<!DOCTYPE html>\n' + fullHtml;
        }

        await browser.close();
        browser = null;

        return { fullHtml, cssContent: allCss, displayName };

    } catch (error) {
        if (browser) await browser.close();
        throw error;
    }
}


