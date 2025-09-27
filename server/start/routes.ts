/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const MembersController = () => import('#controllers/members_controller')
const AuthController = () => import('#controllers/auth_controller')

// Member routes
router.get('/members', [MembersController, 'index'])
router.get('/members/:id', [MembersController, 'show'])
router.post('/members', [MembersController, 'store'])
router.put('/members/:id', [MembersController, 'update'])
router.delete('/members/:id', [MembersController, 'destroy'])

// Authentication routes
router.post('/login', [AuthController, 'login'])
router.post('/register', [AuthController, 'register'])
router.post('/logout', [AuthController, 'logout'])

// Protected user profile route
router.get('/me', [AuthController, 'me']).use(async (ctx, next) => {
  await ctx.auth.authenticateUsing(['web'])
  return next()
})
