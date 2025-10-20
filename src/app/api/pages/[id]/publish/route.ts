import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getTenantFromRequest } from '@/lib/tenant'
import { revalidatePath } from 'next/cache'
import { nanoid } from 'nanoid'

// POST /api/pages/[id]/publish - Publish a page to staging or production
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role === 'VIEWER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const tenant = await getTenantFromRequest()
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    const { id } = await params
    const body = await request.json()
    const { environment } = body // 'staging' or 'production'

    if (!environment || !['staging', 'production'].includes(environment)) {
      return NextResponse.json(
        { error: 'Invalid environment. Must be "staging" or "production"' },
        { status: 400 }
      )
    }

    // Verify page belongs to tenant
    const page = await prisma.page.findFirst({
      where: {
        id,
        tenantId: tenant.id,
      },
    })

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    type UpdateData = {
      status: 'STAGING' | 'PUBLISHED'
      stagedAt?: Date
      publishedAt?: Date
      previewToken?: string | null
    }

    const updateData: UpdateData = {
      status: environment === 'staging' ? 'STAGING' : 'PUBLISHED',
    }

    if (environment === 'staging') {
      updateData.stagedAt = new Date()
      updateData.previewToken = nanoid(32) // Generate preview token
    } else {
      updateData.publishedAt = new Date()
      updateData.previewToken = null // Clear preview token on production
    }

    const updatedPage = await prisma.page.update({
      where: { id },
      data: updateData,
    })

    // Revalidate the page path for ISR
    if (environment === 'production') {
      try {
        revalidatePath(`/${page.slug}`)
        revalidatePath(`/${page.locale}/${page.slug}`)
      } catch (error) {
        console.error('Error revalidating path:', error)
      }
    }

    return NextResponse.json({
      page: updatedPage,
      previewUrl:
        environment === 'staging'
          ? `/api/preview?token=${updatedPage.previewToken}&slug=${page.slug}`
          : null,
    })
  } catch (error) {
    console.error('Error publishing page:', error)
    return NextResponse.json(
      { error: 'Failed to publish page' },
      { status: 500 }
    )
  }
}
