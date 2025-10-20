import 'next-auth'
import { UserRole } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      role: string
      tenantId: string | null
    }
  }

  interface User {
    role: UserRole
    tenantId: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string
    tenantId: string | null
  }
}
