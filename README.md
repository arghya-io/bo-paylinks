# BlueOrbit PayLink Generator

A lightweight, production-ready **UPI Payment Link Generator** built with React, TypeScript, Vite, and Supabase. Generate shareable payment links and QR codes in seconds — no payment gateway, no KYC, just links.

---

## Features

- **Instant link generation** — create a shareable `/pay/:token` URL in two steps
- **Standard UPI & Bank Account support** — accepts both UPI IDs and account + IFSC pairs
- **QR code generation** — every link includes a scannable UPI deep-link QR code
- **Optional amount & note** — pre-fill or leave open for flexible payments
- **Expiry handling** — links auto-expire after 2 years (configurable in DB)
- **Copy & native share** — one-tap copy or native OS share sheet on mobile
- **Dark glassmorphic UI** — smooth splash transitions, animated background
- **Serverless-ready** — static frontend, all data via Supabase (no custom backend)

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, TypeScript, Vite          |
| Styling    | Tailwind CSS, shadcn/ui (minimal)   |
| Database   | Supabase (PostgreSQL + RLS)         |
| QR Codes   | qrcode.react                        |
| Routing    | React Router v6                     |
| Toasts     | Sonner                              |
| Deployment | Vercel                              |

---

## Project Structure

```
blueorbitpay/
├── public/
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── assets/
│   │   └── moon-bg.jpg           # Background image
│   ├── components/
│   │   ├── ui/                   # Minimal UI primitives (toast, tooltip, sonner)
│   │   ├── Footer.tsx
│   │   ├── MeteorBackground.tsx
│   │   └── SplashScreen.tsx
│   ├── hooks/
│   │   └── use-toast.ts
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts         # Supabase client initialisation
│   │       └── types.ts          # Generated DB types
│   ├── lib/
│   │   ├── upi.ts                # UPI validation & deep-link builder
│   │   └── utils.ts              # cn() helper
│   ├── pages/
│   │   ├── Index.tsx             # Landing page
│   │   ├── CreateLink.tsx        # 2-step link creation form
│   │   ├── GeneratedLink.tsx     # Post-creation QR + share page
│   │   ├── PublicPay.tsx         # Public payment page (/pay/:token)
│   │   └── NotFound.tsx          # 404 page
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── supabase/
│   └── migrations/
│       └── 001_create_payment_requests.sql
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## Local Setup

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project

### 1. Clone & install

```bash
git clone https://github.com/your-org/blueorbitpay.git
cd blueorbitpay
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Find these values in your Supabase dashboard under **Project Settings → API**.

### 3. Run the database migration

In the Supabase dashboard, open the **SQL Editor** and run:

```
supabase/migrations/001_create_payment_requests.sql
```

Or use the Supabase CLI:

```bash
supabase db push
```

### 4. Start the dev server

```bash
npm run dev
```

---

## Deployment (Vercel)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-org/blueorbitpay.git
git push -u origin main
```

### 2. Import in Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repository
3. Framework preset: **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`

### 3. Set environment variables in Vercel

In **Project Settings → Environment Variables**, add:

| Variable               | Value                                        |
|------------------------|----------------------------------------------|
| `VITE_SUPABASE_URL`    | `https://your-project-id.supabase.co`        |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key              |

### 4. Deploy

Vercel will auto-deploy on every push to `main`. For SPA routing to work correctly, add a `vercel.json` at the project root:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## Environment Variables Reference

| Variable               | Required | Description                                      |
|------------------------|----------|--------------------------------------------------|
| `VITE_SUPABASE_URL`    | ✅       | Your Supabase project URL                        |
| `VITE_SUPABASE_ANON_KEY` | ✅     | Supabase anonymous (public) API key              |

> **Never commit** `.env.local` or any file containing real keys to version control. The `.gitignore` already excludes `*.local` files.

---

## Database Schema

### `payment_requests`

| Column                | Type        | Notes                                     |
|-----------------------|-------------|-------------------------------------------|
| `id`                  | UUID        | Primary key, auto-generated               |
| `name`                | TEXT        | Payee display name                        |
| `upi_type`            | ENUM        | `standard` or `bank`                      |
| `upi_id`              | TEXT        | Standard UPI ID (e.g. `name@bank`)        |
| `bank_account_number` | TEXT        | Bank account number (9–18 digits)         |
| `ifsc_code`           | TEXT        | Bank IFSC code                            |
| `amount`              | NUMERIC     | Optional pre-filled amount                |
| `note`                | TEXT        | Optional payment note (max 100 chars)     |
| `unique_token`        | TEXT        | URL-safe token, indexed, auto-generated   |
| `expires_at`          | TIMESTAMPTZ | Defaults to 2 years from creation         |
| `created_at`          | TIMESTAMPTZ | Auto-set on insert                        |

Row Level Security is enabled. Public read and insert policies allow unauthenticated access (required for public payment pages).

---

## License

MIT — free to use, modify, and distribute.

## *Disclosure

This project is for educational/demo purposes.
Not intended for real financial transactions without proper compliance.
