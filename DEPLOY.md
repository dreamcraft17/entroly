# Deploy ENTRO.LY: Vercel & Railway

Panduan singkat deploy app ke **Vercel** (frontend + API) dan/atau **Railway** (app + PostgreSQL). Project ini siap deploy di kedua platform.

---

## Ready to deploy – ceklist

Sebelum deploy, pastikan:

| Cek | Lokal (dev) | Vercel / Railway (production) |
|-----|-------------|-------------------------------|
| **Env** | File **`.env.local`** ada (copy dari `.env.example` kalau belum). Isi: `DATABASE_URL`, `JWT_PUBLIC_KEY`, `AUTH_URL`, `NEXT_PUBLIC_SSO_URL`. | Set semua env di **Project → Settings → Environment Variables**. |
| **Database** | `DATABASE_URL` valid. Jalankan sekali: `npx prisma migrate deploy`. | `DATABASE_URL` dari Railway/Neon/Supabase. Migrasi jalan otomatis (Railway: preDeploy) atau jalankan manual sekali. |
| **SSO** | `JWT_PUBLIC_KEY` = public key dari SSO. `NEXT_PUBLIC_SSO_URL` = URL SSO. | Sama. Pastikan domain Entroly & SSO satu induk (mis. `.entro.ly`) agar cookie login terbaca. |
| **URL** | `AUTH_URL` = `http://localhost:3000`. | `AUTH_URL` = URL production (mis. `https://entro.ly` atau `https://xxx.vercel.app`). |
| **Build** | `npm run build` atau `npm run vercel-build` sukses. | Vercel pakai `vercel-build`; Railway pakai `build`. Konfig ada di `vercel.json` / `railway.json`. |

- **`.env.local`** sudah ada di folder `Entroly` (template); isi nilai asli lalu simpan. File ini tidak di-commit (aman).

---

## Langkah deploy (step-by-step)

### Opsi A: Deploy di Vercel

| Step | Apa yang dilakukan |
|------|--------------------|
| **1** | Siapkan database: buat PostgreSQL di [Railway](https://railway.app) (atau Neon/Supabase), salin `DATABASE_URL`. |
| **2** | Di laptop: buat file `.env.local` di folder `Entroly`, isi `DATABASE_URL`, lalu jalankan `npx prisma migrate deploy` (satu kali). |
| **3** | Buka [vercel.com](https://vercel.com) → **Add New** → **Project** → pilih repo GitHub. |
| **4** | Jika repo punya banyak folder: di **Root Directory** pilih `Entroly`. Biarkan **Build** dan **Install** pakai dari `vercel.json`. |
| **5** | **Settings** → **Environment Variables** → tambah: `DATABASE_URL`, `JWT_PUBLIC_KEY`, `AUTH_URL` (URL Vercel nanti, mis. `https://xxx.vercel.app`), `NEXT_PUBLIC_SSO_URL`. Opsional: `GOOGLE_API_KEY`. |
| **6** | Klik **Deploy**. Setelah selesai, copy URL production (mis. `https://entroly.vercel.app`). |
| **7** | Di Vercel → **Settings** → **Environment Variables** → edit `AUTH_URL` jadi URL production tadi, lalu **Redeploy**. |

### Opsi B: Deploy di Railway (app + database dalam satu project)

| Step | Apa yang dilakukan |
|------|--------------------|
| **1** | Buka [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo** (pilih repo). |
| **2** | Jika repo punya banyak folder: di service yang terbuat → **Settings** → **Root Directory** = `Entroly`. |
| **3** | Di project yang sama: **Add Service** → **Database** → **PostgreSQL**. Tunggu sampai jalan. |
| **4** | Klik service **PostgreSQL** → tab **Variables** → salin `DATABASE_URL`. |
| **5** | Klik service **Web (Next.js)** → **Variables** → **Add Variable**: paste `DATABASE_URL`, lalu tambah `JWT_PUBLIC_KEY`, `AUTH_URL` (isi sementara `https://placeholder.up.railway.app`), `NEXT_PUBLIC_SSO_URL`. Opsional: `GOOGLE_API_KEY`. |
| **6** | **Deploy** (atau trigger deploy). Setelah deploy selesai, buka **Settings** → **Networking** → **Generate Domain** (atau pakai domain yang ada). |
| **7** | Copy URL public (mis. `https://entroly.up.railway.app`) → **Variables** → edit `AUTH_URL` jadi URL itu. Redeploy sekali lagi. |

---

## 1. Database (PostgreSQL)

Bisa pakai **Railway PostgreSQL** atau provider lain (Neon, Supabase, dll.).

### Buat PostgreSQL di Railway

1. Buka [railway.app](https://railway.app) dan login.
2. **New Project** → pilih **Deploy PostgreSQL** (atau **Empty Project** lalu **Add Service** → **Database** → **PostgreSQL**).
3. Setelah service PostgreSQL jalan, buka tab **Variables**.
4. Salin **`DATABASE_URL`** (format: `postgresql://postgres:PASSWORD@HOST:PORT/railway`).  
   Railway biasanya sudah set **SSL**; kalau belum, tambahkan `?sslmode=require` di akhir URL.

### Jalankan migrasi pertama (lokal)

Di laptop (dengan `.env` yang isi `DATABASE_URL`):

```bash
# Opsi A: Pakai migrasi Prisma (recommended)
npx prisma migrate deploy

# Opsi B: Sinkron schema tanpa migrasi (untuk awal / dev)
npx prisma db push
```

Kalau pakai **Opsi B**, nanti bikin migrasi: `npx prisma migrate dev --name init`, commit `prisma/migrations`, lalu deploy berikutnya pakai `prisma migrate deploy`.

---

## 2. App di Vercel

### Import & deploy

1. Buka [vercel.com](https://vercel.com) dan login (GitHub, dll.).
2. **Add New** → **Project** → pilih repo (jika monorepo, set **Root Directory** ke `Entroly`).
3. **Framework Preset**: Next.js (terdeteksi otomatis).
4. **Build Command**: pakai dari `vercel.json` → `npm run vercel-build` (prisma generate + next build).
5. **Install Command**: `npm ci` (dari vercel.json).

Konfigurasi build ada di **`vercel.json`**; tidak perlu ubah di dashboard kecuali override.

### Environment Variables (Vercel)

Di **Project** → **Settings** → **Environment Variables**:

| Name | Value | Environment |
|------|--------|-------------|
| `DATABASE_URL` | (dari Railway/Neon/Supabase) | Production, Preview |
| `JWT_PUBLIC_KEY` | (public key PEM dari SSO) | Production, Preview |
| `AUTH_URL` | `https://your-app.vercel.app` (domain production) | Production |
| `NEXT_PUBLIC_SSO_URL` | `https://sso.entro.ly` (atau URL SSO) | Production, Preview |
| `GOOGLE_API_KEY` | (opsional, untuk fitur AI) | Production, Preview |

Lalu **Redeploy** supaya env dipakai.

---

## 3. App di Railway (Next.js)

Project ini punya **`railway.json`** sehingga deploy Next.js di Railway otomatis memakai perintah yang benar.

### Deploy app ke Railway

1. Buka [railway.app](https://railway.app) → **New Project**.
2. **Deploy from GitHub repo** (atau **Empty Project** + connect repo).
3. Set **Root Directory** ke `Entroly` jika repo berisi banyak folder.
4. Tambah service **PostgreSQL** di project yang sama (atau pakai database yang sudah ada).
5. Di service **Web (Next.js)** → **Variables** → tambahkan env yang sama seperti Vercel:
   - `DATABASE_URL` (dari service PostgreSQL Railway atau paste manual)
   - `JWT_PUBLIC_KEY`
   - `AUTH_URL` = URL deployment Railway (mis. `https://xxx.up.railway.app`)
   - `NEXT_PUBLIC_SSO_URL`
   - `GOOGLE_API_KEY` (opsional)

Build & start diatur di **`railway.json`**:

- **Build**: `npm run build` (setelah `npm install` → postinstall menjalankan `prisma generate`).
- **Start**: `npm run start` (`next start`).
- **Pre-deploy**: `npm run db:migrate` (migrasi Prisma sebelum start).
- **Health check**: path `/api/health`.

Node version mengikuti **`package.json`** → `engines.node` (≥20.x).

---

## 4. Ringkasan alur

**Vercel (app):**

```
Database (Railway/Neon/dll.)     Vercel (Next.js)
       │                                │
       │  DATABASE_URL                  │
       └────────────────────────────────►  Env vars
                                           npm ci → vercel-build (prisma generate + next build)
```

**Railway (app + DB):**

```
Railway Project
  ├── PostgreSQL service  →  DATABASE_URL
  └── Web service        →  Root: Entroly, railway.json (build / start / db:migrate / health)
```

- **Vercel**: Build = `npm run vercel-build` (prisma generate + next build). ERD generator dimatikan di schema agar build tidak butuh Puppeteer.
- **Railway**: Build = `npm run build`, start = `npm run start`, pre-deploy = `npm run db:migrate`, health = `/api/health`.

---

## 5. SSO ↔ Entroly: Apakah sudah terhubung?

**Ya.** Setelah env dan domain diatur benar, alurnya:

1. User buka halaman yang dilindungi di Entroly (mis. `/dashboard` atau `/create`) → belum login → **redirect ke SSO** (`NEXT_PUBLIC_SSO_URL/login?redirect=<AUTH_URL>/dashboard`).
2. User **login di SSO** (email/password atau TikTok OAuth).
3. SSO meng-set cookie **`sso_access_token`** dengan **domain `.entro.ly`** (production), lalu redirect ke URL `redirect` tadi (kembali ke Entroly).
4. Browser mengirim cookie itu ke **Entroly** (karena sama-sama di bawah `*.entro.ly`).
5. Entroly **memverifikasi JWT** dengan `JWT_PUBLIC_KEY` (public key dari SSO) → user dianggap **sudah login di Entroly**.

**Syarat agar “login via SSO = sudah login di Entroly”:**

- **Domain induk sama:** SSO dan Entroly harus pakai domain yang satu induk, mis. SSO = `sso.entro.ly`, Entroly = `entro.ly` atau `app.entro.ly`. Cookie SSO di-set dengan `domain: ".entro.ly"` agar bisa dibaca oleh Entroly.
- **Kalau deploy Entroly di Vercel:** URL default (`*.vercel.app`) **tidak** satu domain dengan SSO, jadi cookie SSO tidak terkirim. **Wajib pakai custom domain** (mis. `entro.ly` atau `app.entro.ly`) di Vercel/Railway dan set **AUTH_URL** ke URL production itu.
- **Env:** `JWT_PUBLIC_KEY` di Entroly = public key dari key pair yang dipakai SSO; `NEXT_PUBLIC_SSO_URL` = URL SSO; `AUTH_URL` = URL production Entroly (untuk redirect setelah login).

---

## 6. NPM scripts (referensi)

| Script | Kegunaan |
|--------|----------|
| `npm run build` | Build production (Railway pakai ini). |
| `npm run vercel-build` | prisma generate + next build (Vercel pakai ini). |
| `npm run build:server` | Build + restart PM2 (server sendiri). |
| `npm run start` | Jalankan production server (`next start`). |
| `npm run db:migrate` | `prisma migrate deploy` (set DATABASE_URL dulu). |
| `npm run db:studio` | Prisma Studio (set DATABASE_URL dulu). |

---

## 7. Troubleshooting

- **Build gagal: `npm install` / TAR_ENTRY_ERROR / ECONNRESET**  
  - Repo pakai **`vercel.json`** (`installCommand: "npm ci"`) dan **`.npmrc`** (retry + timeout).  
  - Di Vercel: **Settings → General** → **Build Cache** → **Clear** → **Redeploy**.  
  - Pastikan **`package-lock.json`** di-commit. Jika masih gagal, coba **Install Command** kosongkan (pakai default `npm install`).

- **Build gagal / Prisma client not found**  
  Vercel memakai **Build Command** `npm run vercel-build` (prisma generate + next build). Pastikan `vercel.json` → `buildCommand`: `npm run vercel-build` dan tidak di-override di dashboard.

- **Database connection error di production**  
  - Cek `DATABASE_URL` di Vercel (Production) sama dengan yang di Railway.  
  - Untuk Railway, URL biasanya sudah pakai SSL; kalau belum, tambah `?sslmode=require`.

- **JWT / auth error**  
  Pastikan `JWT_PUBLIC_KEY` di Vercel sama dengan public key yang dipakai SSO (format PEM, bisa satu baris dengan `\n` untuk line break).

- **Redirect setelah login salah**  
  Set **AUTH_URL** di Vercel ke URL production (mis. `https://xxx.vercel.app`).
