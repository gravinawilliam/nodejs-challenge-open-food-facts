import { RepositoryError } from '@errors/_shared/repository.error';

import { Product } from '@models/product.model';

import { Either } from '@shared/utils/either.util';

export namespace UpdateProductsRepositoryDTO {
  export type Parameters = Readonly<{
    code: string;
    product: Omit<Product, 'id'>;
  }>;

  export type ResultFailure = Readonly<RepositoryError>;
  export type ResultSuccess = Readonly<undefined>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

export interface IUpdateProductsRepository {
  update(parameters: UpdateProductsRepositoryDTO.Parameters): UpdateProductsRepositoryDTO.Result;
}
