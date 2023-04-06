import { UseCase } from '@use-cases/_shared/use-case';
import { FindProductUseCase, FindProductUseCaseDTO } from '@use-cases/products/find-product.use-case';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeProductsRepository } from '@factories/repositories/products-repository.factory';

export const makeFindProductUseCase = (): UseCase<
  FindProductUseCaseDTO.Parameters,
  FindProductUseCaseDTO.ResultFailure,
  FindProductUseCaseDTO.ResultSuccess
> => new FindProductUseCase(makeLoggerProvider(), makeProductsRepository());
