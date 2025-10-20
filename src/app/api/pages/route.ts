import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getTenantFromRequest } from '@/lib/tenant'
import { z } from 'zod'

const createPageSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  locale: z.enum(['es-CO', 'es-DO', 'en']).default('es-CO'),
  layout: z.any(), // JSON layout
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  ogImage: z.string().optional(),
})

// GET /api/pages - List all pages for tenant
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tenant = await getTenantFromRequest()
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') || 'es-CO'
    const status = searchParams.get('status')

    type WhereClause = {
      tenantId: string
      locale: string
      status?: 'DRAFT' | 'STAGING' | 'PUBLISHED'
    }

    const where: WhereClause = {
      tenantId: tenant.id,
      locale,
    }

    if (status && (status === 'DRAFT' || status === 'STAGING' || status === 'PUBLISHED')) {
      where.status = status
    }

    const pages = await prisma.page.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json({ pages })
  } catch (error) {
    console.error('Error fetching pages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    )
  }
}

// POST /api/pages - Create a new page
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role === 'VIEWER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const tenant = await getTenantFromRequest()
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    const body = await request.json()
    const data = createPageSchema.parse(body)

    // Check if page with same slug and locale already exists
    const existing = await prisma.page.findUnique({
      where: {
        tenantId_slug_locale: {
          tenantId: tenant.id,
          slug: data.slug,
          locale: data.locale,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Page with this slug and locale already exists' },
        { status: 409 }
      )
    }

    const page = await prisma.page.create({
      data: {
        ...data,
        tenantId: tenant.id,
      },
    })

    return NextResponse.json({ page }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }
    console.error('Error creating page:', error)
    return NextResponse.json(
      { error: 'Failed to create page' },
      { status: 500 }
    )
  }
}
