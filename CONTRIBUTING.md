# Contributing to Microsite CMS

Thank you for your interest in contributing to the Microsite CMS project! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help maintain a welcoming environment
- Report inappropriate behavior to project maintainers

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Set up the development environment (see DEVELOPMENT.md)
4. Create a feature branch
5. Make your changes
6. Submit a pull request

## Development Setup

See [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed setup instructions.

Quick start:
```bash
git clone https://github.com/YOUR-USERNAME/microsite-cms.git
cd microsite-cms
npm install
cp .env.example .env
docker-compose up -d
npm run prisma:migrate
npm run db:seed
npm run dev
```

## How to Contribute

### Reporting Bugs

Before creating a bug report:
- Check existing issues to avoid duplicates
- Verify the bug in the latest version
- Collect relevant information

Create an issue with:
- Clear, descriptive title
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)
- Screenshots if applicable
- Error messages and logs

### Suggesting Features

Feature requests should include:
- Clear use case and problem statement
- Proposed solution
- Alternative solutions considered
- Mockups or examples (if applicable)

### Submitting Changes

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make focused changes**:
   - Keep changes small and focused
   - One feature/fix per PR
   - Write clear code

3. **Follow coding standards**:
   - Use TypeScript
   - Follow existing patterns
   - Add comments for complex logic
   - Update documentation

4. **Test your changes**:
   ```bash
   npm run lint
   npm run build
   ```

5. **Commit with clear messages**:
   ```bash
   git commit -m "feat: add new feature"
   git commit -m "fix: resolve bug in API"
   git commit -m "docs: update README"
   ```

6. **Push and create PR**:
   ```bash
   git push origin feature/your-feature-name
   ```

## Commit Message Guidelines

Use conventional commits format:

```
type(scope): subject

body (optional)

footer (optional)
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(pages): add markdown support for page content

Implemented markdown rendering with rehype-sanitize for security.
Users can now use markdown formatting in text blocks.

Closes #123
```

```
fix(media): prevent upload of files over size limit

Added validation to check file size before upload.
Returns 400 error with clear message when limit exceeded.
```

## Pull Request Process

### Before Submitting

- [ ] Code follows project style
- [ ] Builds without errors
- [ ] Lint passes
- [ ] Documentation updated
- [ ] Commit messages are clear

### PR Description

Include:
- What changes were made
- Why the changes are needed
- How to test the changes
- Related issues (use "Closes #123")
- Screenshots (for UI changes)

### Review Process

1. Maintainers review within 1-3 business days
2. Address review feedback
3. Request re-review when ready
4. PR merged when approved

## Coding Standards

### TypeScript

```typescript
// Good: Clear types
interface PageData {
  title: string
  slug: string
  locale: 'es-CO' | 'es-DO' | 'en'
}

// Avoid: Using 'any'
const data: any = {}
```

### API Routes

```typescript
// Always validate tenant access
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const tenant = await getTenantFromRequest()
  if (!tenant) {
    return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
  }

  // Your logic...
}
```

### Error Handling

```typescript
// Good: Specific error handling
try {
  const result = await doSomething()
  return NextResponse.json({ result })
} catch (error) {
  if (error instanceof ValidationError) {
    return NextResponse.json(
      { error: 'Invalid input', details: error.details },
      { status: 400 }
    )
  }
  console.error('Unexpected error:', error)
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  )
}
```

### Security

Always:
- Validate all user input
- Check authentication and authorization
- Filter queries by tenant ID
- Sanitize markdown/HTML output
- Use prepared statements (Prisma handles this)

Never:
- Trust user input
- Expose sensitive data in responses
- Skip authentication checks
- Allow SQL injection vulnerabilities

## Documentation

### Code Comments

```typescript
/**
 * Uploads and processes a media file
 * @param file - The file to upload
 * @param tenantId - The tenant ID for scoping
 * @returns Media record with URLs
 * @throws Error if file validation fails
 */
async function uploadMedia(file: File, tenantId: string) {
  // Implementation...
}
```

### README Updates

Update README.md when:
- Adding new features
- Changing setup process
- Adding dependencies
- Changing environment variables

### API Documentation

Document new endpoints:

```typescript
/**
 * GET /api/pages
 * Lists all pages for the current tenant
 * 
 * Query Parameters:
 * - locale: Filter by locale (es-CO, es-DO, en)
 * - status: Filter by status (DRAFT, STAGING, PUBLISHED)
 * 
 * Returns:
 * - 200: { pages: Page[] }
 * - 401: { error: "Unauthorized" }
 * - 404: { error: "Tenant not found" }
 */
```

## Testing

### Manual Testing

Test your changes:
- [ ] Feature works as expected
- [ ] Edge cases handled
- [ ] Error states work correctly
- [ ] No breaking changes
- [ ] Works in different browsers (if UI)

### Test Data

Use seed data or create test fixtures:

```typescript
const testTenant = await prisma.tenant.create({
  data: {
    domain: 'test.example.com',
    name: 'Test Tenant',
  },
})
```

## Project Priorities

### High Priority

- Security fixes
- Critical bugs
- Data integrity issues
- Performance problems

### Medium Priority

- New features (approved)
- UI improvements
- Documentation
- Refactoring

### Low Priority

- Code style improvements
- Minor optimizations
- Nice-to-have features

## Areas Needing Help

### Current Priorities

1. **Testing**: Unit and integration tests
2. **Documentation**: User guides and API docs
3. **Accessibility**: WCAG compliance
4. **Performance**: Optimization and caching
5. **Internationalization**: Translation support

### Feature Backlog

See GitHub Issues labeled `good first issue` or `help wanted`

## Questions?

- Check [DEVELOPMENT.md](./DEVELOPMENT.md)
- Search existing issues
- Create a new issue for questions
- Join project discussions

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in significant features

Thank you for contributing to Microsite CMS! 🎉
