import { UseCase } from '@use-cases/_shared/use-case';
import {
  GetLastProductsImportHistoryUseCase,
  GetLastProductsImportHistoryUseCaseDTO
} from '@use-cases/products-import-history/get-last-products-import-history.use-case';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';
import { makeProductsImportHistoryRepository } from '@factories/repositories/products-import-history-repository.factory';

export const makeGetLastProductsImportHistoryUseCase = (): UseCase<
  GetLastProductsImportHistoryUseCaseDTO.Parameters,
  GetLastProductsImportHistoryUseCaseDTO.ResultFailure,
  GetLastProductsImportHistoryUseCaseDTO.ResultSuccess
> => new GetLastProductsImportHistoryUseCase(makeLoggerProvider(), makeProductsImportHistoryRepository());
