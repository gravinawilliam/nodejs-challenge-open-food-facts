import { RepositoryError } from '@errors/_shared/repository.error';

import { Product, ProductStatus } from '@models/product.model';

import { Either } from '@shared/utils/either.util';

export namespace SoftDeleteProductsRepositoryDTO {
  export type Parameters = Readonly<{
    code: string;
    status: ProductStatus;
  }>;

  export type ResultFailure = Readonly<RepositoryError>;
  export type ResultSuccess = Readonly<{
    productSoftDeleted: Pick<Product, 'code' | 'status' | 'id'>;
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

export interface ISoftDeleteProductsRepository {
  softDelete(parameters: SoftDeleteProductsRepositoryDTO.Parameters): SoftDeleteProductsRepositoryDTO.Result;
}
