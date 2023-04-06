import { MockProxy, mock } from 'jest-mock-extended';

import { ISendLogTimeUseCaseLoggerProvider } from '@contracts/providers/logger/send-log-time-use-case.logger-provider';
import {
  FindProductsRepositoryDTO,
  IFindProductsRepository
} from '@contracts/repositories/products/find.products-repository';

import { ProductsRepositoryMethods, RepositoryError, RepositoryNames } from '@errors/_shared/repository.error';
import { NoExistsProductError } from '@errors/models/product/no-exists-product.error';

import { UseCase } from '@use-cases/_shared/use-case';
import { FindProductUseCase, FindProductUseCaseDTO } from '@use-cases/products/find-product.use-case';

import { failure, success } from '@shared/utils/either.util';
import * as Generate from '@shared/utils/faker.util';

describe('Find product USE CASE', () => {
  let sut: UseCase<
    FindProductUseCaseDTO.Parameters,
    FindProductUseCaseDTO.ResultFailure,
    FindProductUseCaseDTO.ResultSuccess
  >;

  let loggerProvider: MockProxy<ISendLogTimeUseCaseLoggerProvider>;
  let productsRepository: MockProxy<IFindProductsRepository>;

  let correctParametersSut: FindProductUseCaseDTO.Parameters;

  const PRODUCT = Generate.product();

  beforeAll(() => {
    loggerProvider = mock();

    productsRepository = mock();
    productsRepository.find.mockResolvedValue(success({ product: PRODUCT }));
  });

  beforeEach(() => {
    correctParametersSut = {
      code: Generate.productCode()
    };

    sut = new FindProductUseCase(loggerProvider, productsRepository);
  });

  it('should call find products repository with correct parameters', async () => {
    await sut.execute(correctParametersSut);

    expect(productsRepository.find).toHaveBeenCalledWith({
      code: correctParametersSut.code
    } as FindProductsRepositoryDTO.Parameters);
    expect(productsRepository.find).toHaveBeenCalledTimes(1);
  });

  it('should return RepositoryError if find products repository return failure', async () => {
    const error = new RepositoryError({
      repository: {
        method: ProductsRepositoryMethods.FIND,
        name: RepositoryNames.PRODUCTS
      }
    });
    productsRepository.find.mockResolvedValueOnce(failure(error));

    const result = await sut.execute(correctParametersSut);

    expect(productsRepository.find).toHaveBeenCalledTimes(1);
    expect(result.value).toEqual(error);
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
  });

  it('should return NoExistsProductError if find products repository return product is undefined', async () => {
    const error = new NoExistsProductError({ code: correctParametersSut.code });
    productsRepository.find.mockResolvedValueOnce(success({ product: undefined }));

    const result = await sut.execute(correctParametersSut);

    expect(productsRepository.find).toHaveBeenCalledTimes(1);
    expect(result.value).toEqual(error);
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
  });

  it('should success find product', async () => {
    const result = await sut.execute(correctParametersSut);

    expect(result.value).toEqual({
      product: PRODUCT
    } as FindProductUseCaseDTO.ResultSuccess);
    expect(productsRepository.find).toHaveBeenCalledTimes(1);
    expect(result.isSuccess()).toBeTruthy();
    expect(result.isFailure()).toBeFalsy();
  });
});
