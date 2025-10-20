import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create demo tenant
  const tenant = await prisma.tenant.upsert({
    where: { domain: 'localhost' },
    update: {},
    create: {
      domain: 'localhost',
      name: 'Demo Health Clinic',
      logoUrl: '/logo.png',
      primaryColor: '#0066cc',
      secondaryColor: '#00cc66',
      fontFamily: 'Inter, sans-serif',
    },
  })

  console.log('✅ Created tenant:', tenant.name)

  // Create super admin
  const hashedPassword = await bcrypt.hash(
    process.env.SUPER_ADMIN_PASSWORD || 'admin123',
    10
  )

  const admin = await prisma.user.upsert({
    where: { email: process.env.SUPER_ADMIN_EMAIL || 'admin@example.com' },
    update: {},
    create: {
      email: process.env.SUPER_ADMIN_EMAIL || 'admin@example.com',
      name: 'Super Admin',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  })

  console.log('✅ Created super admin:', admin.email)

  // Create editor user
  const editorPassword = await bcrypt.hash('editor123', 10)
  const editor = await prisma.user.upsert({
    where: { email: 'editor@example.com' },
    update: {},
    create: {
      email: 'editor@example.com',
      name: 'Demo Editor',
      password: editorPassword,
      role: 'EDITOR',
      tenantId: tenant.id,
    },
  })

  console.log('✅ Created editor:', editor.email)

  // Create sample markdown content for home page
  const heroContent = await prisma.markdownContent.upsert({
    where: {
      tenantId_key_locale: {
        tenantId: tenant.id,
        key: 'home-hero',
        locale: 'es-CO',
      },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      key: 'home-hero',
      locale: 'es-CO',
      content: `# Bienvenido a Demo Health Clinic

Tu salud es nuestra prioridad. Ofrecemos servicios médicos de calidad con un equipo profesional dedicado a tu bienestar.`,
    },
  })

  const aboutContent = await prisma.markdownContent.upsert({
    where: {
      tenantId_key_locale: {
        tenantId: tenant.id,
        key: 'home-about',
        locale: 'es-CO',
      },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      key: 'home-about',
      locale: 'es-CO',
      content: `## Acerca de Nosotros

Con más de 20 años de experiencia, somos líderes en atención médica integral. Nuestro compromiso es brindar servicios de salud de la más alta calidad.`,
    },
  })

  // Create sample pages
  const homePage = await prisma.page.upsert({
    where: {
      tenantId_slug_locale: {
        tenantId: tenant.id,
        slug: 'home',
        locale: 'es-CO',
      },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      slug: 'home',
      locale: 'es-CO',
      title: 'Inicio',
      description: 'Página principal de Demo Health Clinic',
      metaTitle: 'Demo Health Clinic - Tu salud es nuestra prioridad',
      metaDescription:
        'Servicios médicos de calidad con profesionales dedicados a tu bienestar',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      layout: {
        blocks: [
          {
            id: 'hero-1',
            type: 'hero',
            content: {
              markdownKey: 'home-hero',
            },
          },
          {
            id: 'about-1',
            type: 'text',
            content: {
              markdownKey: 'home-about',
            },
          },
        ],
      },
    },
  })

  console.log('✅ Created home page')

  const aboutPage = await prisma.page.upsert({
    where: {
      tenantId_slug_locale: {
        tenantId: tenant.id,
        slug: 'about',
        locale: 'es-CO',
      },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      slug: 'about',
      locale: 'es-CO',
      title: 'Acerca de Nosotros',
      description: 'Conoce más sobre nuestra clínica y equipo médico',
      metaTitle: 'Acerca de Nosotros - Demo Health Clinic',
      metaDescription: 'Conoce nuestra historia, misión y equipo profesional',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      layout: {
        blocks: [
          {
            id: 'about-hero',
            type: 'hero',
            content: {
              title: 'Nuestra Historia',
              subtitle: 'Compromiso con la excelencia médica',
            },
          },
        ],
      },
    },
  })

  console.log('✅ Created about page')

  const servicesPage = await prisma.page.upsert({
    where: {
      tenantId_slug_locale: {
        tenantId: tenant.id,
        slug: 'services',
        locale: 'es-CO',
      },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      slug: 'services',
      locale: 'es-CO',
      title: 'Nuestros Servicios',
      description: 'Servicios médicos especializados',
      metaTitle: 'Servicios - Demo Health Clinic',
      metaDescription: 'Conoce nuestros servicios médicos especializados',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      layout: {
        blocks: [
          {
            id: 'services-hero',
            type: 'hero',
            content: {
              title: 'Servicios Médicos',
              subtitle: 'Atención integral para toda la familia',
            },
          },
          {
            id: 'services-grid',
            type: 'grid',
            content: {
              items: [
                {
                  title: 'Medicina General',
                  description: 'Consulta médica general y diagnóstico',
                },
                {
                  title: 'Pediatría',
                  description: 'Atención especializada para niños',
                },
                {
                  title: 'Laboratorio',
                  description: 'Exámenes y análisis clínicos',
                },
                {
                  title: 'Urgencias',
                  description: 'Atención de emergencias 24/7',
                },
              ],
            },
          },
        ],
      },
    },
  })

  console.log('✅ Created services page')

  console.log('🎉 Seed completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
