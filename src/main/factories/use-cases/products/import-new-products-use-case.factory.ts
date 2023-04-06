import { UseCase } from '@use-cases/_shared/use-case';
import { ImportNewProductsUseCase, ImportNewProductsUseCaseDTO } from '@use-cases/products/import-new-products.use-case';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeOpenFoodFactsProvider } from '@factories/providers/open-food-facts-provider.factory';
import { makeProductsRepository } from '@factories/repositories/products-repository.factory';

export const makeImportNewProductsUseCase = (): UseCase<
  ImportNewProductsUseCaseDTO.Parameters,
  ImportNewProductsUseCaseDTO.ResultFailure,
  ImportNewProductsUseCaseDTO.ResultSuccess
> => new ImportNewProductsUseCase(makeLoggerProvider(), makeOpenFoodFactsProvider(), makeProductsRepository());
