import { Router } from 'express';
import { z } from 'zod';

import { makeDeleteProductController } from '@factories/controllers/products/delete-product-controller.factory';
import { makeFindProductController } from '@factories/controllers/products/find-product-controller.factory';
import { makeListProductsController } from '@factories/controllers/products/list-products-controller.factory';
import { makeUpdateProductController } from '@factories/controllers/products/update-product-controller.factory';

import { adapterRoute } from '@main/frameworks/express/adapters/express-router.adapter';

const router: Router = Router();

const validationListProducts = z.object({
  query: z.object({
    take: z.string({ required_error: 'Query take is required' }).transform(Number),
    skip: z.string({ required_error: 'Query skip is required' }).transform(Number)
  })
});

const validationFindProduct = z.object({
  params: z.object({ code: z.string({ required_error: 'Params code is required.' }) })
});

const validationDeleteProduct = z.object({
  params: z.object({ code: z.string({ required_error: 'Params code is required.' }) })
});

const validationUpdateProduct = z.object({
  params: z.object({ code: z.string({ required_error: 'Params code is required' }) })
});

router.get(
  '/',
  adapterRoute({
    controller: makeListProductsController(),
    validation: validationListProducts
  })
);

router.get(
  '/:code',
  adapterRoute({
    controller: makeFindProductController(),
    validation: validationFindProduct
  })
);

router.delete(
  '/:code',
  adapterRoute({
    controller: makeDeleteProductController(),
    validation: validationDeleteProduct
  })
);

router.put(
  '/:code',
  adapterRoute({
    controller: makeUpdateProductController(),
    validation: validationUpdateProduct
  })
);

export default router;
