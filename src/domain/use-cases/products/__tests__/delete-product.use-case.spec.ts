import { MockProxy, mock } from 'jest-mock-extended';

import { ISendLogTimeUseCaseLoggerProvider } from '@contracts/providers/logger/send-log-time-use-case.logger-provider';
import {
  FindProductsRepositoryDTO,
  IFindProductsRepository
} from '@contracts/repositories/products/find.products-repository';
import {
  ISoftDeleteProductsRepository,
  SoftDeleteProductsRepositoryDTO
} from '@contracts/repositories/products/soft-delete.products-repository';

import { RepositoryError, ProductsRepositoryMethods, RepositoryNames } from '@errors/_shared/repository.error';
import { NoExistsProductError } from '@errors/models/product/no-exists-product.error';

import { ProductStatus } from '@models/product.model';

import { UseCase } from '@use-cases/_shared/use-case';
import { DeleteProductUseCase, DeleteProductUseCaseDTO } from '@use-cases/products/delete-product.use-case';

import { failure, success } from '@shared/utils/either.util';
import * as Generate from '@shared/utils/faker.util';

describe('Delete product USE CASE', () => {
  let sut: UseCase<
    DeleteProductUseCaseDTO.Parameters,
    DeleteProductUseCaseDTO.ResultFailure,
    DeleteProductUseCaseDTO.ResultSuccess
  >;

  let loggerProvider: MockProxy<ISendLogTimeUseCaseLoggerProvider>;
  let productsRepository: MockProxy<IFindProductsRepository & ISoftDeleteProductsRepository>;

  let correctParametersSut: DeleteProductUseCaseDTO.Parameters;

  const PRODUCT = Generate.product();

  beforeAll(() => {
    loggerProvider = mock();

    productsRepository = mock();
    productsRepository.find.mockResolvedValue(success({ product: PRODUCT }));
    productsRepository.softDelete.mockResolvedValue(
      success({ productSoftDeleted: { code: PRODUCT.code, id: PRODUCT.id, status: ProductStatus.TRASH } })
    );
  });

  beforeEach(() => {
    correctParametersSut = {
      code: PRODUCT.code
    };

    sut = new DeleteProductUseCase(loggerProvider, productsRepository);
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
    expect(productsRepository.softDelete).toHaveBeenCalledTimes(0);
    expect(result.value).toEqual(error);
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
  });

  it('should return NoExistsProductError if find products repository return product is undefined', async () => {
    const error = new NoExistsProductError({ code: correctParametersSut.code });
    productsRepository.find.mockResolvedValueOnce(success({ product: undefined }));

    const result = await sut.execute(correctParametersSut);

    expect(productsRepository.find).toHaveBeenCalledTimes(1);
    expect(productsRepository.softDelete).toHaveBeenCalledTimes(0);
    expect(result.value).toEqual(error);
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
  });

  it('should call soft delete product repository with correct parameters', async () => {
    await sut.execute(correctParametersSut);

    expect(productsRepository.softDelete).toHaveBeenCalledWith({
      code: correctParametersSut.code,
      status: ProductStatus.TRASH
    } as SoftDeleteProductsRepositoryDTO.Parameters);
    expect(productsRepository.softDelete).toHaveBeenCalledTimes(1);
  });

  it('should return RepositoryError if soft delete products repository return failure', async () => {
    const error = new RepositoryError({
      repository: {
        method: ProductsRepositoryMethods.SOFT_DELETE,
        name: RepositoryNames.PRODUCTS
      }
    });
    productsRepository.softDelete.mockResolvedValueOnce(failure(error));

    const result = await sut.execute(correctParametersSut);

    expect(productsRepository.find).toHaveBeenCalledTimes(1);
    expect(productsRepository.softDelete).toHaveBeenCalledTimes(1);
    expect(result.value).toEqual(error);
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
  });

  it('should success delete product', async () => {
    const result = await sut.execute(correctParametersSut);

    expect(result.value).toEqual({
      productDeleted: {
        code: PRODUCT.code,
        id: PRODUCT.id,
        status: ProductStatus.TRASH
      }
    } as DeleteProductUseCaseDTO.ResultSuccess);
    expect(productsRepository.find).toHaveBeenCalledTimes(1);
    expect(productsRepository.softDelete).toHaveBeenCalledTimes(1);
    expect(result.isSuccess()).toBeTruthy();
    expect(result.isFailure()).toBeFalsy();
  });
});
