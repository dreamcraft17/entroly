# ENTRO.LY — Spesifikasi Teknis (Web Stack)

Dokumen ringkas stack dan spesifikasi teknis aplikasi ENTRO.LY (link-in-bio untuk Kreator TikTok Shop).

---

## Ringkasan

| Aspek | Stack |
|--------|--------|
| **Nama** | ENTRO.LY (links) |
| **Tipe** | Web app (link-in-bio + dashboard kreator) |
| **Runtime** | Node.js ≥ 20.x |

---

## 1. Frontend

| Kategori | Teknologi |
|----------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **UI** | React 19 |
| **Bahasa** | TypeScript 5 |
| **Styling** | Tailwind CSS 4, PostCSS |
| **Komponen UI** | Radix UI (Label, Slot), komponen custom (Button, Card, Input, Textarea) |
| **Ikon** | Lucide React |
| **Form** | React Hook Form + Zod (validasi) |
| **State (client)** | Zustand |
| **Utility** | clsx, tailwind-merge, class-variance-authority (CVA) |
| **Font** | Inter (Google Fonts) |

---

## 2. Backend / API

| Kategori | Teknologi |
|----------|-----------|
| **Runtime** | Next.js (Node.js) |
| **API** | Next.js Route Handlers (App Router) — `src/app/api/` |
| **Server logic** | Server Actions — `src/actions/` |
| **Middleware** | Next.js Middleware — `src/middleware.ts` (auth, redirect) |

---

## 3. Database

| Kategori | Teknologi |
|----------|-----------|
| **DB** | PostgreSQL |
| **ORM** | Prisma 7 |
| **Driver** | `pg` + `@prisma/adapter-pg` (driver adapter) |
| **Config** | `prisma.config.ts` + `prisma/schema.prisma` |

**Model inti (Prisma):** User, Account, Session, VerificationToken, Profile, Link, AIGeneratedPage, Commission, Kasbon.

---

## 4. Auth

| Kategori | Teknologi |
|----------|-----------|
| **Arsitektur** | SSO eksternal (JWT) — bukan NextAuth session DB |
| **Verifikasi** | JWT (RS256) via `jose` |
| **Cookie** | `sso_access_token` (HTTP-only, dll. di sisi SSO) |
| **Env** | `JWT_PUBLIC_KEY`, `NEXT_PUBLIC_SSO_URL`, `AUTH_URL` |
| **Referensi** | NextAuth 5 beta + @auth/prisma-adapter (untuk skema/DB, bukan session) |

Login/register: redirect ke SSO (`sso.entro.ly`); setelah login, SSO set cookie JWT; app baca cookie dan verifikasi dengan `JWT_PUBLIC_KEY`.

---

## 5. AI / Integrasi Eksternal

| Kategori | Teknologi |
|----------|-----------|
| **Generatif (teks/gambar)** | Google Generative AI (`@google/generative-ai`) — env: `GOOGLE_API_KEY` |
| **Lain** | OpenAI SDK (`openai`) — dipakai di script/tes (bukan di flow utama deploy) |
| **Fitur** | Generate halaman AI, clone Linktree (AI), edit elemen, generate icon, add section |

---

## 6. Lain-lain

| Kategori | Teknologi |
|----------|-----------|
| **Caching** | node-cache (in-memory) — `src/lib/profile-cache.ts` |
| **Password** | bcryptjs (hash) |
| **Browser automation** | Playwright Core, puppeteer-extra, stealth (untuk scrape/clone) |
| **Gambar** | Next.js Image (dicebear, tiktokcdn, dll.) — `next.config.ts` remotePatterns |

---

## 7. Hosting & DevOps

| Aspek | Pilihan |
|--------|---------|
| **App** | Vercel (Next.js) |
| **Database** | Railway (PostgreSQL) |
| **Env** | Vercel Environment Variables; lokal `.env` / `.env.local` |
| **Build** | `npm ci` → `prisma generate` (postinstall) → `next build` |
| **Lock file** | package-lock.json (npm) |

---

## 8. Struktur Repo (ringkas)

```
Entroly/
├── prisma/
│   ├── schema.prisma
│   └── prisma.config.ts
├── src/
│   ├── app/              # App Router: page, layout, api
│   │   ├── api/          # Route Handlers (profiles, links, ai, kasbon, commission, dll.)
│   │   ├── [username]/   # Halaman public link-in-bio
│   │   ├── dashboard/    # Dashboard kreator
│   │   ├── login, register, create, about, features, terms, privacy, commission
│   │   └── create/ai-generated/
│   ├── actions/          # Server Actions (profile, ai-page)
│   ├── components/       # UI + dashboard + AI
│   ├── lib/              # auth, prisma, utils, profile-cache
│   ├── middleware.ts
│   ├── store/
│   ├── types/
│   └── data/
├── next.config.ts
├── vercel.json
├── .npmrc
├── package.json
├── DEPLOY.md
└── SPEC.md (this file)
```

---

## 9. Environment Variables (ringkas)

| Variable | Wajib | Keterangan |
|----------|--------|------------|
| `DATABASE_URL` | ✅ | Connection string PostgreSQL (Railway) |
| `JWT_PUBLIC_KEY` | ✅ | Public key PEM (RS256) untuk verifikasi JWT SSO |
| `AUTH_URL` | ✅ (prod) | URL app production (redirect setelah login) |
| `NEXT_PUBLIC_SSO_URL` | Opsional | URL SSO (default: https://sso.entro.ly) |
| `GOOGLE_API_KEY` | Opsional | Untuk fitur generate AI |

---

*Terakhir diperbarui sesuai codebase saat ini (Next 16, React 19, Prisma 7, Node ≥20).*
