import { RepositoryError } from '@errors/_shared/repository.error';

import { Either } from '@shared/utils/either.util';

export namespace SaveProductsImportHistoryRepositoryDTO {
  export type Parameters = Readonly<{
    quantityImportedProducts: number;
    createdAt: Date;
    isSuccess: boolean;
    runtimeInMilliseconds: number;
  }>;

  export type ResultFailure = Readonly<RepositoryError>;
  export type ResultSuccess = Readonly<undefined>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

export interface ISaveProductsImportHistoryRepository {
  save(parameters: SaveProductsImportHistoryRepositoryDTO.Parameters): SaveProductsImportHistoryRepositoryDTO.Result;
}
