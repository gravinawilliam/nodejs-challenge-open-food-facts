import { makeDeleteProductUseCase } from '@factories/use-cases/products/delete-product-use-case.factory';

import { DeleteProductController } from '@main/controllers/products/delete-product.controller';

export const makeDeleteProductController = () => new DeleteProductController(makeDeleteProductUseCase());
