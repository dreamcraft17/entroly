# Deploy ENTRO.LY: Vercel + Railway (PostgreSQL)

Panduan singkat deploy app ke **Vercel** dan database **PostgreSQL di Railway**.

---

## 1. Database di Railway

### Buat project & PostgreSQL

1. Buka [railway.app](https://railway.app) dan login.
2. **New Project** → pilih **Deploy PostgreSQL** (atau **Empty Project** lalu **Add Service** → **Database** → **PostgreSQL**).
3. Setelah service PostgreSQL jalan, buka tab **Variables**.
4. Salin **`DATABASE_URL`** (format: `postgresql://postgres:PASSWORD@HOST:PORT/railway`).  
   Railway biasanya sudah set **SSL**; kalau belum, tambahkan `?sslmode=require` di akhir URL.

### Jalankan migrasi (setelah dapat DATABASE_URL)

Di laptop (dengan `.env` yang isi `DATABASE_URL` dari Railway):

```bash
# Opsi A: Pakai migrasi Prisma (kalau sudah ada folder prisma/migrations)
npx prisma migrate deploy

# Opsi B: Sinkron schema tanpa migrasi (untuk awal / dev)
npx prisma db push
```

Kalau pakai **Opsi B**, nanti untuk production disarankan bikin migrasi:

```bash
npx prisma migrate dev --name init
```

Lalu commit folder `prisma/migrations` dan untuk deploy berikutnya pakai `prisma migrate deploy`.

---

## 2. App di Vercel

### Import & deploy

1. Buka [vercel.com](https://vercel.com) dan login (bisa pakai GitHub).
2. **Add New** → **Project** → pilih repo **Entroly** (atau import dari GitHub).
3. **Framework Preset**: Next.js (biasanya terdeteksi otomatis).
4. **Build Command**: `next build` (default).
5. **Install Command**: default (`npm install`).  
   Setelah install, script **postinstall** akan jalan dan menjalankan `prisma generate`.

### Environment Variables

Di **Project** → **Settings** → **Environment Variables** tambahkan:

| Name | Value | Environment |
|------|--------|-------------|
| `DATABASE_URL` | (paste dari Railway) | Production, Preview |
| `JWT_PUBLIC_KEY` | (public key PEM dari SSO) | Production, Preview |
| `AUTH_URL` | `https://your-app.vercel.app` (ganti dengan domain Vercel kamu) | Production |
| `NEXT_PUBLIC_SSO_URL` | `https://sso.entro.ly` (atau URL SSO kamu) | Production, Preview |
| `GOOGLE_API_KEY` | (opsional, untuk fitur AI) | Production, Preview |

- **DATABASE_URL**: wajib; dari Railway.
- **JWT_PUBLIC_KEY**: wajib; app akan error kalau tidak di-set.
- **AUTH_URL**: URL production app (domain Vercel) untuk redirect setelah login.
- **NEXT_PUBLIC_SSO_URL**: URL SSO; bisa sama dengan yang dipakai di dev.
- **GOOGLE_API_KEY**: hanya kalau pakai fitur generate AI.

Lalu **Redeploy** (Deployments → ⋮ → Redeploy) supaya env dipakai.

---

## 3. Ringkasan alur

```
Railway (PostgreSQL)          Vercel (Next.js)
       │                             │
       │  DATABASE_URL (copy)        │
       └────────────────────────────►  Env vars di Vercel
                                      postinstall → prisma generate
                                      next build → deploy
```

- **Build di Vercel**: `npm install` → `prisma generate` (postinstall) → `next build`.
- **Database**: Hanya Railway; Vercel tidak perlu akses langsung, cukup `DATABASE_URL`.

---

## 4. NPM scripts (referensi)

| Script | Kegunaan |
|--------|----------|
| `npm run build` | Build untuk production (Vercel pakai ini). |
| `npm run build:server` | Build + restart PM2 (untuk server sendiri). |
| `npm run db:migrate` | Jalankan `prisma migrate deploy` (set DATABASE_URL dulu). |
| `npm run db:studio` | Buka Prisma Studio (set DATABASE_URL dulu). |

---

## 5. Troubleshooting

- **Build gagal: `npm install` / TAR_ENTRY_ERROR / ECONNRESET**  
  - Repo sudah pakai **`vercel.json`** dengan `installCommand: "npm ci"` dan **`.npmrc`** (retry + timeout) agar install lebih stabil.  
  - Di Vercel: **Project → Settings → General** → **Build Cache** → **Clear** → lalu **Redeploy**.  
  - Pastikan **`package-lock.json`** ikut di-commit. Kalau build tetap gagal, di Vercel **Settings → Environment** ubah **Install Command** jadi kosong (pakai default `npm install`) dan coba deploy lagi.

- **Build gagal / Prisma client not found**  
  Pastikan `postinstall`: `prisma generate` ada di `package.json` dan **Install Command** di Vercel tidak menimpa install (default atau `npm ci`).

- **Database connection error di production**  
  - Cek `DATABASE_URL` di Vercel (Production) sama dengan yang di Railway.  
  - Untuk Railway, URL biasanya sudah pakai SSL; kalau belum, tambah `?sslmode=require`.

- **JWT / auth error**  
  Pastikan `JWT_PUBLIC_KEY` di Vercel sama dengan public key yang dipakai SSO (format PEM, bisa satu baris dengan `\n` untuk line break).

- **Redirect setelah login salah**  
  Set **AUTH_URL** di Vercel ke URL production (mis. `https://xxx.vercel.app`).
