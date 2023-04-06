import { performance } from 'node:perf_hooks';

import { ISendLogTimeUseCaseLoggerProvider } from '@contracts/providers/logger/send-log-time-use-case.logger-provider';
import { IFindLastProductsImportHistoryRepository } from '@contracts/repositories/products-import-history/find-last.products-import-history-repository';
import { ISaveProductsImportHistoryRepository } from '@contracts/repositories/products-import-history/save.products-import-history-repository';

import { RepositoryError } from '@errors/_shared/repository.error';
import { InvalidImportTimeError } from '@errors/models/products-import-history/invalid-import-time.error';

import { UseCase } from '@use-cases/_shared/use-case';

import { Either, failure, success } from '@shared/utils/either.util';

import { ImportNewProductsUseCaseDTO } from './import-new-products.use-case';

export class CronImportNewProductsUseCase extends UseCase<
  CronImportNewProductsUseCaseDTO.Parameters,
  CronImportNewProductsUseCaseDTO.ResultFailure,
  CronImportNewProductsUseCaseDTO.ResultSuccess
> {
  constructor(
    loggerProvider: ISendLogTimeUseCaseLoggerProvider,
    private readonly importNewProductsUseCase: UseCase<
      ImportNewProductsUseCaseDTO.Parameters,
      ImportNewProductsUseCaseDTO.ResultFailure,
      ImportNewProductsUseCaseDTO.ResultSuccess
    >,
    private readonly productsImportHistoryRepository: ISaveProductsImportHistoryRepository &
      IFindLastProductsImportHistoryRepository
  ) {
    super(loggerProvider);
  }

  protected async performOperation(): CronImportNewProductsUseCaseDTO.Result {
    const resultFindLastImport = await this.productsImportHistoryRepository.findLast();
    if (resultFindLastImport.isFailure()) return failure(resultFindLastImport.value);
    const { lastImport } = resultFindLastImport.value;

    if (lastImport !== undefined) {
      const ONE_DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
      const LAST_IMPORT_DATE_IN_MILLISECONDS = lastImport.createdAt.getTime();
      const NOW = Date.now();

      const timeLeftInMilliseconds = ONE_DAY_IN_MILLISECONDS + LAST_IMPORT_DATE_IN_MILLISECONDS - NOW;

      if (timeLeftInMilliseconds > 0) {
        return failure(new InvalidImportTimeError());
      }
    }

    const startTimeInMilliseconds = performance.now();

    const resultImportNewProducts = await this.importNewProductsUseCase.execute(undefined);

    let quantityImportedProducts = 0;
    if (resultImportNewProducts.isSuccess()) quantityImportedProducts = resultImportNewProducts.value.newProducts.length;

    await this.productsImportHistoryRepository.save({
      quantityImportedProducts,
      createdAt: new Date(),
      isSuccess: resultImportNewProducts.isSuccess(),
      runtimeInMilliseconds: performance.now() - startTimeInMilliseconds
    });

    return success(undefined);
  }
}

export namespace CronImportNewProductsUseCaseDTO {
  export type Parameters = Readonly<undefined>;

  export type ResultFailure = Readonly<RepositoryError | InvalidImportTimeError>;
  export type ResultSuccess = Readonly<undefined>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}
