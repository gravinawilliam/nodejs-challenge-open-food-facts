import { MockProxy, mock } from 'jest-mock-extended';

import { ISendLogTimeUseCaseLoggerProvider } from '@contracts/providers/logger/send-log-time-use-case.logger-provider';
import {
  GetNewProductsOpenFoodFactsProviderDTO,
  IGetNewProductsOpenFoodFactsProvider
} from '@contracts/providers/open-food-facts/get-new-products.open-food-facts-provider';
import { IGetAllProductsRepository } from '@contracts/repositories/products/get-all.products-repository';
import {
  ISaveManyProductsRepository,
  SaveManyProductsRepositoryDTO
} from '@contracts/repositories/products/save-many.products-repository';

import { OpenFoodFactsProviderMethods, ProviderError, ProviderNames } from '@errors/_shared/provider.error';
import { ProductsRepositoryMethods, RepositoryError, RepositoryNames } from '@errors/_shared/repository.error';

import { UseCase } from '@use-cases/_shared/use-case';
import { ImportNewProductsUseCase, ImportNewProductsUseCaseDTO } from '@use-cases/products/import-new-products.use-case';

import { failure, success } from '@shared/utils/either.util';
import * as Generate from '@shared/utils/faker.util';

describe('Import new products USE CASE', () => {
  let sut: UseCase<
    ImportNewProductsUseCaseDTO.Parameters,
    ImportNewProductsUseCaseDTO.ResultFailure,
    ImportNewProductsUseCaseDTO.ResultSuccess
  >;

  let loggerProvider: MockProxy<ISendLogTimeUseCaseLoggerProvider>;
  let openFoodFactsProvider: MockProxy<IGetNewProductsOpenFoodFactsProvider>;
  let productsRepository: MockProxy<IGetAllProductsRepository & ISaveManyProductsRepository>;

  let correctParametersSut: ImportNewProductsUseCaseDTO.Parameters;

  const PRODUCTS_WITH_CODE_ONLY = Generate.productsWithCodeOnly({ quantity: 100 });
  const NEW_PRODUCTS = Generate.products({ quantity: 900 });

  beforeAll(() => {
    loggerProvider = mock();

    openFoodFactsProvider = mock();
    openFoodFactsProvider.getNewProducts.mockResolvedValue(success({ newProducts: NEW_PRODUCTS }));

    productsRepository = mock();
    productsRepository.getAll.mockResolvedValue(success({ products: PRODUCTS_WITH_CODE_ONLY }));
    productsRepository.saveMany.mockResolvedValue(success(undefined));
  });

  beforeEach(() => {
    correctParametersSut = undefined;

    sut = new ImportNewProductsUseCase(loggerProvider, openFoodFactsProvider, productsRepository);
  });

  it('should call get all products repository with correct parameters', async () => {
    await sut.execute(correctParametersSut);

    expect(productsRepository.getAll).toHaveBeenCalledWith();
    expect(productsRepository.getAll).toHaveBeenCalledTimes(1);
  });

  it('should return RepositoryError if get all products repository return failure', async () => {
    const error = new RepositoryError({
      repository: {
        method: ProductsRepositoryMethods.GET_ALL,
        name: RepositoryNames.PRODUCTS
      }
    });
    productsRepository.getAll.mockResolvedValueOnce(failure(error));

    const result = await sut.execute(correctParametersSut);

    expect(productsRepository.getAll).toHaveBeenCalledTimes(1);
    expect(openFoodFactsProvider.getNewProducts).toHaveBeenCalledTimes(0);
    expect(productsRepository.saveMany).toHaveBeenCalledTimes(0);
    expect(result.value).toEqual(error);
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
  });

  it('should call get new products open food facts provider with correct parameters', async () => {
    await sut.execute(correctParametersSut);

    expect(openFoodFactsProvider.getNewProducts).toHaveBeenCalledWith({
      existingProducts: PRODUCTS_WITH_CODE_ONLY,
      quantityProductsToGetPerFile: 100
    } as GetNewProductsOpenFoodFactsProviderDTO.Parameters);
    expect(openFoodFactsProvider.getNewProducts).toHaveBeenCalledTimes(1);
  });

  it('should return RepositoryError if get new products open food facts provider return failure', async () => {
    const error = new ProviderError({
      provider: {
        method: OpenFoodFactsProviderMethods.GET_NEW_PRODUCTS,
        name: ProviderNames.OPEN_FOOD_FACTS
      }
    });
    openFoodFactsProvider.getNewProducts.mockResolvedValueOnce(failure(error));

    const result = await sut.execute(correctParametersSut);

    expect(productsRepository.getAll).toHaveBeenCalledTimes(1);
    expect(openFoodFactsProvider.getNewProducts).toHaveBeenCalledTimes(1);
    expect(productsRepository.saveMany).toHaveBeenCalledTimes(0);
    expect(result.value).toEqual(error);
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
  });

  it('should return empty array new products if no have new products', async () => {
    openFoodFactsProvider.getNewProducts.mockResolvedValueOnce(success({ newProducts: [] }));

    const result = await sut.execute(correctParametersSut);

    expect(result.value).toEqual({
      newProducts: []
    } as ImportNewProductsUseCaseDTO.ResultSuccess);
    expect(openFoodFactsProvider.getNewProducts).toHaveBeenCalledTimes(1);
    expect(productsRepository.getAll).toHaveBeenCalledTimes(1);
    expect(productsRepository.saveMany).toHaveBeenCalledTimes(0);
    expect(result.isSuccess()).toBeTruthy();
    expect(result.isFailure()).toBeFalsy();
  });

  it('should call save many products repository with correct parameters', async () => {
    await sut.execute(correctParametersSut);

    expect(productsRepository.saveMany).toHaveBeenCalledWith({
      products: NEW_PRODUCTS
    } as SaveManyProductsRepositoryDTO.Parameters);
    expect(productsRepository.saveMany).toHaveBeenCalledTimes(1);
  });

  it('should return RepositoryError if save many products repository return failure', async () => {
    const error = new RepositoryError({
      repository: {
        method: ProductsRepositoryMethods.SAVE_MANY,
        name: RepositoryNames.PRODUCTS
      }
    });
    productsRepository.saveMany.mockResolvedValueOnce(failure(error));

    const result = await sut.execute(correctParametersSut);

    expect(productsRepository.getAll).toHaveBeenCalledTimes(1);
    expect(openFoodFactsProvider.getNewProducts).toHaveBeenCalledTimes(1);
    expect(productsRepository.saveMany).toHaveBeenCalledTimes(1);
    expect(result.value).toEqual(error);
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
  });

  it('should success import new products', async () => {
    const result = await sut.execute(correctParametersSut);

    expect(result.value).toEqual({
      newProducts: NEW_PRODUCTS.map(({ code }) => ({ code }))
    } as ImportNewProductsUseCaseDTO.ResultSuccess);
    expect(result.isSuccess()).toBeTruthy();
    expect(result.isFailure()).toBeFalsy();
  });
});
