import { ISendLogTimeUseCaseLoggerProvider } from '@contracts/providers/logger/send-log-time-use-case.logger-provider';
import { IFindProductsRepository } from '@contracts/repositories/products/find.products-repository';
import { ISoftDeleteProductsRepository } from '@contracts/repositories/products/soft-delete.products-repository';

import { RepositoryError } from '@errors/_shared/repository.error';
import { NoExistsProductError } from '@errors/models/product/no-exists-product.error';

import { Product, ProductStatus } from '@models/product.model';

import { UseCase } from '@use-cases/_shared/use-case';

import { Either, failure, success } from '@shared/utils/either.util';

export class DeleteProductUseCase extends UseCase<
  DeleteProductUseCaseDTO.Parameters,
  DeleteProductUseCaseDTO.ResultFailure,
  DeleteProductUseCaseDTO.ResultSuccess
> {
  constructor(
    loggerProvider: ISendLogTimeUseCaseLoggerProvider,
    private readonly productsRepository: IFindProductsRepository & ISoftDeleteProductsRepository
  ) {
    super(loggerProvider);
  }

  protected async performOperation(parameters: DeleteProductUseCaseDTO.Parameters): DeleteProductUseCaseDTO.Result {
    const resultFindProduct = await this.productsRepository.find({
      code: parameters.code
    });
    if (resultFindProduct.isFailure()) return failure(resultFindProduct.value);

    const { product } = resultFindProduct.value;
    if (product === undefined) return failure(new NoExistsProductError({ code: parameters.code }));

    const resultSoftDeleteProduct = await this.productsRepository.softDelete({
      code: product.code,
      status: ProductStatus.TRASH
    });
    if (resultSoftDeleteProduct.isFailure()) return failure(resultSoftDeleteProduct.value);

    const { productSoftDeleted } = resultSoftDeleteProduct.value;

    return success({
      productDeleted: {
        code: productSoftDeleted.code,
        id: productSoftDeleted.id,
        status: productSoftDeleted.status
      }
    });
  }
}

export namespace DeleteProductUseCaseDTO {
  export type Parameters = Readonly<{ code: string }>;

  export type ResultFailure = Readonly<RepositoryError | NoExistsProductError>;
  export type ResultSuccess = Readonly<{ productDeleted: Pick<Product, 'status' | 'code' | 'id'> }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}
