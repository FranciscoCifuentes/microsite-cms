# Development Guide

## Local Development Setup

### Prerequisites

- Node.js 20 or higher
- PostgreSQL 14 or higher
- Git

### Initial Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/FranciscoCifuentes/microsite-cms.git
   cd microsite-cms
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up PostgreSQL**:

   Option A - Using Docker:
   ```bash
   docker-compose up -d
   ```

   Option B - Local PostgreSQL:
   - Create a database named `microsite_cms`
   - Update `DATABASE_URL` in `.env`

4. **Configure environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Run database migrations**:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

6. **Seed demo data**:
   ```bash
   npm run db:seed
   ```

7. **Start development server**:
   ```bash
   npm run dev
   ```

8. **Access the application**:
   - Frontend: http://localhost:3000
   - API Health: http://localhost:3000/api/health

### Development Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**

3. **Test your changes**:
   ```bash
   npm run lint
   npm run build
   ```

4. **Commit and push**:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**

## Project Structure

```
microsite-cms/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data
├── public/
│   └── uploads/           # Media uploads (gitignored)
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   │   ├── auth/      # NextAuth endpoints
│   │   │   ├── health/    # Health check
│   │   │   ├── media/     # Media management
│   │   │   └── pages/     # Page CRUD
│   │   ├── globals.css    # Global styles
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Homepage
│   ├── lib/
│   │   ├── auth.ts        # Auth configuration
│   │   ├── prisma.ts      # Prisma client
│   │   ├── tenant.ts      # Tenant utilities
│   │   └── markdown.ts    # Markdown rendering
│   ├── types/
│   │   └── next-auth.d.ts # Type definitions
│   └── middleware.ts      # Request middleware
├── .env.example           # Environment template
├── .gitignore
├── docker-compose.yml     # PostgreSQL for dev
├── next.config.ts         # Next.js config
├── package.json
├── README.md
├── ARCHITECTURE.md
├── USER_MANUAL.md
└── tsconfig.json
```

## Database Management

### Prisma Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Create a migration
npm run prisma:migrate

# Deploy migrations (production)
npm run prisma:deploy

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Reset database (WARNING: deletes all data)
npm run db:reset

# Seed database
npm run db:seed
```

### Creating Migrations

When you change the schema:

1. Edit `prisma/schema.prisma`
2. Run `npm run prisma:migrate`
3. Enter a migration name
4. Commit the migration files

### Adding Seed Data

Edit `prisma/seed.ts` to add new seed data:

```typescript
const newTenant = await prisma.tenant.create({
  data: {
    domain: 'demo.example.com',
    name: 'Demo Clinic',
    // ...
  },
})
```

## API Development

### Creating New Endpoints

1. **Create route file**:
   ```bash
   mkdir -p src/app/api/your-endpoint
   touch src/app/api/your-endpoint/route.ts
   ```

2. **Implement handlers**:
   ```typescript
   import { NextRequest, NextResponse } from 'next/server'
   import { getServerSession } from 'next-auth'
   import { authOptions } from '@/lib/auth'
   import { prisma } from '@/lib/prisma'
   import { getTenantFromRequest } from '@/lib/tenant'

   export async function GET(request: NextRequest) {
     const session = await getServerSession(authOptions)
     if (!session) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
     }

     const tenant = await getTenantFromRequest()
     if (!tenant) {
       return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
     }

     // Your logic here
     return NextResponse.json({ data: 'your data' })
   }
   ```

3. **Always validate**:
   - Authentication
   - Tenant access
   - Input data (use Zod)
   - Permissions

### Input Validation with Zod

```typescript
import { z } from 'zod'

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
})

const body = await request.json()
const data = createSchema.parse(body) // Throws on validation error
```

## Frontend Development

### Adding New Pages

1. Create page in `src/app/your-page/page.tsx`
2. Export default component
3. Add metadata for SEO

```typescript
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Your Page',
  description: 'Page description',
}

export default function YourPage() {
  return <div>Your content</div>
}
```

### Server Components vs Client Components

- **Server Components** (default): Fetch data on server, better performance
- **Client Components**: Use `'use client'` directive, needed for interactivity

```typescript
'use client'

import { useState } from 'react'

export default function ClientComponent() {
  const [count, setCount] = useState(0)
  // ...
}
```

## Testing

### Manual Testing Checklist

- [ ] Health endpoint returns 200
- [ ] Can create user and login
- [ ] Can create page with valid data
- [ ] Invalid data returns 400
- [ ] Unauthorized access returns 401
- [ ] Tenant isolation works
- [ ] Media upload works
- [ ] Media validation works
- [ ] Markdown sanitization works
- [ ] Publish workflow works

### Testing with curl

```bash
# Health check
curl http://localhost:3000/api/health

# Login (get session cookie)
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Create page
curl -X POST http://localhost:3000/api/pages \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION" \
  -d '{"slug":"test","title":"Test Page","locale":"es-CO","layout":{"blocks":[]}}'
```

## Security Considerations

### Input Validation

Always validate and sanitize user input:
- Use Zod for schema validation
- Sanitize markdown with rehype-sanitize
- Validate file types and sizes
- Check tenant access

### Authentication

- Never bypass authentication checks
- Always use `getServerSession` in API routes
- Check user roles for permission-based actions

### Tenant Isolation

Every database query must filter by tenant:

```typescript
const pages = await prisma.page.findMany({
  where: {
    tenantId: tenant.id, // Always include this
    // ... other filters
  },
})
```

### Environment Variables

- Never commit `.env` files
- Use `.env.example` as template
- Validate required env vars on startup

## Deployment

### Build Process

```bash
# Install dependencies
npm ci

# Generate Prisma Client
npm run prisma:generate

# Build Next.js app
npm run build

# Run migrations
npm run prisma:deploy

# Start production server
npm start
```

### Environment Setup

Production environment variables:

```bash
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="long-random-string-min-32-chars"
STORAGE_TYPE="s3"
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_S3_BUCKET="..."
ANTIVIRUS_ENABLED="true"
ANTIVIRUS_HOST="..."
```

### Health Checks

Configure your platform to monitor:
- `GET /api/health` - Should return 200

### Recommended Platforms

- **Vercel**: Easiest deployment, automatic
- **AWS**: Full control, requires setup
- **DigitalOcean**: App Platform or Droplet
- **Railway**: Simple deployment

## Common Issues

### Prisma Client Not Found

```bash
npm run prisma:generate
```

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Database Connection Error

- Check PostgreSQL is running
- Verify DATABASE_URL is correct
- Check firewall/network settings

### Build Failures

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## Code Style

### TypeScript

- Use TypeScript for all new code
- Avoid `any` type
- Define interfaces for data structures
- Use strict type checking

### Formatting

- Use Prettier (if configured)
- Follow existing code style
- Use meaningful variable names
- Add comments for complex logic

### Naming Conventions

- Components: PascalCase (`MyComponent.tsx`)
- Files: kebab-case (`my-utility.ts`)
- Functions: camelCase (`getUserData`)
- Constants: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth Documentation](https://next-auth.js.org)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

## Getting Help

- Check existing documentation
- Review similar code in the project
- Search GitHub issues
- Ask team members

## Contributing Guidelines

1. Follow existing code patterns
2. Write clear commit messages
3. Test your changes
4. Update documentation
5. Keep PRs focused and small
6. Request code reviews
