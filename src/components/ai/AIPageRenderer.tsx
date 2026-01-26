"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";

interface AIPageRendererProps {
    html: string;
}

export function AIPageRenderer({ html }: AIPageRendererProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [iframeHeight, setIframeHeight] = useState("100vh");

    // Create the full HTML document for the iframe
    const getIframeContent = () => {
        // Script to inject Entro.ly branding into TopBar (with fallback for non-Linktree pages)
        const topBarInjectionScript = `
            <script>
                (function() {
                    // Original Linktree-compatible content (uses Linktree CSS variables)
                    const linktreeTopBarContent = '<div class="mx-auto flex max-w-profileContainer justify-between items-center gap-x-2 px-[var(--link-gap)] py-[var(--link-gap)] text-right sm:px-[calc(var(--link-gap)*2)]"><button class="group relative flex h-11 w-11 items-center justify-center rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-white/40 transition-all hover:bg-white hover:scale-105 active:scale-95" data-testid="EntrolyBranding"><img src="/entropi_logo.ico" alt="Entropi" class="w-7 h-7 object-contain opacity-80 group-hover:opacity-100 transition-opacity"></button><div class="flex items-center gap-4 px-5 py-2 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-white/40"><div class="flex items-center gap-2.5"><div class="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100/50 text-emerald-600"><span class="text-[8px] font-bold">Rp</span></div><div class="flex flex-col"><span class="text-[9px] font-bold tracking-widest text-gray-400 uppercase leading-none mb-0.5">GMV</span><span class="text-xs font-bold text-gray-900 leading-none">30,000,000</span></div></div><div class="h-5 w-px bg-gray-200/60"></div><div class="flex items-center gap-2.5"><div class="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100/50 text-indigo-500"><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-5.82 3.25L7.36 14.14 2.36 9.27l6.91-1.01L12 2z"/></svg></div><div class="flex flex-col"><span class="text-[9px] font-bold tracking-widest text-gray-400 uppercase leading-none mb-0.5">Level</span><span class="text-xs font-bold text-gray-900 leading-none">2</span></div></div></div></div>';
                    
                    // Standalone content for non-Linktree pages (uses fixed values)
                    const standaloneTopBarContent = '<div class="mx-auto flex max-w-[680px] justify-between items-center gap-x-2 px-4 py-3"><button class="group relative flex h-11 w-11 items-center justify-center rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-white/40 transition-all hover:bg-white hover:scale-105 active:scale-95" data-testid="EntrolyBranding"><img src="/entropi_logo.ico" alt="Entropi" class="w-7 h-7 object-contain opacity-80 group-hover:opacity-100 transition-opacity"></button><div class="flex items-center gap-4 px-5 py-2 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-white/40"><div class="flex items-center gap-2.5"><div class="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100/50 text-emerald-600"><span class="text-[8px] font-bold">Rp</span></div><div class="flex flex-col"><span class="text-[9px] font-bold tracking-widest text-gray-400 uppercase leading-none mb-0.5">GMV</span><span class="text-xs font-bold text-gray-900 leading-none">30,000,000</span></div></div><div class="h-5 w-px bg-gray-200/60"></div><div class="flex items-center gap-2.5"><div class="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100/50 text-indigo-500"><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-5.82 3.25L7.36 14.14 2.36 9.27l6.91-1.01L12 2z"/></svg></div><div class="flex flex-col"><span class="text-[9px] font-bold tracking-widest text-gray-400 uppercase leading-none mb-0.5">Level</span><span class="text-xs font-bold text-gray-900 leading-none">2</span></div></div></div></div>';

                    function injectTopBarBranding() {
                        const existingTopBar = document.getElementById('TopBar');
                        const standaloneTopBar = document.getElementById('EntrolyTopBar');
                        
                        // Case 1: Linktree page with existing TopBar - use Linktree-compatible styling
                        if (existingTopBar && existingTopBar.children.length === 0) {
                            existingTopBar.innerHTML = linktreeTopBarContent;
                            return;
                        }
                        
                        // Case 2: Non-Linktree page - create standalone TopBar with fixed styling
                        if (!existingTopBar && !standaloneTopBar) {
                            const newTopBar = document.createElement('div');
                            newTopBar.id = 'EntrolyTopBar';
                            newTopBar.className = 'fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-white/90 to-transparent backdrop-blur-sm';
                            newTopBar.innerHTML = standaloneTopBarContent;
                            document.body.prepend(newTopBar);
                            
                            // Add padding to body to prevent content from hiding behind fixed TopBar
                            document.body.style.paddingTop = '70px';
                        }
                    }
                    
                    // Run immediately and with delays for dynamic content
                    injectTopBarBranding();
                    setTimeout(injectTopBarBranding, 100);
                    setTimeout(injectTopBarBranding, 500);
                })();
            </script>
        `;

        // Script to inject promotional links at the very bottom of the page (with fallback for non-Linktree pages)
        const promotionalLinksScript = `
            <script>
                (function() {
                    const promoLinks = [
                        { title: '👥 Join ENTROPI Community 👥', url: 'https://example.com' },
                        { title: '💸 Kasbon My Commission Today 💸', url: 'https://example.com' },
                        { title: '🎁 Join ENTRO.LY to get 100K 🎁', url: 'https://example.com' }
                    ];

                    // Default Entro.ly styling for non-Linktree pages
                    const defaultLinkHtml = (link) => \`
                        <a href="\${link.url}" target="_blank" rel="noopener noreferrer" data-entropi-promo="true"
                           class="block w-full max-w-[680px] mx-auto mb-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center font-semibold text-base shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200">
                            \${link.title}
                        </a>
                    \`;

                    function injectPromotionalLinks() {
                        // Check if we already injected (prevent duplicates)
                        if (document.querySelector('[data-entropi-promo="true"]')) return;

                        // Find ALL link containers to get styling from one (Linktree pages)
                        const allContainers = document.querySelectorAll('[data-testid="NewLinkContainer"]');
                        const linksContainer = document.getElementById('links-container');
                        
                        // Case 1: Linktree page with existing containers
                        if (allContainers.length > 0 && linksContainer) {
                            const existingContainer = allContainers[0];
                            const styleType = existingContainer.getAttribute('data-style-type') || 'FILL';
                            const layout = existingContainer.getAttribute('data-layout') || 'stack';
                            const cornerStyle = existingContainer.getAttribute('data-corner-style') || 'ROUNDED_LG';
                            const shadowType = existingContainer.getAttribute('data-shadow-type') || 'SHADOW_NONE';
                            const existingInner = existingContainer.querySelector('[data-testid="NewLinkContainerInner"]');
                            const existingChin = existingContainer.querySelector('[data-testid="NewLinkChin"]');
                            
                            if (!existingInner || !existingChin) return;

                            const containerStyle = existingContainer.getAttribute('style') || '';
                            const innerStyle = existingInner.getAttribute('style') || '';
                            const chinStyle = existingChin.getAttribute('style') || '';

                            promoLinks.forEach((link) => {
                                const promoContainer = document.createElement('div');
                                promoContainer.setAttribute('data-testid', 'NewLinkContainer');
                                promoContainer.setAttribute('data-is-featured', 'false');
                                promoContainer.setAttribute('data-style-type', styleType);
                                promoContainer.setAttribute('data-layout', layout);
                                promoContainer.setAttribute('data-corner-style', cornerStyle);
                                promoContainer.setAttribute('data-shadow-type', shadowType);
                                promoContainer.setAttribute('data-entropi-promo', 'true');
                                promoContainer.className = existingContainer.className;
                                if (containerStyle) promoContainer.setAttribute('style', containerStyle);

                                promoContainer.innerHTML = \`
                                    <div data-testid="NewLinkContainerInner" class="\${existingInner.className}" style="\${innerStyle}">
                                        <a href="\${link.url}" target="_blank" data-testid="LinkClickTriggerLink" rel="noopener noreferrer" class="grid w-full grid-cols-1 focus:outline-none grid-rows-[min-content_1fr]">
                                            <div class="transition-opacity duration-200 opacity-100">
                                                <div data-testid="NewLinkChin" data-animation-target="link-chin" class="\${existingChin.className}" style="\${chinStyle}">
                                                    <div class="w-full overflow-hidden overflow-ellipsis text-balance text-[14px] font-medium leading-[1.2] text-[var(--button-style-text)] sm:text-[16px] line-clamp-2 text-center">\${link.title}</div>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                \`;

                                linksContainer.appendChild(promoContainer);
                            });
                            return;
                        }
                        
                        // Case 2: Non-Linktree page - inject INLINE at end of body with adaptive styling
                        if (allContainers.length === 0) {
                            let promoSection = document.getElementById('EntrolyPromoLinks');
                            if (!promoSection) {
                                // Detect page background color for adaptive styling
                                const bodyStyle = window.getComputedStyle(document.body);
                                const bgColor = bodyStyle.backgroundColor || 'rgb(255, 255, 255)';
                                
                                // Parse RGB values to determine if background is dark or light
                                const rgbMatch = bgColor.match(/\\d+/g);
                                let isDark = false;
                                if (rgbMatch && rgbMatch.length >= 3) {
                                    const luminance = (0.299 * parseInt(rgbMatch[0]) + 0.587 * parseInt(rgbMatch[1]) + 0.114 * parseInt(rgbMatch[2])) / 255;
                                    isDark = luminance < 0.5;
                                }
                                
                                // Adaptive glassmorphism styling based on background
                                const glassStyle = isDark 
                                    ? 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20'
                                    : 'bg-black/5 backdrop-blur-md border border-black/10 text-gray-800 hover:bg-black/10';
                                
                                const adaptiveLinkHtml = (link) => \`
                                    <a href="\${link.url}" target="_blank" rel="noopener noreferrer" data-entropi-promo="true"
                                       class="block w-full mb-3 px-6 py-4 rounded-2xl \${glassStyle} text-center font-semibold text-base shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200">
                                        \${link.title}
                                    </a>
                                \`;
                                
                                // Create inline section (not fixed)
                                promoSection = document.createElement('div');
                                promoSection.id = 'EntrolyPromoLinks';
                                promoSection.className = 'w-full max-w-[680px] mx-auto px-4 py-8 mt-8';
                                promoSection.innerHTML = promoLinks.map(adaptiveLinkHtml).join('');
                                
                                // Append to end of body (inline, scrolls with content)
                                document.body.appendChild(promoSection);
                            }
                        }
                    }

                    // Run immediately and with delays for dynamic content
                    injectPromotionalLinks();
                    setTimeout(injectPromotionalLinks, 100);
                    setTimeout(injectPromotionalLinks, 500);
                    setTimeout(injectPromotionalLinks, 1000);
                })();
            </script>
        `;

        // Script to inject the Entro.ly Signup Modal (Linktree-style popup)
        const signupModalScript = `
            <script>
                (function() {
                    const modalHtml = \`
                        <div id="EntrolySignupModal" class="fixed inset-0 z-[100] hidden items-start justify-center pt-24 px-4 sm:px-6 opacity-0 transition-opacity duration-300">
                            <!-- Backdrop -->
                            <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" id="EntrolyModalBackdrop"></div>
                            
                            <!-- Modal Content -->
                            <div class="relative w-full max-w-[900px] transform overflow-hidden rounded-[32px] bg-white shadow-2xl transition-all duration-300 scale-95 opacity-0" id="EntrolyModalContent">
                                <button id="CloseEntrolyModal" class="absolute right-6 top-6 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/5 transition hover:bg-black/10">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-500"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                                
                                <div class="grid grid-cols-1 md:grid-cols-2">
                                    <!-- Left Side: Content -->
                                    <div class="flex flex-col justify-center bg-[#F3F3F1] p-8 sm:p-12 md:p-16">
                                        <div class="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                                            <img src="/entropi_logo.ico" alt="Entropi" class="h-8 w-8 object-contain">
                                        </div>
                                        
                                        <h2 class="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 leading-[1.1]">
                                            Join the <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">only link in bio</span> you'll ever need.
                                        </h2>
                                        
                                        <p class="mb-8 text-lg text-gray-600 font-medium">
                                            One link to share everything you create, curate and sell across IG, TikTok and more.
                                        </p>
                                        
                                        <form class="flex flex-col gap-3" onsubmit="event.preventDefault(); window.open('https://entro.ly/register', '_blank');">
                                            <div class="relative flex items-center">
                                                <span class="absolute left-4 text-gray-400 font-medium">entro.ly/</span>
                                                <input type="text" placeholder="yourname" class="h-14 w-full rounded-full border-2 border-transparent bg-white pl-[88px] pr-6 text-lg font-medium text-gray-900 placeholder-gray-300 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all shadow-sm" />
                                            </div>
                                            <button type="submit" class="h-14 w-full rounded-full bg-gray-900 text-lg font-bold text-white transition-transform active:scale-[0.98] hover:bg-black shadow-lg">
                                                Claim your Entro.ly
                                            </button>
                                        </form>
                                    </div>
                                    
                                    <!-- Right Side: Visual -->
                                    <div class="relative hidden md:flex items-center justify-center bg-[#E5E7EB] overflow-hidden">
                                        <div class="absolute inset-0 bg-gradient-to-br from-purple-100 via-pink-100 to-amber-100 opacity-100"></div>
                                        
                                        <!-- Decorative Elements -->
                                        <div class="absolute top-0 right-0 -mt-20 -mr-20 h-80 w-80 rounded-full bg-purple-300/30 blur-3xl"></div>
                                        <div class="absolute bottom-0 left-0 -mb-20 -ml-20 h-80 w-80 rounded-full bg-amber-300/30 blur-3xl"></div>
                                        
                                        <!-- Mockup Card -->
                                        <div class="relative z-10 w-[280px] rotate-[-6deg] transform transition-transform duration-700 hover:rotate-0 hover:scale-105">
                                            <div class="overflow-hidden rounded-[40px] border-[8px] border-white bg-white shadow-2xl">
                                                <div class="h-[500px] w-full bg-gray-50 flex flex-col items-center pt-10 px-6 gap-4">
                                                    <div class="h-20 w-20 rounded-full bg-gray-200"></div>
                                                    <div class="h-4 w-32 rounded-full bg-gray-200"></div>
                                                    <div class="w-full h-12 rounded-xl bg-gray-100"></div>
                                                    <div class="w-full h-12 rounded-xl bg-gray-100"></div>
                                                    <div class="w-full h-12 rounded-xl bg-gray-100"></div>
                                                    <div class="flex gap-4 mt-4">
                                                        <div class="h-10 w-10 rounded-full bg-gray-100"></div>
                                                        <div class="h-10 w-10 rounded-full bg-gray-100"></div>
                                                        <div class="h-10 w-10 rounded-full bg-gray-100"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    \`;

                    // Inject modal HTML
                    if (!document.getElementById('EntrolySignupModal')) {
                        document.body.insertAdjacentHTML('beforeend', modalHtml);
                    }

                    // Setup Logic
                    function setupModalLogic() {
                        const modal = document.getElementById('EntrolySignupModal');
                        const modalContent = document.getElementById('EntrolyModalContent');
                        const backdrop = document.getElementById('EntrolyModalBackdrop');
                        const closeBtn = document.getElementById('CloseEntrolyModal');
                        const triggerBtn = document.querySelector('[data-testid="EntrolyBranding"]');
                        const topBar = document.getElementById('TopBar');

                        if (!modal || !triggerBtn) return;

                        const openModal = () => {
                            // Hide TopBar
                            if (topBar) topBar.style.display = 'none';
                            
                            // Ensure flex is added for centering, remove hidden
                            modal.classList.remove('hidden');
                            modal.classList.add('flex');
                            
                            // Small delay to allow display change to apply before opacity transition
                            requestAnimationFrame(() => {
                                modal.classList.remove('opacity-0');
                                modalContent.classList.remove('opacity-0', 'scale-95');
                                modalContent.classList.add('scale-100');
                            });
                        };

                        const closeModal = () => {
                            // Show TopBar
                            if (topBar) topBar.style.display = '';

                            modal.classList.add('opacity-0');
                            modalContent.classList.add('opacity-0', 'scale-95');
                            modalContent.classList.remove('scale-100');
                            setTimeout(() => {
                                modal.classList.add('hidden');
                                modal.classList.remove('flex');
                            }, 300);
                        };

                        // Remove existing listeners to prevent duplicates (cloning usually handles this but good to be safe)
                        const newTrigger = triggerBtn.cloneNode(true);
                        triggerBtn.parentNode.replaceChild(newTrigger, triggerBtn);
                        
                        newTrigger.addEventListener('click', (e) => {
                            e.preventDefault();
                            openModal();
                        });

                        closeBtn.addEventListener('click', closeModal);
                        backdrop.addEventListener('click', closeModal);
                    }

                    // Initialize
                    setupModalLogic();
                    // Re-run setup on intervals to catch dynamic button injection
                    setTimeout(setupModalLogic, 200);
                    setTimeout(setupModalLogic, 600);
                    setTimeout(setupModalLogic, 1200);
                })();
            </script>
        `;

        // Minimal Tailwind-like CSS utilities (only what's needed)
        const minimalCSS = `
            <style>
                /* Reset */
                *, *::before, *::after { box-sizing: border-box; }
                html, body { margin: 0; padding: 0; min-height: 100vh; }
                
                /* Fonts */
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
                
                /* Flexbox */
                .flex { display: flex; }
                .inline-flex { display: inline-flex; }
                .hidden { display: none; }
                .grid { display: grid; }
                .block { display: block; }
                .inline-block { display: inline-block; }
                .flex-col { flex-direction: column; }
                .flex-row { flex-direction: row; }
                .flex-wrap { flex-wrap: wrap; }
                .items-center { align-items: center; }
                .items-start { align-items: flex-start; }
                .items-end { align-items: flex-end; }
                .justify-center { justify-content: center; }
                .justify-between { justify-content: space-between; }
                .justify-start { justify-content: flex-start; }
                .justify-end { justify-content: flex-end; }
                .gap-1 { gap: 0.25rem; }
                .gap-2 { gap: 0.5rem; }
                .gap-2\\.5 { gap: 0.625rem; }
                .gap-3 { gap: 0.75rem; }
                .gap-4 { gap: 1rem; }
                .gap-5 { gap: 1.25rem; }
                .gap-6 { gap: 1.5rem; }
                .gap-8 { gap: 2rem; }
                .gap-x-2 { column-gap: 0.5rem; }
                .flex-1 { flex: 1 1 0%; }
                .flex-shrink-0 { flex-shrink: 0; }
                .flex-grow { flex-grow: 1; }
                
                /* Sizing */
                .w-full { width: 100%; }
                .w-auto { width: auto; }
                .w-5 { width: 1.25rem; }
                .w-6 { width: 1.5rem; }
                .w-7 { width: 1.75rem; }
                .w-8 { width: 2rem; }
                .w-10 { width: 2.5rem; }
                .w-11 { width: 2.75rem; }
                .w-12 { width: 3rem; }
                .w-14 { width: 3.5rem; }
                .w-16 { width: 4rem; }
                .w-20 { width: 5rem; }
                .w-24 { width: 6rem; }
                .w-32 { width: 8rem; }
                .w-40 { width: 10rem; }
                .w-48 { width: 12rem; }
                .w-64 { width: 16rem; }
                .w-80 { width: 20rem; }
                .w-\\[280px\\] { width: 280px; }
                .w-px { width: 1px; }
                .h-1 { height: 0.25rem; }
                .h-4 { height: 1rem; }
                .h-5 { height: 1.25rem; }
                .h-6 { height: 1.5rem; }
                .h-7 { height: 1.75rem; }
                .h-8 { height: 2rem; }
                .h-10 { height: 2.5rem; }
                .h-11 { height: 2.75rem; }
                .h-12 { height: 3rem; }
                .h-14 { height: 3.5rem; }
                .h-16 { height: 4rem; }
                .h-20 { height: 5rem; }
                .h-80 { height: 20rem; }
                .h-\\[500px\\] { height: 500px; }
                .min-h-screen { min-height: 100vh; }
                .max-w-\\[680px\\] { max-width: 680px; }
                .max-w-\\[900px\\] { max-width: 900px; }
                .max-w-profileContainer { max-width: 680px; }
                
                /* Spacing */
                .p-2 { padding: 0.5rem; }
                .p-3 { padding: 0.75rem; }
                .p-4 { padding: 1rem; }
                .p-5 { padding: 1.25rem; }
                .p-6 { padding: 1.5rem; }
                .p-8 { padding: 2rem; }
                .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
                .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
                .px-4 { padding-left: 1rem; padding-right: 1rem; }
                .px-5 { padding-left: 1.25rem; padding-right: 1.25rem; }
                .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
                .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
                .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
                .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
                .py-8 { padding-top: 2rem; padding-bottom: 2rem; }
                .pt-10 { padding-top: 2.5rem; }
                .pt-24 { padding-top: 6rem; }
                .pl-\\[88px\\] { padding-left: 88px; }
                .pr-6 { padding-right: 1.5rem; }
                .m-0 { margin: 0; }
                .mx-auto { margin-left: auto; margin-right: auto; }
                .mx-4 { margin-left: 1rem; margin-right: 1rem; }
                .mb-1 { margin-bottom: 0.25rem; }
                .mb-1\\.5 { margin-bottom: 0.375rem; }
                .mb-0\\.5 { margin-bottom: 0.125rem; }
                .mb-2 { margin-bottom: 0.5rem; }
                .mb-3 { margin-bottom: 0.75rem; }
                .mb-4 { margin-bottom: 1rem; }
                .mb-6 { margin-bottom: 1.5rem; }
                .mb-8 { margin-bottom: 2rem; }
                .mt-4 { margin-top: 1rem; }
                .mt-8 { margin-top: 2rem; }
                .-mt-20 { margin-top: -5rem; }
                .-mr-20 { margin-right: -5rem; }
                .-mb-20 { margin-bottom: -5rem; }
                .-ml-20 { margin-left: -5rem; }
                .space-y-4 > * + * { margin-top: 1rem; }
                
                /* Typography */
                .text-xs { font-size: 0.75rem; line-height: 1rem; }
                .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
                .text-base { font-size: 1rem; line-height: 1.5rem; }
                .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
                .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
                .text-2xl { font-size: 1.5rem; line-height: 2rem; }
                .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
                .text-\\[8px\\] { font-size: 8px; }
                .text-\\[9px\\] { font-size: 9px; }
                .text-\\[14px\\] { font-size: 14px; }
                .font-medium { font-weight: 500; }
                .font-semibold { font-weight: 600; }
                .font-bold { font-weight: 700; }
                .font-extrabold { font-weight: 800; }
                .text-center { text-align: center; }
                .text-right { text-align: right; }
                .text-white { color: #ffffff; }
                .text-black { color: #000000; }
                .text-gray-300 { color: #d1d5db; }
                .text-gray-400 { color: #9ca3af; }
                .text-gray-500 { color: #6b7280; }
                .text-gray-600 { color: #4b5563; }
                .text-gray-800 { color: #1f2937; }
                .text-gray-900 { color: #111827; }
                .text-slate-50 { color: #f8fafc; }
                .text-slate-300 { color: #cbd5e1; }
                .text-slate-400 { color: #94a3b8; }
                .text-emerald-400 { color: #34d399; }
                .text-emerald-600 { color: #059669; }
                .text-purple-600 { color: #9333ea; }
                .text-pink-600 { color: #db2777; }
                .text-indigo-500 { color: #6366f1; }
                .text-blue-400 { color: #60a5fa; }
                .text-green-400 { color: #4ade80; }
                .uppercase { text-transform: uppercase; }
                .tracking-tight { letter-spacing: -0.025em; }
                .tracking-widest { letter-spacing: 0.1em; }
                .leading-none { line-height: 1; }
                .leading-\\[1\\.1\\] { line-height: 1.1; }
                .leading-\\[1\\.2\\] { line-height: 1.2; }
                .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
                .overflow-ellipsis { text-overflow: ellipsis; }
                .text-balance { text-wrap: balance; }
                .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
                .text-transparent { color: transparent; }
                .bg-clip-text { background-clip: text; -webkit-background-clip: text; }
                
                /* Backgrounds */
                .bg-white { background-color: #ffffff; }
                .bg-black { background-color: #000000; }
                .bg-gray-50 { background-color: #f9fafb; }
                .bg-gray-100 { background-color: #f3f4f6; }
                .bg-gray-200 { background-color: #e5e7eb; }
                .bg-gray-900 { background-color: #111827; }
                .bg-slate-800 { background-color: #1e293b; }
                .bg-slate-900 { background-color: #0f172a; }
                .bg-\\[\\#F3F3F1\\] { background-color: #F3F3F1; }
                .bg-\\[\\#E5E7EB\\] { background-color: #E5E7EB; }
                .bg-white\\/5 { background-color: rgba(255,255,255,0.05); }
                .bg-white\\/10 { background-color: rgba(255,255,255,0.1); }
                .bg-white\\/20 { background-color: rgba(255,255,255,0.2); }
                .bg-white\\/40 { background-color: rgba(255,255,255,0.4); }
                .bg-white\\/80 { background-color: rgba(255,255,255,0.8); }
                .bg-white\\/90 { background-color: rgba(255,255,255,0.9); }
                .bg-black\\/5 { background-color: rgba(0,0,0,0.05); }
                .bg-black\\/10 { background-color: rgba(0,0,0,0.1); }
                .bg-black\\/30 { background-color: rgba(0,0,0,0.3); }
                .bg-black\\/40 { background-color: rgba(0,0,0,0.4); }
                .bg-emerald-100\\/50 { background-color: rgba(209,250,229,0.5); }
                .bg-indigo-100\\/50 { background-color: rgba(224,231,255,0.5); }
                .bg-gradient-to-r { background-image: linear-gradient(to right, var(--tw-gradient-stops)); }
                .bg-gradient-to-br { background-image: linear-gradient(to bottom right, var(--tw-gradient-stops)); }
                .bg-gradient-to-b { background-image: linear-gradient(to bottom, var(--tw-gradient-stops)); }
                .from-purple-500 { --tw-gradient-from: #a855f7; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, transparent); }
                .from-purple-600 { --tw-gradient-from: #9333ea; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, transparent); }
                .from-purple-100 { --tw-gradient-from: #f3e8ff; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, transparent); }
                .from-purple-300\\/30 { --tw-gradient-from: rgba(216,180,254,0.3); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, transparent); }
                .from-yellow-400 { --tw-gradient-from: #facc15; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, transparent); }
                .from-white\\/90 { --tw-gradient-from: rgba(255,255,255,0.9); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, transparent); }
                .via-red-500 { --tw-gradient-stops: var(--tw-gradient-from), #ef4444, var(--tw-gradient-to, transparent); }
                .via-pink-100 { --tw-gradient-stops: var(--tw-gradient-from), #fce7f3, var(--tw-gradient-to, transparent); }
                .to-pink-500 { --tw-gradient-to: #ec4899; }
                .to-pink-600 { --tw-gradient-to: #db2777; }
                .to-purple-500 { --tw-gradient-to: #a855f7; }
                .to-amber-100 { --tw-gradient-to: #fef3c7; }
                .to-amber-300\\/30 { --tw-gradient-to: rgba(252,211,77,0.3); }
                .to-transparent { --tw-gradient-to: transparent; }
                
                /* Borders */
                .border { border-width: 1px; }
                .border-2 { border-width: 2px; }
                .border-\\[8px\\] { border-width: 8px; }
                .border-white { border-color: #ffffff; }
                .border-white\\/10 { border-color: rgba(255,255,255,0.1); }
                .border-white\\/20 { border-color: rgba(255,255,255,0.2); }
                .border-white\\/30 { border-color: rgba(255,255,255,0.3); }
                .border-white\\/40 { border-color: rgba(255,255,255,0.4); }
                .border-black\\/10 { border-color: rgba(0,0,0,0.1); }
                .border-gray-200\\/60 { border-color: rgba(229,231,235,0.6); }
                .border-transparent { border-color: transparent; }
                .border-purple-500 { border-color: #a855f7; }
                .rounded { border-radius: 0.25rem; }
                .rounded-lg { border-radius: 0.5rem; }
                .rounded-xl { border-radius: 0.75rem; }
                .rounded-2xl { border-radius: 1rem; }
                .rounded-\\[32px\\] { border-radius: 32px; }
                .rounded-\\[40px\\] { border-radius: 40px; }
                .rounded-full { border-radius: 9999px; }
                
                /* Effects */
                .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05); }
                .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05); }
                .shadow-xl { box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); }
                .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }
                .opacity-0 { opacity: 0; }
                .opacity-50 { opacity: 0.5; }
                .opacity-80 { opacity: 0.8; }
                .opacity-100 { opacity: 1; }
                .backdrop-blur-sm { backdrop-filter: blur(4px); }
                .backdrop-blur-md { backdrop-filter: blur(12px); }
                .backdrop-blur-3xl { backdrop-filter: blur(64px); }
                .blur-3xl { filter: blur(64px); }
                
                /* Positioning */
                .relative { position: relative; }
                .absolute { position: absolute; }
                .fixed { position: fixed; }
                .inset-0 { inset: 0; }
                .top-0 { top: 0; }
                .right-0 { right: 0; }
                .bottom-0 { bottom: 0; }
                .left-0 { left: 0; }
                .right-6 { right: 1.5rem; }
                .top-6 { top: 1.5rem; }
                .z-10 { z-index: 10; }
                .z-50 { z-index: 50; }
                .z-\\[100\\] { z-index: 100; }
                
                /* Overflow */
                .overflow-hidden { overflow: hidden; }
                .overflow-x-auto { overflow-x: auto; }
                
                /* Transform */
                .transform { transform: translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)); }
                .-translate-x-1\\/2 { --tw-translate-x: -50%; transform: translateX(var(--tw-translate-x)); }
                .scale-95 { --tw-scale-x: 0.95; --tw-scale-y: 0.95; transform: scale(0.95); }
                .scale-100 { --tw-scale-x: 1; --tw-scale-y: 1; transform: scale(1); }
                .rotate-\\[-6deg\\] { transform: rotate(-6deg); }
                
                /* Transitions */
                .transition { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
                .transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
                .transition-colors { transition-property: color, background-color, border-color; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
                .transition-opacity { transition-property: opacity; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
                .transition-transform { transition-property: transform; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
                .duration-150 { transition-duration: 150ms; }
                .duration-200 { transition-duration: 200ms; }
                .duration-300 { transition-duration: 300ms; }
                .duration-700 { transition-duration: 700ms; }
                
                /* Hover/Active states */
                .hover\\:bg-white:hover { background-color: #ffffff; }
                .hover\\:bg-black:hover { background-color: #000000; }
                .hover\\:bg-white\\/10:hover { background-color: rgba(255,255,255,0.1); }
                .hover\\:bg-white\\/20:hover { background-color: rgba(255,255,255,0.2); }
                .hover\\:bg-black\\/10:hover { background-color: rgba(0,0,0,0.1); }
                .hover\\:scale-105:hover { transform: scale(1.05); }
                .hover\\:scale-\\[1\\.02\\]:hover { transform: scale(1.02); }
                .hover\\:rotate-0:hover { transform: rotate(0deg); }
                .hover\\:opacity-90:hover { opacity: 0.9; }
                .hover\\:opacity-100:hover { opacity: 1; }
                .hover\\:shadow-xl:hover { box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); }
                .active\\:scale-95:active { transform: scale(0.95); }
                .active\\:scale-\\[0\\.98\\]:active { transform: scale(0.98); }
                
                /* Grid */
                .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
                .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
                .grid-rows-\\[min-content_1fr\\] { grid-template-rows: min-content 1fr; }
                
                /* Focus */
                .focus\\:outline-none:focus { outline: none; }
                .focus\\:border-purple-500:focus { border-color: #a855f7; }
                .focus\\:ring-4:focus { box-shadow: 0 0 0 4px var(--tw-ring-color); }
                .focus\\:ring-purple-500\\/10:focus { --tw-ring-color: rgba(168,85,247,0.1); }
                
                /* Cursor */
                .cursor-grab { cursor: grab; }
                .cursor-grabbing { cursor: grabbing; }
                .pointer-events-none { pointer-events: none; }
                
                /* Object */
                .object-cover { object-fit: cover; }
                .object-contain { object-fit: contain; }
                
                /* Responsive - MD breakpoint */
                @media (min-width: 768px) {
                    .md\\:flex { display: flex; }
                    .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                    .md\\:p-16 { padding: 4rem; }
                }
                
                /* Responsive - SM breakpoint */
                @media (min-width: 640px) {
                    .sm\\:text-\\[16px\\] { font-size: 16px; }
                    .sm\\:px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
                    .sm\\:p-12 { padding: 3rem; }
                    .sm\\:px-\\[calc\\(var\\(--link-gap\\)\\*2\\)\\] { padding-left: calc(var(--link-gap) * 2); padding-right: calc(var(--link-gap) * 2); }
                }
                
                /* CSS Variables for Linktree compatibility */
                :root {
                    --link-gap: 0.75rem;
                    --button-style-text: inherit;
                }
            </style>
        `;

        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${minimalCSS}
</head>
<body>
    ${html}
    ${topBarInjectionScript}
    ${promotionalLinksScript}
    ${signupModalScript}
</body>
</html>`;
    };

    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe || !html) return;

        const doc = iframe.contentDocument;
        if (!doc) return;

        // Write the content
        doc.open();
        doc.write(getIframeContent());
        doc.close();

        // Adjust iframe height to content
        const adjustHeight = () => {
            if (doc.body) {
                const height = doc.body.scrollHeight;
                setIframeHeight(`${Math.max(height, window.innerHeight)}px`);
            }
        };

        // Adjust height after Tailwind loads
        setTimeout(adjustHeight, 500);
        setTimeout(adjustHeight, 1000);
        setTimeout(adjustHeight, 2000);
    }, [html]);

    return (
        <>
            <iframe
                ref={iframeRef}
                className="w-full border-0"
                style={{
                    height: iframeHeight,
                    minHeight: "100vh",
                }}
                title="Generated Page"
            />
            {/* Footer overlay */}
            {/* <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
                <Link
                    href="/"
                    className="text-xs font-medium opacity-50 hover:opacity-100 transition-opacity uppercase tracking-widest px-4 py-2 rounded-full bg-black/30 backdrop-blur-sm text-white"
                >
                    Powered by Entro.ly
                </Link>
            </div> */}
        </>
    );
}
