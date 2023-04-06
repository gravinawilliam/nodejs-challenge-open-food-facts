import { RepositoryError } from '@errors/_shared/repository.error';

import { ProductImportHistory } from '@models/product-import-history.model';

import { Either } from '@shared/utils/either.util';

export namespace FindLastProductsImportHistoryRepositoryDTO {
  export type ResultFailure = Readonly<RepositoryError>;
  export type ResultSuccess = Readonly<{
    lastImport?: ProductImportHistory;
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

export interface IFindLastProductsImportHistoryRepository {
  findLast(): FindLastProductsImportHistoryRepositoryDTO.Result;
}
