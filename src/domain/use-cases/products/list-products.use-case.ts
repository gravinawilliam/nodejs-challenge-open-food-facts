import { ISendLogTimeUseCaseLoggerProvider } from '@contracts/providers/logger/send-log-time-use-case.logger-provider';
import { IGetWithPaginationProductsRepository } from '@contracts/repositories/products/get-with-pagination.products-repository';

import { RepositoryError } from '@errors/_shared/repository.error';
import { InvalidPaginationParametersError } from '@errors/use-cases/list-products/invalid-pagination-parameters.error';

import { Product } from '@models/product.model';

import { UseCase } from '@use-cases/_shared/use-case';

import { Either, failure, success } from '@shared/utils/either.util';

export class ListProductsUseCase extends UseCase<
  ListProductsUseCaseDTO.Parameters,
  ListProductsUseCaseDTO.ResultFailure,
  ListProductsUseCaseDTO.ResultSuccess
> {
  constructor(
    loggerProvider: ISendLogTimeUseCaseLoggerProvider,
    private readonly productsRepository: IGetWithPaginationProductsRepository
  ) {
    super(loggerProvider);
  }

  protected async performOperation(parameters: ListProductsUseCaseDTO.Parameters): ListProductsUseCaseDTO.Result {
    if (parameters.skip < 0) {
      return failure(new InvalidPaginationParametersError({ skip: parameters.skip }));
    }
    if (parameters.take !== 10 && parameters.take !== 30 && parameters.take !== 50) {
      return failure(new InvalidPaginationParametersError({ take: parameters.take }));
    }

    const result = await this.productsRepository.getWithPagination({
      skip: parameters.skip,
      take: parameters.take
    });
    if (result.isFailure()) return failure(result.value);
    const { products } = result.value;

    return success({ products });
  }
}

export namespace ListProductsUseCaseDTO {
  export type Parameters = Readonly<{
    skip: number;
    take: number;
  }>;

  export type ResultFailure = Readonly<RepositoryError | InvalidPaginationParametersError>;
  export type ResultSuccess = Readonly<{
    products: Product[];
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}
