import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AuthController {
  /**
   * Handle user login
   */
  async login({ request, auth, response }: HttpContext): Promise<void> {
    const { email, password } = request.only(['email', 'password'])

    try {
      const user = await User.query().where('email', email).first()
      const isPasswordValid = await user?.verifyPassword(password)

      if (!user || !isPasswordValid) {
        return response.unauthorized({
          error: 'Invalid credentials',
        })
      }

      auth.use('web').login(user)

      return response.ok({
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
        },
      })
    } catch {
      return response.unauthorized({
        error: 'Invalid credentials',
      })
    }
  }

  /**
   * Handle user logout
   */
  async logout({ auth, response }: HttpContext): Promise<void> {
    await auth.use('web').logout()
    return response.ok({ message: 'Logged out successfully' })
  }

  /**
   * Register a new user
   */
  async register({ request, auth, response }: HttpContext): Promise<void> {
    const { fullName, email, password } = request.only(['fullName', 'email', 'password'])

    try {
      const user = await User.create({
        fullName,
        email,
        password,
      })

      await auth.use('web').login(user)

      return response.ok({
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
        },
      })
    } catch (error) {
      return response.unauthorized({
        error: 'Registration failed',
      })
    }
  }

  /**
   * Get current authenticated user
   */
  async me({ auth, response }: HttpContext): Promise<void> {
    if (!auth.isAuthenticated) {
      return response.unauthorized({
        error: 'Not authenticated',
      })
    }

    const user = auth.user!

    return response.ok({
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
    })
  }
}
