import { Router } from 'express';

import healthCheck from './health-check.route';
import products from './products.route';

const routes: Router = Router();

routes.use('/', healthCheck);
routes.use('/products', products);

export default routes;
