import { ISendLogTimeUseCaseLoggerProvider } from '@contracts/providers/logger/send-log-time-use-case.logger-provider';
import { IGetNewProductsOpenFoodFactsProvider } from '@contracts/providers/open-food-facts/get-new-products.open-food-facts-provider';
import { IGetAllProductsRepository } from '@contracts/repositories/products/get-all.products-repository';
import { ISaveManyProductsRepository } from '@contracts/repositories/products/save-many.products-repository';

import { ProviderError } from '@errors/_shared/provider.error';
import { RepositoryError } from '@errors/_shared/repository.error';

import { Product } from '@models/product.model';

import { UseCase } from '@use-cases/_shared/use-case';

import { Either, failure, success } from '@shared/utils/either.util';

export class ImportNewProductsUseCase extends UseCase<
  ImportNewProductsUseCaseDTO.Parameters,
  ImportNewProductsUseCaseDTO.ResultFailure,
  ImportNewProductsUseCaseDTO.ResultSuccess
> {
  constructor(
    loggerProvider: ISendLogTimeUseCaseLoggerProvider,
    private readonly openFoodFactsProvider: IGetNewProductsOpenFoodFactsProvider,
    private readonly productsRepository: IGetAllProductsRepository & ISaveManyProductsRepository
  ) {
    super(loggerProvider);
  }

  protected async performOperation(): ImportNewProductsUseCaseDTO.Result {
    const resultGetAllProducts = await this.productsRepository.getAll();
    if (resultGetAllProducts.isFailure()) return failure(resultGetAllProducts.value);
    const { products } = resultGetAllProducts.value;

    const resultGetNewProducts = await this.openFoodFactsProvider.getNewProducts({
      existingProducts: products,
      quantityProductsToGetPerFile: 100
    });
    if (resultGetNewProducts.isFailure()) return failure(resultGetNewProducts.value);
    const { newProducts } = resultGetNewProducts.value;

    if (newProducts.length === 0) return success({ newProducts: [] });

    const resultSaveManyProducts = await this.productsRepository.saveMany({
      products: newProducts
    });
    if (resultSaveManyProducts.isFailure()) return failure(resultSaveManyProducts.value);

    return success({ newProducts: newProducts.map(({ code }) => ({ code })) });
  }
}

export namespace ImportNewProductsUseCaseDTO {
  export type Parameters = Readonly<undefined>;

  export type ResultFailure = Readonly<RepositoryError | ProviderError>;
  export type ResultSuccess = Readonly<{
    newProducts: Pick<Product, 'code'>[];
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}
