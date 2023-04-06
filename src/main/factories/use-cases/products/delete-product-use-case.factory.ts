import { UseCase } from '@use-cases/_shared/use-case';
import { DeleteProductUseCase, DeleteProductUseCaseDTO } from '@use-cases/products/delete-product.use-case';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeProductsRepository } from '@factories/repositories/products-repository.factory';

export const makeDeleteProductUseCase = (): UseCase<
  DeleteProductUseCaseDTO.Parameters,
  DeleteProductUseCaseDTO.ResultFailure,
  DeleteProductUseCaseDTO.ResultSuccess
> => new DeleteProductUseCase(makeLoggerProvider(), makeProductsRepository());
