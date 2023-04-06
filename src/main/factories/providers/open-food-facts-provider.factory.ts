import { IGetNewProductsOpenFoodFactsProvider } from '@contracts/providers/open-food-facts/get-new-products.open-food-facts-provider';

import { OpenFoodFactsApiProvider } from '@infrastructure/providers/open-food-facts/open-food-facts-api.provider';

import { makeLoggerProvider } from './logger-provider.factory';

export const makeOpenFoodFactsProvider = (): IGetNewProductsOpenFoodFactsProvider =>
  new OpenFoodFactsApiProvider(makeLoggerProvider());
