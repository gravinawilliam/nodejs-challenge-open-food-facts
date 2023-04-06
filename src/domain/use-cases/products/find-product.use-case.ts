import { ISendLogTimeUseCaseLoggerProvider } from '@contracts/providers/logger/send-log-time-use-case.logger-provider';
import { IFindProductsRepository } from '@contracts/repositories/products/find.products-repository';

import { RepositoryError } from '@errors/_shared/repository.error';
import { NoExistsProductError } from '@errors/models/product/no-exists-product.error';

import { Product } from '@models/product.model';

import { UseCase } from '@use-cases/_shared/use-case';

import { Either, failure, success } from '@shared/utils/either.util';

export class FindProductUseCase extends UseCase<
  FindProductUseCaseDTO.Parameters,
  FindProductUseCaseDTO.ResultFailure,
  FindProductUseCaseDTO.ResultSuccess
> {
  constructor(
    loggerProvider: ISendLogTimeUseCaseLoggerProvider,
    private readonly productsRepository: IFindProductsRepository
  ) {
    super(loggerProvider);
  }

  protected async performOperation(parameters: FindProductUseCaseDTO.Parameters): FindProductUseCaseDTO.Result {
    const result = await this.productsRepository.find({
      code: parameters.code
    });
    if (result.isFailure()) return failure(result.value);

    const { product } = result.value;
    if (product === undefined) return failure(new NoExistsProductError({ code: parameters.code }));

    return success({ product });
  }
}

export namespace FindProductUseCaseDTO {
  export type Parameters = Readonly<{ code: string }>;

  export type ResultFailure = Readonly<RepositoryError | NoExistsProductError>;
  export type ResultSuccess = Readonly<{ product: Product }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}
