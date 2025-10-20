import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getTenantFromRequest } from '@/lib/tenant'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import sharp from 'sharp'
import { nanoid } from 'nanoid'

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '10485760')
const ALLOWED_MIME_TYPES = (
  process.env.ALLOWED_MIME_TYPES ||
  'image/png,image/jpeg,image/jpg,image/webp,image/svg+xml,application/pdf'
).split(',')

// POST /api/media/upload - Upload media file
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

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      )
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `File type ${file.type} not allowed` },
        { status: 400 }
      )
    }

    // Generate unique filename
    const ext = file.name.split('.').pop()
    const filename = `${nanoid()}.${ext}`
    const tenantPath = join('uploads', tenant.id)
    const relativePath = join(tenantPath, filename)
    const absolutePath = join(process.cwd(), 'public', relativePath)

    // Ensure directory exists
    await mkdir(join(process.cwd(), 'public', tenantPath), { recursive: true })

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Write original file
    await writeFile(absolutePath, buffer)

    let width: number | undefined
    let height: number | undefined
    let thumbnailPath: string | undefined
    let webpPath: string | undefined

    // Process images
    if (file.type.startsWith('image/') && file.type !== 'image/svg+xml') {
      try {
        const image = sharp(buffer)
        const metadata = await image.metadata()
        width = metadata.width
        height = metadata.height

        // Generate thumbnail (max 300x300)
        const thumbnailFilename = `${nanoid()}_thumb.jpg`
        const thumbnailRelativePath = join(tenantPath, thumbnailFilename)
        const thumbnailAbsolutePath = join(
          process.cwd(),
          'public',
          thumbnailRelativePath
        )

        await image
          .resize(300, 300, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .jpeg({ quality: 80 })
          .toFile(thumbnailAbsolutePath)

        thumbnailPath = thumbnailRelativePath

        // Generate WebP version
        if (file.type !== 'image/webp') {
          const webpFilename = `${nanoid()}.webp`
          const webpRelativePath = join(tenantPath, webpFilename)
          const webpAbsolutePath = join(
            process.cwd(),
            'public',
            webpRelativePath
          )

          await sharp(buffer).webp({ quality: 80 }).toFile(webpAbsolutePath)

          webpPath = webpRelativePath
        }
      } catch (error) {
        console.error('Error processing image:', error)
      }
    }

    // Create media record
    const mediaType = file.type.startsWith('image/') ? 'IMAGE' : 'DOCUMENT'

    const media = await prisma.media.create({
      data: {
        filename,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        type: mediaType,
        path: relativePath,
        thumbnailPath,
        webpPath,
        width,
        height,
        tenantId: tenant.id,
        uploadedBy: session.user.id,
        scanned: !process.env.ANTIVIRUS_ENABLED || process.env.ANTIVIRUS_ENABLED === 'false',
        scanStatus: !process.env.ANTIVIRUS_ENABLED || process.env.ANTIVIRUS_ENABLED === 'false' ? 'clean' : 'pending',
      },
    })

    // TODO: Queue antivirus scan if enabled
    // if (process.env.ANTIVIRUS_ENABLED === 'true') {
    //   await queueAntivirusScan(media.id, absolutePath)
    // }

    return NextResponse.json(
      {
        media: {
          id: media.id,
          url: `/${relativePath}`,
          thumbnailUrl: thumbnailPath ? `/${thumbnailPath}` : null,
          webpUrl: webpPath ? `/${webpPath}` : null,
          filename: media.filename,
          originalName: media.originalName,
          mimeType: media.mimeType,
          size: media.size,
          type: media.type,
          width: media.width,
          height: media.height,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error uploading media:', error)
    return NextResponse.json(
      { error: 'Failed to upload media' },
      { status: 500 }
    )
  }
}

// GET /api/media - List media files
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
    const type = searchParams.get('type')

    const where: {
      tenantId: string
      scanned: boolean
      scanStatus: string
      type?: 'IMAGE' | 'DOCUMENT'
    } = {
      tenantId: tenant.id,
      scanned: true,
      scanStatus: 'clean',
    }

    if (type && (type === 'IMAGE' || type === 'DOCUMENT')) {
      where.type = type
    }

    const media = await prisma.media.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        filename: true,
        originalName: true,
        mimeType: true,
        size: true,
        type: true,
        path: true,
        thumbnailPath: true,
        webpPath: true,
        width: true,
        height: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      media: media.map((m) => ({
        ...m,
        url: `/${m.path}`,
        thumbnailUrl: m.thumbnailPath ? `/${m.thumbnailPath}` : null,
        webpUrl: m.webpPath ? `/${m.webpPath}` : null,
      })),
    })
  } catch (error) {
    console.error('Error fetching media:', error)
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    )
  }
}
