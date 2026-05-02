import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RoleMiddleware {
  async handle({ auth, response }: HttpContext, next: NextFn, allowedRoles: string[]) {
    const user = auth.user

    // Verify user is authenticated and their role is included in allowedRoles
    if (!user || !allowedRoles.includes((user as any).role)) {
      return response.forbidden({ message: 'Access denied: insufficient privileges' })
    }

    return next()
  }
}