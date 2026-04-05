# Foundry 🚀
> Where startup journeys come alive — a story-driven startup discovery platform for India.

---

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database + Auth**: Supabase
- **Deployment**: Vercel

---

## Setup Guide (Step by Step)

### Step 1 — Install Node.js
Download from https://nodejs.org (choose LTS version)

### Step 2 — Clone / Download this project
Put all these files in a folder called `foundry` on your computer.

### Step 3 — Install dependencies
Open your terminal inside the `foundry` folder and run:
```bash
npm install
```

### Step 4 — Set up Supabase
1. Go to https://supabase.com and create a free account
2. Click "New Project" — give it a name like "foundry"
3. Go to **SQL Editor** → **New Query**
4. Copy everything from `lib/schema.sql` and paste it → click **Run**
5. Go to **Settings** → **API**
6. Copy your **Project URL** and **anon public key**

### Step 5 — Add your Supabase keys
1. Copy `.env.local.example` and rename it to `.env.local`
2. Open `.env.local` and fill in:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 6 — Run locally
```bash
npm run dev
```
Open http://localhost:3000 — your site is live!

### Step 7 — Deploy to Vercel
1. Push your code to GitHub
2. Go to https://vercel.com → "New Project" → import your repo
3. Add your environment variables (same as .env.local)
4. Click Deploy — done!

---

## Pages

| URL | Description |
|---|---|
| `/` | Homepage with featured startups, founders, jobs |
| `/startups` | All startup stories |
| `/startups/[id]` | Single startup story page |
| `/founders` | Founder profiles |
| `/jobs` | Jobs board |
| `/admin` | Admin dashboard |
| `/admin/startups` | Manage startups (add/edit/publish/delete) |
| `/admin/founders` | Manage founders |
| `/admin/jobs` | Manage jobs |

---

## Adding Data
Go to `/admin/startups` to add your first startup. No code needed — just fill in the form and click Publish.

---

## Folder Structure
```
foundry/
├── app/
│   ├── page.jsx              ← Homepage
│   ├── layout.jsx            ← Root layout
│   ├── globals.css           ← Global styles
│   ├── startups/
│   │   ├── page.jsx          ← Startups listing
│   │   └── [id]/page.jsx     ← Single startup
│   ├── founders/page.jsx     ← Founders listing
│   ├── jobs/page.jsx         ← Jobs board
│   └── admin/
│       ├── layout.jsx        ← Admin sidebar layout
│       ├── page.jsx          ← Admin dashboard
│       ├── startups/page.jsx ← Manage startups
│       ├── founders/page.jsx ← Manage founders
│       └── jobs/page.jsx     ← Manage jobs
├── components/
│   ├── Navbar.jsx
│   ├── StartupCard.jsx
│   ├── FounderCard.jsx
│   └── JobCard.jsx
├── lib/
│   ├── supabase.js           ← DB client
│   └── schema.sql            ← Run this in Supabase
├── .env.local.example        ← Copy to .env.local
├── next.config.js
├── tailwind.config.js
└── package.json
```
