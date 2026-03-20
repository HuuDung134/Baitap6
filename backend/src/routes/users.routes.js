import { Router } from 'express'
import * as usersController from '../controllers/users.controller.js'
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/me', requireAuth, usersController.me)
router.get('/', requireAuth, requireRole(['admin']), usersController.list)
router.patch('/:id/role', requireAuth, requireRole(['admin']), usersController.updateRole)

export default router

