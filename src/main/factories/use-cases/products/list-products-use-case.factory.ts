import { UseCase } from '@use-cases/_shared/use-case';
import { ListProductsUseCase, ListProductsUseCaseDTO } from '@use-cases/products/list-products.use-case';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeProductsRepository } from '@factories/repositories/products-repository.factory';

export const makeListProductsUseCase = (): UseCase<
  ListProductsUseCaseDTO.Parameters,
  ListProductsUseCaseDTO.ResultFailure,
  ListProductsUseCaseDTO.ResultSuccess
> => new ListProductsUseCase(makeLoggerProvider(), makeProductsRepository());
