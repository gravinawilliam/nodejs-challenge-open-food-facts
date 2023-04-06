import { makeFindProductUseCase } from '@factories/use-cases/products/find-product-use-case.factory';

import { FindProductController } from '@main/controllers/products/find-product.controller';

export const makeFindProductController = () => new FindProductController(makeFindProductUseCase());
