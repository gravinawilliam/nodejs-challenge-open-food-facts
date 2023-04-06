import { ISendLogTimeUseCaseLoggerProvider } from '@contracts/providers/logger/send-log-time-use-case.logger-provider';
import { IFindLastProductsImportHistoryRepository } from '@contracts/repositories/products-import-history/find-last.products-import-history-repository';

import { RepositoryError } from '@errors/_shared/repository.error';

import { ProductImportHistory } from '@models/product-import-history.model';

import { UseCase } from '@use-cases/_shared/use-case';

import { Either, failure, success } from '@shared/utils/either.util';

export class GetLastProductsImportHistoryUseCase extends UseCase<
  GetLastProductsImportHistoryUseCaseDTO.Parameters,
  GetLastProductsImportHistoryUseCaseDTO.ResultFailure,
  GetLastProductsImportHistoryUseCaseDTO.ResultSuccess
> {
  constructor(
    loggerProvider: ISendLogTimeUseCaseLoggerProvider,
    private readonly productsImportHistoryRepository: IFindLastProductsImportHistoryRepository
  ) {
    super(loggerProvider);
  }

  protected async performOperation(): GetLastProductsImportHistoryUseCaseDTO.Result {
    const resultFindLastImport = await this.productsImportHistoryRepository.findLast();
    if (resultFindLastImport.isFailure()) return failure(resultFindLastImport.value);
    const { lastImport } = resultFindLastImport.value;

    return success({ lastImport });
  }
}

export namespace GetLastProductsImportHistoryUseCaseDTO {
  export type Parameters = Readonly<undefined>;

  export type ResultFailure = Readonly<RepositoryError>;
  export type ResultSuccess = Readonly<{ lastImport?: ProductImportHistory }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}
