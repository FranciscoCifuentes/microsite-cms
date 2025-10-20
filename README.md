# Microsite CMS

A multi-tenant CMS for health sector landing pages with drag-and-drop editing capabilities.

## Features

- 🏢 **Multi-tenant Architecture**: Host multiple sites on different domains
- 🎨 **Drag-and-Drop Editor**: Block-based content editing with react-page
- 🔐 **Authentication & RBAC**: NextAuth with role-based access control
- 📝 **Markdown Content**: Safe markdown rendering with XSS protection
- 🖼️ **Media Management**: Image upload with automatic WebP conversion and thumbnails
- 🌍 **Internationalization**: Support for es-CO, es-DO, and en locales
- 🚀 **SSR/ISR**: Server-side rendering with incremental static regeneration
- 🔒 **Security**: Content sanitization, CSP headers, and antivirus scanning hooks
- 📦 **Preview Workflow**: Draft → Staging → Production with shareable preview links

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth
- **Editor**: react-page
- **Markdown**: remark + rehype with sanitization
- **Image Processing**: Sharp
- **Storage**: Local filesystem (S3-compatible adapters ready)

## Prerequisites

- Node.js 20+
- PostgreSQL 14+
- npm or yarn

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/FranciscoCifuentes/microsite-cms.git
cd microsite-cms
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` and configure your database connection and other settings.

### 4. Set up the database

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed demo data (optional)
npm run db:seed
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### 6. Login with demo credentials

- **Super Admin**: `admin@example.com` / `admin123`
- **Editor**: `editor@example.com` / `editor123`

## Project Structure

```
microsite-cms/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data script
├── public/
│   └── uploads/               # Media uploads (local storage)
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # NextAuth endpoints
│   │   │   ├── health/        # Health check
│   │   │   ├── media/         # Media upload/list
│   │   │   └── pages/         # CRUD operations
│   │   └── ...                # Page components
│   ├── lib/
│   │   ├── auth.ts            # NextAuth configuration
│   │   ├── prisma.ts          # Prisma client
│   │   ├── tenant.ts          # Multi-tenant utilities
│   │   └── markdown.ts        # Markdown rendering
│   ├── types/
│   │   └── next-auth.d.ts     # Type definitions
│   └── middleware.ts          # Multi-tenant resolver
├── .env.example               # Environment variables template
└── package.json
```

## API Endpoints

### Health Check
- `GET /api/health` - Check service health

### Authentication
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out

### Pages
- `GET /api/pages` - List pages
- `POST /api/pages` - Create page
- `GET /api/pages/[id]` - Get page
- `PUT /api/pages/[id]` - Update page
- `DELETE /api/pages/[id]` - Delete page
- `POST /api/pages/[id]/publish` - Publish page (staging/production)

### Media
- `GET /api/media` - List media files
- `POST /api/media/upload` - Upload file

## Environment Variables

See `.env.example` for all available configuration options.

### Required Variables

- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - Application URL
- `NEXTAUTH_SECRET` - NextAuth secret key (min 32 chars)

### Optional Variables

- `STORAGE_TYPE` - Storage adapter (local/s3)
- `ANTIVIRUS_ENABLED` - Enable antivirus scanning
- `MAX_FILE_SIZE` - Maximum upload size in bytes
- `ALLOWED_MIME_TYPES` - Comma-separated allowed MIME types

## Database Scripts

```bash
# Generate Prisma client
npm run prisma:generate

# Create migration
npm run prisma:migrate

# Deploy migrations (production)
npm run prisma:deploy

# Open Prisma Studio
npm run prisma:studio

# Reset database and reseed
npm run db:reset

# Seed database only
npm run db:seed
```

## User Roles

- **SUPER_ADMIN**: Full system access, can create tenants and invite users
- **EDITOR**: Can create and edit pages, upload media
- **VIEWER**: Read-only access

## Publishing Workflow

1. **Draft**: Initial state, not visible to public
2. **Staging**: Published to staging with shareable preview link
3. **Production**: Published to production with ISR revalidation

## Security Features

- Content sanitization (rehype-sanitize)
- XSS protection
- CSRF protection (NextAuth)
- Role-based access control
- Tenant isolation
- File upload validation
- Antivirus scanning hooks
- Rate limiting ready

## Development

```bash
# Run linter
npm run lint

# Build for production
npm run build

# Start production server
npm run start
```

## Deployment

This application is designed to be deployed on any platform that supports Node.js:

- Vercel (recommended)
- AWS
- Google Cloud
- DigitalOcean
- Self-hosted

### Requirements

1. PostgreSQL database
2. Node.js runtime
3. Environment variables configured
4. Optional: S3-compatible storage for media

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

Private - All rights reserved

## Support

For support and questions, please create an issue in the repository.
