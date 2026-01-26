
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import * as jose from "jose";

function getPublicKey(): string {
  const key = process.env.JWT_PUBLIC_KEY;
  if (!key) throw new Error("JWT_PUBLIC_KEY not configured");
  return key.replace(/\\n/g, "\n");
}

export async function auth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("sso_access_token")?.value;

  if (!token) return null;

  try {
    const publicKey = await jose.importSPKI(getPublicKey(), "RS256");
    const { payload } = await jose.jwtVerify(token, publicKey, {
      issuer: "sso.entro.ly",
      audience: ["entro.ly", "rank.entro.ly"],
    });

    return {
      user: {
        id: payload.sub as string,
        email: payload.email as string,
        name: payload.name as string | undefined,
        image: null, // SSO token doesn't carry image yet
        username: payload.username as string | undefined,
      },
    };
  } catch (error) {
    return null;
  }
}

export async function signOut() {
  // Redirect to SSO logout which handles everything
  const ssoUrl = process.env.NEXT_PUBLIC_SSO_URL || "https://sso.entro.ly";
  const callbackUrl = encodeURIComponent("http://entro.ly"); // or origin
  redirect(`${ssoUrl}/api/auth/logout?callbackUrl=${callbackUrl}`);
}

// Handler stub for API routes if any use GET/POST handlers from NextAuth
export const handlers = {
  GET: () => new Response("Not implemented", { status: 501 }),
  POST: () => new Response("Not implemented", { status: 501 }),
};

export const signIn = () => {
  const ssoUrl = process.env.NEXT_PUBLIC_SSO_URL || "https://sso.entro.ly";
  redirect(`${ssoUrl}/login`);
};
