import { Router } from 'express';

import { makeHealthCheckController } from '@factories/controllers/health-check/health-check-controller.factory';

import { adapterRoute } from '@main/frameworks/express/adapters/express-router.adapter';

const router: Router = Router();

router.post('/', adapterRoute({ controller: makeHealthCheckController(), validation: undefined }));

export default router;
