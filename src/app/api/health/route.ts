import { NextResponse } from "next/server";

/**
 * Health check endpoint untuk Railway/Vercel (monitoring & readiness).
 */
export async function GET() {
  return NextResponse.json({ ok: true, timestamp: new Date().toISOString() });
}
