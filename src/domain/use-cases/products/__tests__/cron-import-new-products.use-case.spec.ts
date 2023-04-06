import { MockProxy, mock } from 'jest-mock-extended';

import { ISendLogTimeUseCaseLoggerProvider } from '@contracts/providers/logger/send-log-time-use-case.logger-provider';
import { IFindLastProductsImportHistoryRepository } from '@contracts/repositories/products-import-history/find-last.products-import-history-repository';
import { ISaveProductsImportHistoryRepository } from '@contracts/repositories/products-import-history/save.products-import-history-repository';

import { ProviderError, OpenFoodFactsProviderMethods, ProviderNames } from '@errors/_shared/provider.error';
import {
  ProductsImportHistoryRepositoryMethods,
  RepositoryError,
  RepositoryNames
} from '@errors/_shared/repository.error';
import { InvalidImportTimeError } from '@errors/models/products-import-history/invalid-import-time.error';

import { UseCase } from '@use-cases/_shared/use-case';
import {
  CronImportNewProductsUseCase,
  CronImportNewProductsUseCaseDTO
} from '@use-cases/products/cron-import-new-products.use-case';
import { ImportNewProductsUseCaseDTO } from '@use-cases/products/import-new-products.use-case';

import { failure, success } from '@shared/utils/either.util';
import * as Generate from '@shared/utils/faker.util';

describe('Cron import new products USE CASE', () => {
  let sut: UseCase<
    CronImportNewProductsUseCaseDTO.Parameters,
    CronImportNewProductsUseCaseDTO.ResultFailure,
    CronImportNewProductsUseCaseDTO.ResultSuccess
  >;

  let loggerProvider: MockProxy<ISendLogTimeUseCaseLoggerProvider>;
  let importNewProductsUseCase: MockProxy<
    UseCase<
      ImportNewProductsUseCaseDTO.Parameters,
      ImportNewProductsUseCaseDTO.ResultFailure,
      ImportNewProductsUseCaseDTO.ResultSuccess
    >
  >;
  let productsImportHistoryRepository: MockProxy<
    ISaveProductsImportHistoryRepository & IFindLastProductsImportHistoryRepository
  >;

  let correctParametersSut: ImportNewProductsUseCaseDTO.Parameters;

  const PRODUCTS_WITH_CODE_ONLY = Generate.productsWithCodeOnly({ quantity: 100 });

  const ONE_DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
  const ONE_HOUR_IN_MILLISECONDS = 1000 * 60 * 60;
  const LAST_IMPORT = {
    createdAt: new Date(Date.now() - ONE_DAY_IN_MILLISECONDS - ONE_HOUR_IN_MILLISECONDS),
    id: 'any_id',
    isSuccess: true,
    quantityImportedProducts: 900,
    runtimeInMilliseconds: 247.816_744_999_960_06
  };

  beforeAll(() => {
    loggerProvider = mock();

    importNewProductsUseCase = mock();
    importNewProductsUseCase.execute.mockResolvedValue(success({ newProducts: PRODUCTS_WITH_CODE_ONLY }));

    productsImportHistoryRepository = mock();
    productsImportHistoryRepository.findLast.mockResolvedValue(success({ lastImport: LAST_IMPORT }));
    productsImportHistoryRepository.save.mockResolvedValue(success(undefined));
  });

  beforeEach(() => {
    correctParametersSut = undefined;

    sut = new CronImportNewProductsUseCase(loggerProvider, importNewProductsUseCase, productsImportHistoryRepository);
  });

  it('should call find last products import history repository with correct parameters', async () => {
    await sut.execute(correctParametersSut);

    expect(productsImportHistoryRepository.findLast).toHaveBeenCalledWith();
    expect(productsImportHistoryRepository.findLast).toHaveBeenCalledTimes(1);
  });

  it('should return RepositoryError if find last products import history repository return failure', async () => {
    const error = new RepositoryError({
      repository: {
        method: ProductsImportHistoryRepositoryMethods.FIND_LAST,
        name: RepositoryNames.PRODUCTS_IMPORT_HISTORY
      }
    });
    productsImportHistoryRepository.findLast.mockResolvedValueOnce(failure(error));

    const result = await sut.execute(correctParametersSut);

    expect(productsImportHistoryRepository.findLast).toHaveBeenCalledTimes(1);
    expect(productsImportHistoryRepository.save).toHaveBeenCalledTimes(0);
    expect(result.value).toEqual(error);
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
  });

  it('should return InvalidImportTimeError if time left in milliseconds greater than 0', async () => {
    productsImportHistoryRepository.findLast.mockResolvedValueOnce(
      success({
        lastImport: {
          ...LAST_IMPORT,
          createdAt: new Date(Date.now() - ONE_HOUR_IN_MILLISECONDS)
        }
      })
    );

    const error = new InvalidImportTimeError();

    const result = await sut.execute(correctParametersSut);

    expect(productsImportHistoryRepository.findLast).toHaveBeenCalledTimes(1);
    expect(productsImportHistoryRepository.save).toHaveBeenCalledTimes(0);
    expect(result.value).toEqual(error);
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
  });

  it('should call import new products use-case with correct parameters', async () => {
    await sut.execute(correctParametersSut);

    expect(importNewProductsUseCase.execute).toHaveBeenCalledWith(undefined as ImportNewProductsUseCaseDTO.Parameters);
    expect(importNewProductsUseCase.execute).toHaveBeenCalledTimes(1);
  });

  it('should return failure call save products import history repository', async () => {
    const error = new ProviderError({
      provider: {
        method: OpenFoodFactsProviderMethods.GET_NEW_PRODUCTS,
        name: ProviderNames.OPEN_FOOD_FACTS
      }
    });
    importNewProductsUseCase.execute.mockResolvedValueOnce(failure(error));

    const result = await sut.execute(correctParametersSut);

    expect(productsImportHistoryRepository.findLast).toHaveBeenCalledTimes(1);
    expect(productsImportHistoryRepository.save).toHaveBeenCalledTimes(1);
    expect(result.value).toBeUndefined();
    expect(result.isSuccess()).toBeTruthy();
    expect(result.isFailure()).toBeFalsy();
  });

  it('should call save products import history repository with correct parameters', async () => {
    await sut.execute(correctParametersSut);

    expect(productsImportHistoryRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should success cron import new products', async () => {
    const result = await sut.execute(correctParametersSut);

    expect(result.value).toBeUndefined();
    expect(productsImportHistoryRepository.findLast).toHaveBeenCalledTimes(1);
    expect(productsImportHistoryRepository.save).toHaveBeenCalledTimes(1);
    expect(result.isSuccess()).toBeTruthy();
    expect(result.isFailure()).toBeFalsy();
  });
});
