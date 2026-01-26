import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

// Public key for verifying SSO tokens
function getPublicKey(): string {
  const key = process.env.JWT_PUBLIC_KEY;
  if (!key) throw new Error("JWT_PUBLIC_KEY not configured");
  return key.replace(/\\n/g, "\n");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Define protected routes
  const isProtectedRoute = pathname.startsWith("/create") || pathname.startsWith("/dashboard") || pathname.startsWith("/commission");

  // 2. Get SSO access token
  const accessToken = request.cookies.get("sso_access_token")?.value;

  // 3. Verify token if present
  let isValid = false;
  let payload = null;

  if (accessToken) {
    try {
      const publicKey = await jose.importSPKI(getPublicKey(), "RS256");
      const verified = await jose.jwtVerify(accessToken, publicKey, {
        issuer: "sso.entro.ly",
        audience: ["entro.ly", "rank.entro.ly"],
      });
      isValid = true;
      payload = verified.payload;
    } catch (err) {
      console.error("Token verification failed:", err);
    }
  }

  // 4. Handle protected routes
  if (isProtectedRoute) {
    if (!isValid) {
      const loginUrl = new URL(`${process.env.NEXT_PUBLIC_SSO_URL || "https://sso.entro.ly"}/login`);
      // Use AUTH_URL for production redirect, fallback to request.url for development
      const baseUrl = process.env.AUTH_URL || "https://entro.ly";
      const redirectUrl = new URL(pathname, baseUrl);
      redirectUrl.search = request.nextUrl.search;
      loginUrl.searchParams.set("redirect", redirectUrl.toString());
      return NextResponse.redirect(loginUrl);
    }
  }

  // 5. Allow access
  const response = NextResponse.next();

  // Optional: Pass user info to headers for easier access in server components
  if (isValid && payload) {
    response.headers.set("X-User-Id", payload.sub as string);
    if (payload.username) {
      response.headers.set("X-User-Username", payload.username as string);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/public (public API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - images, etc.
     */
    "/((?!api/public|_next/static|_next/image|favicon.ico|.*\\.png$).*)",
  ],
};
