# Gasparin Blog

A personal blog built with Next.js, Prisma, and SQLite.

## Tech Stack

- **Framework:** Next.js 16, React 19, TypeScript
- **Database:** SQLite via Prisma 7 (with `@prisma/adapter-better-sqlite3`)
- **Auth:** NextAuth.js
- **Styling:** Tailwind CSS
- **Editor:** Rich text editor for admin post creation

## Quick Start

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

Copy `.env.example` (if available) or set:

```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

## Project Structure

```
gasparin-blog/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── admin/        # Admin dashboard & post editor
│   │   ├── api/          # API routes (posts, auth, subscribe)
│   │   ├── login/        # Auth page
│   │   └── posts/[slug]/ # Public post pages
│   ├── components/       # React components
│   ├── lib/              # Prisma client, auth config, utils
│   └── types/            # TypeScript type extensions
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Migration history
├── scripts/              # Export & seed scripts
└── exports/              # Generated document exports
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Next.js dev server (port 3000) |
| `npm run build` | Production build |
| `npx prisma studio` | Database browser |
