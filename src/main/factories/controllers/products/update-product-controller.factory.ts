import { makeUpdateProductUseCase } from '@factories/use-cases/products/update-product-use-case.factory';

import { UpdateProductController } from '@main/controllers/products/update-product.controller';

export const makeUpdateProductController = () => new UpdateProductController(makeUpdateProductUseCase());
