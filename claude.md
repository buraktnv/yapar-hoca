# YaparHoca Blog Platform

## Project Overview

YaparHoca is a modern, full-featured blog platform built with Next.js 15, focusing on educational content (mathematics and education topics). The platform features a powerful CMS dashboard for content management and a clean, responsive public-facing blog.

## Tech Stack

### Core Technologies
- **Next.js 15.5.2** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5.x** - Type safety
- **Tailwind CSS 4.x** - Styling
- **Prisma 6.16.2** - ORM for database management
- **Supabase** - Authentication, PostgreSQL database, and file storage

### UI Components
- **shadcn/ui** - Accessible component library built on Radix UI
- **TinyMCE 8.0.2** - Rich text editor for blog content
- **Sonner** - Toast notifications
- **Lucide React** - Icon library

### Authentication & Database
- **Supabase Auth** - Email/password and magic link authentication
- **PostgreSQL** - Primary database (hosted on Supabase)
- **Supabase Storage** - Image and media storage

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── (site)/              # Public blog routes
│   │   │   ├── [slug]/          # Individual blog post pages
│   │   │   ├── category/[slug]/ # Category listing pages
│   │   │   ├── login/           # Login page
│   │   │   ├── layout.tsx       # Site layout with navbar
│   │   │   └── page.tsx         # Homepage
│   │   ├── (cms)/dashboard/     # CMS dashboard routes
│   │   │   ├── categories/      # Category management
│   │   │   ├── posts/           # Post management
│   │   │   ├── users/           # User management (admin only)
│   │   │   ├── layout.tsx       # Dashboard layout
│   │   │   └── page.tsx         # Dashboard home
│   │   ├── api/                 # API routes
│   │   │   ├── categories/      # Category CRUD endpoints
│   │   │   └── posts/           # Post CRUD endpoints
│   │   └── auth/callback/       # Auth callback for magic links
│   ├── components/
│   │   ├── auth/                # Authentication components
│   │   ├── dashboard/           # Dashboard-specific components
│   │   ├── editor/              # TinyMCE editor wrapper
│   │   ├── navbar/              # Public site navigation
│   │   └── ui/                  # shadcn/ui components
│   ├── lib/
│   │   ├── auth/                # Auth helpers and actions
│   │   ├── supabase/            # Supabase clients
│   │   ├── prisma.ts            # Prisma client singleton
│   │   ├── storage.ts           # Supabase Storage helpers
│   │   └── utils.ts             # Utility functions
│   └── middleware.ts            # Route protection middleware
├── prisma/
│   └── schema.prisma            # Database schema
└── public/
    └── tinymce/                 # TinyMCE static assets (deleted - use CDN if needed)
```

## Database Schema

### User Model
```prisma
model User {
  id        String    @id @default(uuid())
  email     String    @unique
  name      String?
  role      UserRole  @default(USER)  // ADMIN | USER
  isActive  Boolean   @default(true)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  posts     Post[]
}
```

### Category Model
```prisma
model Category {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  posts       Post[]
}
```

### Post Model
```prisma
model Post {
  id             String     @id @default(cuid())
  title          String
  slug           String     @unique
  excerpt        String?
  content        String
  featuredImage  String?
  published      Boolean    @default(false)
  publishedAt    DateTime?
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt
  authorId       String
  author         User       @relation(...)
  categories     Category[]
}
```

## Setup Instructions

### 1. Prerequisites
- Node.js 20.x or higher
- npm or yarn
- Supabase account
- Git

### 2. Clone and Install

```bash
cd frontend
npm install
```

### 3. Supabase Setup

1. **Create a Supabase Project**
   - Go to [https://supabase.com](https://supabase.com)
   - Create a new project
   - Wait for the project to be provisioned

2. **Get Supabase Credentials**
   - Go to Project Settings > API
   - Copy the Project URL
   - Copy the `anon` public key
   - Copy the `service_role` secret key (for admin operations)
   - Go to Project Settings > Database
   - Copy the connection string

3. **Configure Supabase Storage**
   - Go to Storage in Supabase dashboard
   - Create a new bucket named `blog-images`
   - Make it public (or configure RLS policies as needed)

4. **Enable Email Auth**
   - Go to Authentication > Providers
   - Enable Email provider
   - Configure email templates if desired
   - Enable Magic Link authentication

### 4. Environment Variables

Create or update `.env` file in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database (Supabase PostgreSQL)
# Format: postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
DATABASE_URL="your_supabase_database_connection_string"

# Next.js
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 5. Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations to create tables
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view/edit data
npx prisma studio
```

### 6. Create First Admin User

Since user registration is restricted, you'll need to create the first admin user directly:

**Option A: Using Supabase Dashboard**
1. Go to Authentication > Users
2. Click "Add user"
3. Enter email and password
4. After creation, go to Database > Table Editor
5. Select the `User` table
6. Create a new row with:
   - `id`: Copy the user ID from Supabase Auth
   - `email`: Same email used in Auth
   - `name`: Your name
   - `role`: ADMIN
   - `isActive`: true

**Option B: Using Prisma Studio**
1. First create user in Supabase Auth dashboard
2. Run `npx prisma studio`
3. Open User table
4. Click "Add record"
5. Fill in the details (use the same ID from Supabase Auth)

### 7. Run Development Server

```bash
npm run dev
```

Visit:
- Public site: [http://localhost:3000](http://localhost:3000)
- Login: [http://localhost:3000/login](http://localhost:3000/login)
- Dashboard: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

## Key Features

### Authentication System
- **Email/Password Login** - Traditional authentication
- **Magic Link Login** - Passwordless authentication via email
- **Protected Routes** - Middleware-based route protection
- **Role-Based Access** - Admin and User roles with different permissions

### CMS Dashboard
- **Dashboard Home** - Quick stats and actions
- **Category Management**
  - Create, edit, delete categories
  - Auto-generate slugs from names
  - Track post counts per category
- **Post Management**
  - Rich text editor (TinyMCE) with full formatting options
  - Image upload to Supabase Storage
  - Featured image support
  - YouTube video embedding
  - Category assignment (multiple)
  - Draft/Publish workflow
  - Auto-generate slugs
- **User Management** (Admin only)
  - Create new users
  - Assign roles (Admin/User)
  - Password reset email sent automatically

### Public Blog
- **Homepage** - Grid layout of published posts
- **Individual Post Pages** - Full blog post view with SEO metadata
- **Category Pages** - Filter posts by category
- **Dynamic Navigation** - Navbar populated from database
- **Responsive Design** - Mobile-friendly throughout

### Content Editor (TinyMCE)
- Full WYSIWYG editing
- Image upload with automatic Supabase Storage integration
- YouTube video embedding
- Code syntax highlighting
- Tables, lists, and advanced formatting
- Auto-save functionality
- Light theme (matching site design)

## API Endpoints

### Categories
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category (auth required)
- `GET /api/categories/[id]` - Get single category
- `PUT /api/categories/[id]` - Update category (auth required)
- `DELETE /api/categories/[id]` - Delete category (auth required)

### Posts
- `GET /api/posts` - List all posts
- `POST /api/posts` - Create post (auth required)
- `GET /api/posts/[id]` - Get single post
- `PUT /api/posts/[id]` - Update post (auth required)
- `DELETE /api/posts/[id]` - Delete post (auth required)

## Authentication Flow

### Login Flow
1. User enters email/password or requests magic link
2. Supabase authenticates and creates session
3. Middleware checks session on protected routes
4. User redirected to dashboard if authenticated

### User Creation Flow (Admin)
1. Admin navigates to `/dashboard/users/create`
2. Fills in user details and selects role
3. System creates Supabase Auth user
4. System creates Prisma database record
5. Password reset email sent to new user

## Image Upload Flow

1. User selects image in TinyMCE or featured image input
2. File is sent to custom upload handler
3. Handler uploads to Supabase Storage (`blog-images` bucket)
4. Public URL is returned and inserted into content/stored in database

## Development Workflow

### Adding a New Feature

1. **Update Database Schema**
   ```bash
   # Edit prisma/schema.prisma
   # Then run:
   npx prisma migrate dev --name feature_name
   npx prisma generate
   ```

2. **Create API Route** (if needed)
   - Add route in `src/app/api/`
   - Use auth helpers for protected routes
   - Return proper status codes and error messages

3. **Create Components**
   - UI components in `src/components/ui/`
   - Feature components in appropriate directories
   - Use TypeScript for type safety

4. **Test Locally**
   ```bash
   npm run dev
   ```

### Deployment Considerations

1. **Environment Variables**
   - Set all production env vars in hosting platform
   - Use production Supabase URL and keys
   - Update `NEXT_PUBLIC_API_URL` to production domain

2. **Database**
   - Ensure Supabase PostgreSQL connection string is correct
   - Run migrations on production database
   - Create initial admin user

3. **Storage**
   - Configure Supabase Storage bucket policies
   - Ensure `blog-images` bucket exists and is public

4. **Build**
   ```bash
   npm run build
   npm start
   ```

## Common Tasks

### Create a New Blog Post
1. Login to dashboard
2. Navigate to "Blog Yazıları" > "Yeni Yazı"
3. Fill in title (slug auto-generates)
4. Upload featured image (optional)
5. Write content in TinyMCE editor
6. Select categories
7. Check "Yayınla" to publish immediately
8. Click "Oluştur"

### Create a New Category
1. Login to dashboard
2. Navigate to "Kategoriler" > "Yeni Kategori"
3. Enter category name (slug auto-generates)
4. Add description (optional)
5. Click "Oluştur"

### Add a New User (Admin Only)
1. Login as admin
2. Navigate to "Kullanıcılar" > "Yeni Kullanıcı"
3. Enter email, name, and select role
4. Click "Oluştur"
5. User receives password reset email

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check Supabase project is running
- Ensure IP is whitelisted in Supabase (or allow all IPs for development)

### Authentication Issues
- Verify Supabase credentials in `.env`
- Check middleware is configured correctly
- Ensure email provider is enabled in Supabase

### Image Upload Issues
- Verify Supabase Storage bucket exists
- Check bucket permissions (should be public or have proper RLS)
- Ensure file size is within limits

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Clear `.next` folder and rebuild: `rm -rf .next && npm run build`
- Check for TypeScript errors: `npx tsc --noEmit`

## Future Enhancements

Potential features to add:
- Search functionality
- Comment system
- Post analytics
- SEO sitemap generation
- RSS feed
- Social sharing buttons
- Tags (in addition to categories)
- Post scheduling
- Multi-language support
- Image optimization
- Dark mode
- Email notifications for new posts

## Security Considerations

- All API routes check authentication before mutations
- Database-level RLS policies can be added in Supabase
- User input is sanitized before storage
- HTTPS should be enforced in production
- Env variables are never exposed to client (except NEXT_PUBLIC_*)
- Middleware protects dashboard routes

## Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **shadcn/ui**: https://ui.shadcn.com
- **TinyMCE Docs**: https://www.tiny.cloud/docs

---

Built with ❤️ by Claude Code
