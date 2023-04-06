import { makeListProductsUseCase } from '@factories/use-cases/products/list-products-use-case.factory';

import { ListProductsController } from '@main/controllers/products/list-products.controller';

export const makeListProductsController = () => new ListProductsController(makeListProductsUseCase());
