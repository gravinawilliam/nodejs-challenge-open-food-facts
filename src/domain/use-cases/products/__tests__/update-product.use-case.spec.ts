import { MockProxy, mock } from 'jest-mock-extended';

import { ISendLogTimeUseCaseLoggerProvider } from '@contracts/providers/logger/send-log-time-use-case.logger-provider';
import {
  FindProductsRepositoryDTO,
  IFindProductsRepository
} from '@contracts/repositories/products/find.products-repository';
import {
  IUpdateProductsRepository,
  UpdateProductsRepositoryDTO
} from '@contracts/repositories/products/update.products-repository';

import { RepositoryError, ProductsRepositoryMethods, RepositoryNames } from '@errors/_shared/repository.error';
import { NoExistsProductError } from '@errors/models/product/no-exists-product.error';

import { UseCase } from '@use-cases/_shared/use-case';
import { UpdateProductUseCase, UpdateProductUseCaseDTO } from '@use-cases/products/update-product.use-case';

import { failure, success } from '@shared/utils/either.util';
import * as Generate from '@shared/utils/faker.util';

describe('Update product USE CASE', () => {
  let sut: UseCase<
    UpdateProductUseCaseDTO.Parameters,
    UpdateProductUseCaseDTO.ResultFailure,
    UpdateProductUseCaseDTO.ResultSuccess
  >;

  let loggerProvider: MockProxy<ISendLogTimeUseCaseLoggerProvider>;
  let productsRepository: MockProxy<IFindProductsRepository & IUpdateProductsRepository>;

  let correctParametersSut: UpdateProductUseCaseDTO.Parameters;

  const PRODUCT = Generate.product();

  beforeAll(() => {
    loggerProvider = mock();

    productsRepository = mock();
    productsRepository.find.mockResolvedValue(success({ product: PRODUCT }));
    productsRepository.update.mockResolvedValue(success(undefined));
  });

  beforeEach(() => {
    correctParametersSut = {
      code: PRODUCT.code,
      product: Generate.product()
    };

    sut = new UpdateProductUseCase(loggerProvider, productsRepository);
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
    expect(productsRepository.update).toHaveBeenCalledTimes(0);
    expect(result.value).toEqual(error);
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
  });

  it('should return NoExistsProductError if find products repository return product is undefined', async () => {
    const error = new NoExistsProductError({ code: correctParametersSut.code });
    productsRepository.find.mockResolvedValueOnce(success({ product: undefined }));

    const result = await sut.execute(correctParametersSut);

    expect(productsRepository.find).toHaveBeenCalledTimes(1);
    expect(productsRepository.update).toHaveBeenCalledTimes(0);
    expect(result.value).toEqual(error);
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
  });

  it('should call update product repository with correct parameters', async () => {
    await sut.execute(correctParametersSut);

    expect(productsRepository.update).toHaveBeenCalledWith({
      code: correctParametersSut.code,
      product: {
        brands: correctParametersSut.product.brands,
        categories: correctParametersSut.product.categories,
        cities: correctParametersSut.product.cities,
        code: correctParametersSut.product.code,
        createdT: correctParametersSut.product.createdT,
        creator: correctParametersSut.product.creator,
        imageUrl: correctParametersSut.product.imageUrl,
        importedT: correctParametersSut.product.importedT,
        ingredientsText: correctParametersSut.product.ingredientsText,
        labels: correctParametersSut.product.labels,
        lastModifiedT: correctParametersSut.product.lastModifiedT,
        mainCategory: correctParametersSut.product.mainCategory,
        nutriscoreGrade: correctParametersSut.product.nutriscoreGrade,
        nutriscoreScore: correctParametersSut.product.nutriscoreScore,
        productName: correctParametersSut.product.productName,
        purchasePlaces: correctParametersSut.product.purchasePlaces,
        quantity: correctParametersSut.product.quantity,
        servingQuantity: correctParametersSut.product.servingQuantity,
        servingSize: correctParametersSut.product.servingSize,
        status: correctParametersSut.product.status,
        stores: correctParametersSut.product.stores,
        traces: correctParametersSut.product.traces,
        url: correctParametersSut.product.url
      }
    } as UpdateProductsRepositoryDTO.Parameters);
    expect(productsRepository.update).toHaveBeenCalledTimes(1);
  });

  it('should return RepositoryError if update products repository return failure', async () => {
    const error = new RepositoryError({
      repository: {
        method: ProductsRepositoryMethods.UPDATE,
        name: RepositoryNames.PRODUCTS
      }
    });
    productsRepository.update.mockResolvedValueOnce(failure(error));

    const result = await sut.execute(correctParametersSut);

    expect(productsRepository.find).toHaveBeenCalledTimes(1);
    expect(productsRepository.update).toHaveBeenCalledTimes(1);
    expect(result.value).toEqual(error);
    expect(result.isFailure()).toBeTruthy();
    expect(result.isSuccess()).toBeFalsy();
  });

  it('should success update product', async () => {
    const result = await sut.execute(correctParametersSut);

    expect(result.value).toEqual({
      message: 'Product updated successfully.'
    } as UpdateProductUseCaseDTO.ResultSuccess);
    expect(productsRepository.find).toHaveBeenCalledTimes(1);
    expect(productsRepository.update).toHaveBeenCalledTimes(1);
    expect(result.isSuccess()).toBeTruthy();
    expect(result.isFailure()).toBeFalsy();
  });
});
