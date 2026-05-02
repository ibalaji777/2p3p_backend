import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerValidator, loginValidator } from '#validators/auth'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)

    // Check if the user already exists
    const existingUser = await User.findBy('email', payload.email)
    if (existingUser) {
      return response.badRequest({ message: 'Email is already in use' })
    }

    // Default to 'customer' if role is not provided
    const role = payload.role || 'customer'

    const user = await User.create({
      fullName: payload.fullName,
      email: payload.email,
      password: payload.password,
      role,
    })

    const token = await User.accessTokens.create(user)

    return response.created({
      message: 'User registered successfully',
      user,
      token: token.value!.release(),
    })
  }

  async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)

    return response.ok({
      message: 'Logged in successfully',
      user,
      token: token.value!.release(),
    })
  }
}