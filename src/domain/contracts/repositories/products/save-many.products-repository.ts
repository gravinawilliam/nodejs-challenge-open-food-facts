import { RepositoryError } from '@errors/_shared/repository.error';

import { Product } from '@models/product.model';

import { Either } from '@shared/utils/either.util';

export namespace SaveManyProductsRepositoryDTO {
  export type Parameters = Readonly<{
    products: Omit<Product, 'id'>[];
  }>;

  export type ResultFailure = Readonly<RepositoryError>;
  export type ResultSuccess = Readonly<undefined>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

export interface ISaveManyProductsRepository {
  saveMany(parameters: SaveManyProductsRepositoryDTO.Parameters): SaveManyProductsRepositoryDTO.Result;
}
