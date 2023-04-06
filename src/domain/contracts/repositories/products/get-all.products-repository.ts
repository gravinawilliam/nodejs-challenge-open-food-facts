import { RepositoryError } from '@errors/_shared/repository.error';

import { Product } from '@models/product.model';

import { Either } from '@shared/utils/either.util';

export namespace GetAllProductsRepositoryDTO {
  export type ResultFailure = Readonly<RepositoryError>;
  export type ResultSuccess = Readonly<{
    products: Pick<Product, 'code'>[];
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

export interface IGetAllProductsRepository {
  getAll(): GetAllProductsRepositoryDTO.Result;
}
