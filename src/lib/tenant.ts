import { headers } from 'next/headers'
import { prisma } from './prisma'

export async function getTenantFromRequest() {
  const headersList = await headers()
  const domain = headersList.get('x-tenant-domain') || 'localhost'
  
  const tenant = await prisma.tenant.findUnique({
    where: { domain },
  })
  
  return tenant
}

export async function requireTenant() {
  const tenant = await getTenantFromRequest()
  
  if (!tenant) {
    throw new Error('Tenant not found')
  }
  
  return tenant
}
