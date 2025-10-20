# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- React-page editor integration for drag-and-drop
- SSR/ISR page rendering with Next.js App Router
- Preview/staging workflow implementation
- Internationalization support (es-CO, es-DO, en)
- Security headers and CSP configuration
- Rate limiting implementation
- Unit and integration tests
- Two-factor authentication

## [0.1.0] - 2025-10-20

### Added
- Initial project scaffold with Next.js 15 and TypeScript
- PostgreSQL database with Prisma ORM
- Multi-tenant architecture with domain-based resolution
- NextAuth authentication with role-based access control
- User roles: SUPER_ADMIN, EDITOR, VIEWER
- Database schema for tenants, users, pages, page versions, markdown content, and media
- API endpoints:
  - `GET /api/health` - Health check endpoint
  - `POST /api/auth/signin` - Authentication
  - `GET /api/pages` - List pages
  - `POST /api/pages` - Create page
  - `GET /api/pages/[id]` - Get page details
  - `PUT /api/pages/[id]` - Update page
  - `DELETE /api/pages/[id]` - Delete page
  - `POST /api/pages/[id]/publish` - Publish to staging or production
  - `GET /api/media` - List media files
  - `POST /api/media/upload` - Upload media file
- Media management:
  - File upload with validation (type, size)
  - Automatic thumbnail generation
  - WebP conversion for images
  - Antivirus scanning hooks (ClamAV ready)
- Markdown rendering with sanitization (rehype-sanitize)
- Publishing workflow (Draft → Staging → Production)
- Preview token generation for staging pages
- Database seed script with demo tenant and sample pages
- Comprehensive documentation:
  - README.md - Project overview and quick start
  - ARCHITECTURE.md - System architecture documentation
  - DEVELOPMENT.md - Development guide
  - USER_MANUAL.md - User guide for editors
  - CONTRIBUTING.md - Contribution guidelines
  - SECURITY.md - Security policy
- Docker Compose configuration for local PostgreSQL
- Environment variable configuration with .env.example

### Security
- Input validation with Zod schemas
- Content sanitization to prevent XSS
- Tenant isolation in all database queries
- Password hashing with bcrypt
- JWT-based session management
- File upload security (MIME type, size validation)
- SQL injection prevention via Prisma

### Infrastructure
- Next.js 15 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Prisma for database management
- NextAuth for authentication
- Sharp for image processing
- Local file storage with S3-compatible adapter ready

## [0.0.0] - 2025-10-20

### Added
- Repository initialization
- Initial project setup

---

## Version History Legend

### Types of Changes
- `Added` - New features
- `Changed` - Changes in existing functionality
- `Deprecated` - Soon-to-be removed features
- `Removed` - Removed features
- `Fixed` - Bug fixes
- `Security` - Security improvements

### Version Numbers
- **MAJOR** - Incompatible API changes
- **MINOR** - Backwards-compatible functionality additions
- **PATCH** - Backwards-compatible bug fixes

### Links
[Unreleased]: https://github.com/FranciscoCifuentes/microsite-cms/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/FranciscoCifuentes/microsite-cms/releases/tag/v0.1.0
