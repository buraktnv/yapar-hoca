# YaparHoca Blog Platform

A modern, full-featured blog platform built with Next.js 15, Supabase, and TinyMCE for educational content.

## Tech Stack

- **Next.js 15** with App Router
- **Supabase** for authentication, PostgreSQL database, and storage
- **Prisma** ORM
- **TinyMCE** rich text editor
- **shadcn/ui** component library
- **Tailwind CSS** styling

## Features

### CMS Dashboard
- Category management
- Blog post management with rich text editor
- User management (admin only)
- Image upload to Supabase Storage
- Draft/Publish workflow
- Email/password and magic link authentication

### Public Blog
- Responsive blog homepage
- Individual post pages with SEO metadata
- Category filtering
- Dynamic navigation from database

---

## Quick Start

### Docker Setup (Recommended)

1. Copy `env.example` to `.env`:

```bash
cp env.example .env
```

2. Start PostgreSQL with Docker:

```bash
npm run docker:db
```

3. Run migrations:

```bash
npm run docker:migrate
```

4. Start the full application:

```bash
npm run docker:up
```

5. Preview the database:

```bash
npm run docker:studio
```

### Manual Setup (Alternative)

1. Copy `env.example` to `.env` and set `DATABASE_URL`.
2. Run migrations and generate client:

```
npx prisma migrate dev --name init
```

Preview the database:

```
npx prisma studio
```

API routes:

- `GET /api/categories` — list categories
- `POST /api/categories` — create `{ name, slug }`
- `GET /api/posts` — list posts with categories
- `POST /api/posts` — create `{ title, slug, content, excerpt?, published?, categoryIds? }`
- `GET /api/posts/:id` — fetch a post
- `PUT /api/posts/:id` — update fields above; set categories with `categoryIds`
- `DELETE /api/posts/:id` — delete a post

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# yapar-hoca-frontend
# yapar-hoca
