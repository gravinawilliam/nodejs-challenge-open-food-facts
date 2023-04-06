import { ProviderError } from '@errors/_shared/provider.error';

import { Product } from '@models/product.model';

import { Either } from '@shared/utils/either.util';

export namespace GetNewProductsOpenFoodFactsProviderDTO {
  export type Parameters = Readonly<{
    existingProducts: Pick<Product, 'code'>[];
    quantityProductsToGetPerFile: number;
  }>;

  export type ResultFailure = Readonly<ProviderError>;
  export type ResultSuccess = Readonly<{
    newProducts: Omit<Product, 'id'>[];
  }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}

export interface IGetNewProductsOpenFoodFactsProvider {
  getNewProducts(
    parameters: GetNewProductsOpenFoodFactsProviderDTO.Parameters
  ): GetNewProductsOpenFoodFactsProviderDTO.Result;
}
