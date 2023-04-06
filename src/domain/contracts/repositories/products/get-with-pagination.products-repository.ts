import { RepositoryError } from '@errors/_shared/repository.error';

import { Product } from '@models/product.model';

import { Either } from '@shared/utils/either.util';

export namespace GetWithPaginationProductsRepositoryDTO {
  export type Parameters = Readonly<{
    take: number;
    skip: number;
  }>;

  export type ResultFailure = Readonly<RepositoryError>;
  export type ResultSuccess = Readonly<{
    products: Product[];
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

export interface IGetWithPaginationProductsRepository {
  getWithPagination(
    parameters: GetWithPaginationProductsRepositoryDTO.Parameters
  ): GetWithPaginationProductsRepositoryDTO.Result;
}
