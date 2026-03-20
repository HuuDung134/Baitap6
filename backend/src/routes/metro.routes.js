import { Router } from 'express'
import * as metroController from '../controllers/metro.controller.js'
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js'

const router = Router()

router.post('/tickets/:code/validate-entry', requireAuth, requireRole(['staff', 'admin']), metroController.validateEntry)
router.post(
  '/tickets/:code/manual-inspection',
  requireAuth,
  requireRole(['inspector', 'admin']),
  metroController.manualInspection,
)

export default router

