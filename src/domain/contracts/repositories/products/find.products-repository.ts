import { RepositoryError } from '@errors/_shared/repository.error';

import { Product } from '@models/product.model';

import { Either } from '@shared/utils/either.util';

export namespace FindProductsRepositoryDTO {
  export type Parameters = Readonly<{
    code: string;
  }>;

  export type ResultFailure = Readonly<RepositoryError>;
  export type ResultSuccess = Readonly<{
    product?: Product;
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

export interface IFindProductsRepository {
  find(parameters: FindProductsRepositoryDTO.Parameters): FindProductsRepositoryDTO.Result;
}
