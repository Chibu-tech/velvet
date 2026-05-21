# Velvet - Premium Nightlife Networking & Companionship Platform

Velvet is a production-ready, adult geo-social companionship and premium nightlife discovery platform. It features a luxury dark visual interface built on next-gen glassmorphism, glowing micro-animations, and fluid responsive design principles.

---

## 🌟 Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styles & Layout**: [TailwindCSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) + [PostGIS](https://postgis.net/) (via [Supabase](https://supabase.com/))
- **Real-Time Layer**: Supabase Realtime Channels
- **Asset Optimizations**: [Cloudinary](https://cloudinary.com/)

---

## 🚀 Getting Started

Follow these steps to launch the app locally:

### 1. Set Up Workspace
Set this folder (`scratch/velvet`) as your **active workspace** in your editor.

### 2. Install Dependencies
Install all NPM requirements:
```bash
npm install
```

### 3. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database Integration

We have supplied a complete, highly indexed PostGIS-ready SQL schema script:
👉 **[supabase/schema.sql](file:///C:/Users/LENOVO/.gemini/antigravity-ide/scratch/velvet/supabase/schema.sql)**

To provision your live backend database:
1. Create a free project on [Supabase.com](https://supabase.com).
2. Install the **PostGIS extension** in your Supabase SQL Editor.
3. Paste the contents of `supabase/schema.sql` into the SQL Editor and click **Run**.
4. Duplicate `.env.example` as `.env.local` and paste your project API credentials.
5. Set `NEXT_PUBLIC_USE_MOCK_STATE=false` to switch from the high-fidelity simulated engine to live Postgres tables!

---

## 📂 Codebase Architecture

```
velvet/
├── supabase/
│   └── schema.sql                 # Fully indexed PostGIS databases & RLS Policies
├── src/
│   ├── app/                       # Clean routing architectures
│   ├── components/                # Modular premium layouts and custom widgets
│   ├── hooks/                     # Custom hooks (Gestures, Swiping)
│   ├── lib/                       # API clients & simulated state templates
│   └── store/                     # Zustand central store
```

Enjoy vibe-coding inside Velvet! 🥂✨
# velvet
