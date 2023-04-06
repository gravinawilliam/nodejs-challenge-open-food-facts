import { MockProxy, mock } from 'jest-mock-extended';

import { ISendLogTimeUseCaseLoggerProvider } from '@contracts/providers/logger/send-log-time-use-case.logger-provider';
import {
  GetWithPaginationProductsRepositoryDTO,
  IGetWithPaginationProductsRepository
} from '@contracts/repositories/products/get-with-pagination.products-repository';

import { ProductsRepositoryMethods, RepositoryError, RepositoryNames } from '@errors/_shared/repository.error';
import { InvalidPaginationParametersError } from '@errors/use-cases/list-products/invalid-pagination-parameters.error';

import { UseCase } from '@use-cases/_shared/use-case';
import { ListProductsUseCase, ListProductsUseCaseDTO } from '@use-cases/products/list-products.use-case';

import { failure, success } from '@shared/utils/either.util';
import * as Generate from '@shared/utils/faker.util';

describe('List products USE CASE', () => {
  let sut: UseCase<
    ListProductsUseCaseDTO.Parameters,
    ListProductsUseCaseDTO.ResultFailure,
    ListProductsUseCaseDTO.ResultSuccess
  >;

  let loggerProvider: MockProxy<ISendLogTimeUseCaseLoggerProvider>;
  let productsRepository: MockProxy<IGetWithPaginationProductsRepository>;

  let correctParametersSut: ListProductsUseCaseDTO.Parameters;

  const TEN_PRODUCTS: GetWithPaginationProductsRepositoryDTO.ResultSuccess = {
    products: Generate.products({ quantity: 10 })
  };

  beforeAll(() => {
    loggerProvider = mock();

    productsRepository = mock();
    productsRepository.getWithPagination.mockResolvedValue(success({ products: TEN_PRODUCTS.products }));
  });

  beforeEach(() => {
    correctParametersSut = {
      skip: 0,
      take: 10
    };

    sut = new ListProductsUseCase(loggerProvider, productsRepository);
  });

  it('should return InvalidPaginationParametersError if parameters.skip less than 0 return failure', async () => {
    const skip = -1;
    const error = new InvalidPaginationParametersError({ skip });

    const result = await sut.execute({
      ...correctParametersSut,
      skip
    });

    expect(productsRepository.getWithPagination).toHaveBeenCalledTimes(0);
    expect(result.value).toEqual(error);
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
  });

  it('should return InvalidPaginationParametersError if parameters.take other than 10 or 30 or 50 return failure', async () => {
    const take = 15;
    const error = new InvalidPaginationParametersError({ take });

    const result = await sut.execute({
      skip: correctParametersSut.skip,
      take
    });

    expect(productsRepository.getWithPagination).toHaveBeenCalledTimes(0);
    expect(result.value).toEqual(error);
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
  });

  it('should call get with pagination products repository with correct parameters', async () => {
    await sut.execute(correctParametersSut);

    expect(productsRepository.getWithPagination).toHaveBeenCalledWith({
      skip: correctParametersSut.skip,
      take: correctParametersSut.take
    } as GetWithPaginationProductsRepositoryDTO.Parameters);
    expect(productsRepository.getWithPagination).toHaveBeenCalledTimes(1);
  });

  it('should return RepositoryError if get with pagination products repository return failure', async () => {
    const error = new RepositoryError({
      repository: {
        method: ProductsRepositoryMethods.GET_WITH_PAGINATION,
        name: RepositoryNames.PRODUCTS
      }
    });
    productsRepository.getWithPagination.mockResolvedValueOnce(failure(error));

    const result = await sut.execute(correctParametersSut);

    expect(productsRepository.getWithPagination).toHaveBeenCalledTimes(1);
    expect(result.value).toEqual(error);
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
  });

  it('should success list products', async () => {
    const result = await sut.execute(correctParametersSut);

    expect(result.value).toEqual({
      products: TEN_PRODUCTS.products
    } as ListProductsUseCaseDTO.ResultSuccess);
    expect(productsRepository.getWithPagination).toHaveBeenCalledTimes(1);
    expect(result.isSuccess()).toBeTruthy();
    expect(result.isFailure()).toBeFalsy();
  });
});
