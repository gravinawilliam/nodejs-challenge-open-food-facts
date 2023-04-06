import { UseCase } from '@use-cases/_shared/use-case';
import {
  CronImportNewProductsUseCase,
  CronImportNewProductsUseCaseDTO
} from '@use-cases/products/cron-import-new-products.use-case';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeProductsImportHistoryRepository } from '@factories/repositories/products-import-history-repository.factory';

import { makeImportNewProductsUseCase } from './import-new-products-use-case.factory';

export const makeCronImportNewProductsUseCase = (): UseCase<
  CronImportNewProductsUseCaseDTO.Parameters,
  CronImportNewProductsUseCaseDTO.ResultFailure,
  CronImportNewProductsUseCaseDTO.ResultSuccess
> =>
  new CronImportNewProductsUseCase(
    makeLoggerProvider(),
    makeImportNewProductsUseCase(),
    makeProductsImportHistoryRepository()
  );
