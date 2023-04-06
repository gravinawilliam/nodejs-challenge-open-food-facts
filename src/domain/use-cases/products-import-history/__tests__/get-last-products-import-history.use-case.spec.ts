import { MockProxy, mock } from 'jest-mock-extended';

import { ISendLogTimeUseCaseLoggerProvider } from '@contracts/providers/logger/send-log-time-use-case.logger-provider';
import { IFindLastProductsImportHistoryRepository } from '@contracts/repositories/products-import-history/find-last.products-import-history-repository';

import {
  ProductsImportHistoryRepositoryMethods,
  RepositoryError,
  RepositoryNames
} from '@errors/_shared/repository.error';

import { UseCase } from '@use-cases/_shared/use-case';
import {
  GetLastProductsImportHistoryUseCase,
  GetLastProductsImportHistoryUseCaseDTO
} from '@use-cases/products-import-history/get-last-products-import-history.use-case';

import { failure, success } from '@shared/utils/either.util';

describe('Get last products import history USE CASE', () => {
  let sut: UseCase<
    GetLastProductsImportHistoryUseCaseDTO.Parameters,
    GetLastProductsImportHistoryUseCaseDTO.ResultFailure,
    GetLastProductsImportHistoryUseCaseDTO.ResultSuccess
  >;

  let loggerProvider: MockProxy<ISendLogTimeUseCaseLoggerProvider>;
  let productsImportHistoryRepository: MockProxy<IFindLastProductsImportHistoryRepository>;

  let correctParametersSut: GetLastProductsImportHistoryUseCaseDTO.Parameters;

  const LAST_IMPORT = {
    createdAt: new Date(),
    id: 'any_id',
    isSuccess: true,
    quantityImportedProducts: 900,
    runtimeInMilliseconds: 247.816_744_999_960_06
  };

  beforeAll(() => {
    loggerProvider = mock();

    productsImportHistoryRepository = mock();
    productsImportHistoryRepository.findLast.mockResolvedValue(
      success({
        lastImport: LAST_IMPORT
      })
    );
  });

  beforeEach(() => {
    correctParametersSut = undefined;

    sut = new GetLastProductsImportHistoryUseCase(loggerProvider, productsImportHistoryRepository);
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
    expect(result.value).toEqual(error);
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
  });

  it('should success get last products import history', async () => {
    const result = await sut.execute(correctParametersSut);

    expect(result.value).toEqual({
      lastImport: LAST_IMPORT
    } as GetLastProductsImportHistoryUseCaseDTO.ResultSuccess);
    expect(productsImportHistoryRepository.findLast).toHaveBeenCalledTimes(1);
    expect(result.isSuccess()).toBeTruthy();
    expect(result.isFailure()).toBeFalsy();
  });

  it('should success get last products import history but last import is undefined', async () => {
    productsImportHistoryRepository.findLast.mockResolvedValueOnce(success({ lastImport: undefined }));

    const result = await sut.execute(correctParametersSut);

    expect(result.value).toEqual({
      lastImport: undefined
    } as GetLastProductsImportHistoryUseCaseDTO.ResultSuccess);
    expect(productsImportHistoryRepository.findLast).toHaveBeenCalledTimes(1);
    expect(result.isSuccess()).toBeTruthy();
    expect(result.isFailure()).toBeFalsy();
  });
});
