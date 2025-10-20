# Architecture Documentation

## Overview

The Microsite CMS is a multi-tenant content management system designed specifically for health sector landing pages. It uses a single application instance to serve multiple domains/tenants while maintaining complete data isolation.

## Architecture Principles

### 1. Multi-Tenancy

The system resolves tenants based on the HTTP Host header:
- Middleware intercepts all requests and extracts the domain
- Domain is matched against the `Tenant` table
- All subsequent queries are scoped to the tenant ID
- Complete data isolation between tenants

### 2. Security-First Design

- **Content Sanitization**: All markdown content is sanitized using rehype-sanitize
- **No HTML/JS Injection**: Users cannot inject custom HTML or JavaScript
- **XSS Prevention**: All user-generated content is escaped
- **RBAC**: Role-based access control with Super Admin, Editor, and Viewer roles
- **Tenant Isolation**: Database queries always include tenant ID validation
- **File Upload Validation**: MIME type and size validation on all uploads
- **Antivirus Integration**: Hooks ready for ClamAV or similar scanners

### 3. Performance Optimization

- **SSR/ISR**: Pages are server-side rendered with Incremental Static Regeneration
- **Image Optimization**: Automatic WebP conversion and thumbnail generation
- **CDN Ready**: On-demand revalidation for production deployments
- **Database Indexing**: Strategic indexes on frequently queried fields

## System Components

### Frontend Layer

```
┌─────────────────────────────────────────┐
│         Next.js App Router              │
│  ┌───────────────────────────────────┐  │
│  │  Public Pages (SSR/ISR)           │  │
│  │  - Home, About, Services          │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  Admin Dashboard                  │  │
│  │  - Page Editor (react-page)       │  │
│  │  - Media Manager                  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### API Layer

```
┌─────────────────────────────────────────┐
│           API Routes                    │
│                                         │
│  /api/health      - Health Check        │
│  /api/auth/*      - Authentication      │
│  /api/pages       - Page CRUD           │
│  /api/pages/[id]/publish - Publishing   │
│  /api/media       - Media Upload/List   │
│                                         │
└─────────────────────────────────────────┘
```

### Middleware

```
┌─────────────────────────────────────────┐
│        Multi-Tenant Resolver            │
│                                         │
│  1. Extract domain from Host header     │
│  2. Set x-tenant-domain header          │
│  3. Pass to API/Page handlers           │
│                                         │
└─────────────────────────────────────────┘
```

### Data Layer

```
┌─────────────────────────────────────────┐
│          PostgreSQL Database            │
│                                         │
│  Tenant → User → Page → PageVersion     │
│       ↓                                 │
│       → Media                           │
│       → MarkdownContent                 │
│                                         │
└─────────────────────────────────────────┘
```

## Data Model

### Core Entities

1. **Tenant**
   - Represents a single client/site
   - Stores branding configuration (logo, colors, fonts)
   - Indexed by domain for fast lookup

2. **User**
   - Authentication and authorization
   - Belongs to a tenant (except SUPER_ADMIN)
   - Roles: SUPER_ADMIN, EDITOR, VIEWER

3. **Page**
   - Content pages for the site
   - Stores layout as JSON (react-page format)
   - Multi-locale support
   - Version control through PageVersion

4. **PageVersion**
   - Historical versions of pages
   - Created before each update
   - Allows rollback functionality

5. **MarkdownContent**
   - Reusable markdown blocks
   - Referenced by page layouts
   - Multi-locale support

6. **Media**
   - Uploaded images and documents
   - Automatic thumbnail and WebP generation
   - Antivirus scanning metadata

## Request Flow

### Public Page Request

```
User Request → Middleware (extract domain) 
            → getTenantFromRequest() 
            → Fetch Page data 
            → Fetch MarkdownContent 
            → Render with Branding 
            → Return SSR/ISR response
```

### Admin Page Edit

```
User Request → Authentication Check 
            → Role Validation (EDITOR+) 
            → getTenantFromRequest() 
            → Verify page belongs to tenant 
            → Create PageVersion 
            → Update Page 
            → Return updated page
```

### Media Upload

```
File Upload → Authentication Check 
           → Role Validation (EDITOR+) 
           → Validate MIME type & size 
           → Save to storage (local/S3) 
           → Process image (Sharp) 
           → Generate thumbnail & WebP 
           → Queue antivirus scan 
           → Create Media record 
           → Return URLs
```

## Publishing Workflow

### Draft → Staging → Production

1. **Draft**
   - Initial state after creation/edit
   - Only visible to authenticated users
   - Can be edited freely

2. **Staging**
   - Published to staging environment
   - Generates shareable preview token
   - Accessible via: `/api/preview?token=xxx&slug=yyy`
   - For client review before production

3. **Production**
   - Published to live site
   - Triggers ISR revalidation
   - Accessible to public
   - Preview token removed

## Storage Architecture

### Local Storage (Development)

```
public/
└── uploads/
    └── [tenant-id]/
        ├── original-files/
        ├── thumbnails/
        └── webp/
```

### S3-Compatible Storage (Production)

```
Bucket: microsite-cms
├── [tenant-id]/
    ├── original-files/
    ├── thumbnails/
    └── webp/
```

Adapters ready for:
- AWS S3
- Cloudflare R2
- DigitalOcean Spaces
- MinIO

## Security Measures

### Content Security

1. **Markdown Sanitization**
   - Uses rehype-sanitize
   - Strips all scripts and dangerous HTML
   - Safe HTML output only

2. **Upload Security**
   - MIME type validation
   - File size limits
   - Antivirus scanning hooks
   - Tenant-scoped storage

3. **Access Control**
   - JWT-based sessions
   - Role-based permissions
   - Tenant isolation in all queries

### Infrastructure Security

1. **Headers** (To be configured in deployment)
   - Content-Security-Policy
   - X-Frame-Options
   - X-Content-Type-Options
   - Strict-Transport-Security

2. **Rate Limiting** (To be configured)
   - API endpoint limits
   - Upload endpoint limits
   - Login attempt limits

## Scalability Considerations

### Horizontal Scaling

- Stateless application design
- Session stored in database
- Media on shared storage (S3)
- Database connection pooling

### Performance Optimization

- ISR for static pages
- CDN for media assets
- Database indexes on hot paths
- Image optimization (WebP, thumbnails)

### Multi-Region Support

- Database read replicas
- CDN edge caching
- S3 cross-region replication

## Monitoring & Observability

### Health Checks

- `/api/health` endpoint
- Database connectivity check
- Returns service status

### Logging (To be implemented)

- API request/response logs
- Error tracking
- Audit logs for data changes

### Metrics (To be implemented)

- Request latency
- Database query performance
- Upload success/failure rates
- Cache hit/miss ratios

## Deployment

### Environment Requirements

- Node.js 20+ runtime
- PostgreSQL 14+ database
- Environment variables configured
- Optional: S3-compatible storage
- Optional: Redis for rate limiting

### Recommended Stack

- **Platform**: Vercel, AWS, or self-hosted
- **Database**: Managed PostgreSQL (AWS RDS, Supabase, Neon)
- **Storage**: S3, Cloudflare R2, or DigitalOcean Spaces
- **CDN**: Cloudflare, CloudFront, or Fastly
- **Monitoring**: Sentry, DataDog, or New Relic

## Future Enhancements

1. **Forms Module**: Contact forms with email notifications
2. **Analytics Integration**: Google Analytics, Plausible
3. **Advanced SEO**: Sitemap generation, robots.txt
4. **Multi-language Editor**: Side-by-side translation editing
5. **Advanced Permissions**: Page-level access control
6. **Custom Domains**: Automated SSL certificate provisioning
7. **Template Marketplace**: Pre-built page templates
8. **A/B Testing**: Content variation testing
9. **Backup/Restore**: Automated backup and point-in-time recovery
10. **API Documentation**: OpenAPI/Swagger docs

## Maintenance

### Database Migrations

```bash
# Development
npm run prisma:migrate

# Production
npm run prisma:deploy
```

### Backup Strategy

1. **Database**: Daily automated backups
2. **Media**: S3 versioning enabled
3. **Configuration**: Version controlled

### Update Process

1. Test in staging environment
2. Run database migrations
3. Deploy application
4. Monitor health checks
5. Rollback if issues detected
