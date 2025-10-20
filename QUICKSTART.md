# Quick Start Guide

Get up and running with Microsite CMS in minutes!

## Prerequisites

- Node.js 20+ installed
- PostgreSQL 14+ running (or Docker)
- Git installed

## Installation

### 1. Clone and Install

```bash
git clone https://github.com/FranciscoCifuentes/microsite-cms.git
cd microsite-cms
npm install
```

### 2. Set Up Database

**Option A: Using Docker (Recommended)**
```bash
docker-compose up -d
```

**Option B: Using Local PostgreSQL**
```bash
# Create database
createdb microsite_cms

# Update .env with your connection string
# DATABASE_URL="postgresql://user:password@localhost:5432/microsite_cms"
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and update if needed:
- `DATABASE_URL` - Your PostgreSQL connection
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`

### 4. Initialize Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed demo data
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

Open http://localhost:3000

## First Steps

### Login

Use the default credentials:
- **Email**: `admin@example.com`
- **Password**: `admin123`

⚠️ **Change these in production!**

### Create Your First Page

1. Navigate to the admin dashboard
2. Click "Create New Page"
3. Fill in:
   - **Slug**: `my-first-page`
   - **Title**: My First Page
   - **Locale**: es-CO
4. Click "Create"
5. Add content using the editor
6. Click "Save Draft"
7. Click "Publish to Production"

### Upload Media

1. Go to Media Library
2. Click "Upload"
3. Select an image (PNG, JPEG, WebP, or SVG)
4. Image is processed automatically
5. Use in your pages

## Project Structure

```
microsite-cms/
├── prisma/          # Database schema & migrations
├── src/
│   ├── app/         # Next.js pages & API routes
│   │   └── api/     # API endpoints
│   └── lib/         # Utilities & configurations
├── .env             # Environment variables (don't commit!)
└── docker-compose.yml  # PostgreSQL for local dev
```

## Available Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open database GUI
npm run db:seed          # Seed demo data
npm run db:reset         # Reset & reseed database

# Code Quality
npm run lint             # Run ESLint
```

## API Endpoints

All authenticated endpoints require a session cookie.

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Authentication
```bash
# Sign in (POST form data or JSON)
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

### Pages
```bash
# List pages
curl http://localhost:3000/api/pages

# Create page
curl -X POST http://localhost:3000/api/pages \
  -H "Content-Type: application/json" \
  -d '{"slug":"test","title":"Test","locale":"es-CO","layout":{"blocks":[]}}'

# Get page
curl http://localhost:3000/api/pages/{id}

# Update page
curl -X PUT http://localhost:3000/api/pages/{id} \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title"}'

# Publish page
curl -X POST http://localhost:3000/api/pages/{id}/publish \
  -H "Content-Type: application/json" \
  -d '{"environment":"staging"}'
```

### Media
```bash
# List media
curl http://localhost:3000/api/media

# Upload media
curl -X POST http://localhost:3000/api/media/upload \
  -F "file=@/path/to/image.jpg"
```

## Common Issues

### "Cannot connect to database"
- Check PostgreSQL is running: `docker-compose ps`
- Verify DATABASE_URL in `.env`
- Restart database: `docker-compose restart`

### "Prisma Client not found"
```bash
npm run prisma:generate
```

### "Port 3000 already in use"
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
# Or use a different port
PORT=3001 npm run dev
```

### "Build fails"
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## Next Steps

1. ✅ Complete quick start
2. 📖 Read the [User Manual](./USER_MANUAL.md)
3. 🛠️ Check [Development Guide](./DEVELOPMENT.md)
4. 🏗️ Review [Architecture](./ARCHITECTURE.md)
5. 🚀 Deploy to production (see README)

## Getting Help

- 📚 Check the documentation
- 🐛 Report issues on GitHub
- 💬 Ask questions in discussions
- 📧 Contact maintainers

## Tips

- Always use `npm run db:seed` after `npm run db:reset`
- Run `npm run build` to catch errors before deploying
- Use Prisma Studio (`npm run prisma:studio`) to view data
- Keep your `.env` file secure and never commit it
- Use strong passwords in production

---

Happy coding! 🎉
