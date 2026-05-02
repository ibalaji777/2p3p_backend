/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

router.on('/').renderInertia('home', {}).as('home')

router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create'])
    router.post('signup', [controllers.NewAccount, 'store'])

    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])
  })
  .use(middleware.guest())

router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy'])
  })
  .use(middleware.auth())

// ==========================================
// API Routes
// ==========================================
router
  .group(() => {
    // Public API routes
    router.post('register', [controllers.Auth, 'register'])
    router.post('login', [controllers.Auth, 'login'])

    // Protected API routes (requires authentication)
    router
      .group(() => {
        // Admin only route
        router.get('admin/dashboard', async () => {
          return { message: 'Welcome to the Admin Dashboard' }
        }).use(middleware.role(['admin']))

        // Customer route (accessible by both customer and admin)
        router.get('customer/profile', async () => {
          return { message: 'Welcome to the Customer Profile' }
        }).use(middleware.role(['customer', 'admin']))
      })
      .use(middleware.auth())
  })
  .prefix('api')
