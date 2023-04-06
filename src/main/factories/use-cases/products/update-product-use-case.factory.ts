import { UseCase } from '@use-cases/_shared/use-case';
import { UpdateProductUseCaseDTO, UpdateProductUseCase } from '@use-cases/products/update-product.use-case';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeProductsRepository } from '@factories/repositories/products-repository.factory';

export const makeUpdateProductUseCase = (): UseCase<
  UpdateProductUseCaseDTO.Parameters,
  UpdateProductUseCaseDTO.ResultFailure,
  UpdateProductUseCaseDTO.ResultSuccess
> => new UpdateProductUseCase(makeLoggerProvider(), makeProductsRepository());
