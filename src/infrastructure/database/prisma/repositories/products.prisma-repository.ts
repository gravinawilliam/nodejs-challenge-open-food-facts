import { PrismaClient } from '@prisma/client';

import { ISendLogErrorLoggerProvider } from '@contracts/providers/logger/send-log-error-logger.provider';
import {
  FindProductsRepositoryDTO,
  IFindProductsRepository
} from '@contracts/repositories/products/find.products-repository';
import {
  GetAllProductsRepositoryDTO,
  IGetAllProductsRepository
} from '@contracts/repositories/products/get-all.products-repository';
import {
  GetWithPaginationProductsRepositoryDTO,
  IGetWithPaginationProductsRepository
} from '@contracts/repositories/products/get-with-pagination.products-repository';
import {
  ISaveManyProductsRepository,
  SaveManyProductsRepositoryDTO
} from '@contracts/repositories/products/save-many.products-repository';
import {
  ISoftDeleteProductsRepository,
  SoftDeleteProductsRepositoryDTO
} from '@contracts/repositories/products/soft-delete.products-repository';
import {
  IUpdateProductsRepository,
  UpdateProductsRepositoryDTO
} from '@contracts/repositories/products/update.products-repository';

import { ProductsRepositoryMethods, RepositoryError, RepositoryNames } from '@errors/_shared/repository.error';

import { Product, ProductStatus, selectProductStatus } from '@models/product.model';

import { failure, success } from '@shared/utils/either.util';

export class ProductsPrismaRepository
  implements
    IFindProductsRepository,
    IGetAllProductsRepository,
    ISaveManyProductsRepository,
    IGetWithPaginationProductsRepository,
    ISoftDeleteProductsRepository,
    IUpdateProductsRepository
{
  constructor(private readonly loggerProvider: ISendLogErrorLoggerProvider, private readonly prisma: PrismaClient) {}

  public async update(parameters: UpdateProductsRepositoryDTO.Parameters): UpdateProductsRepositoryDTO.Result {
    try {
      await this.prisma.products.update({
        data: {
          brands: parameters.product.brands,
          categories: parameters.product.categories,
          cities: parameters.product.cities,
          code: parameters.product.code,
          creator: parameters.product.creator,
          imageUrl: parameters.product.imageUrl,
          importedT: parameters.product.importedT,
          ingredientsText: parameters.product.ingredientsText,
          labels: parameters.product.labels,
          lastModifiedT: parameters.product.lastModifiedT,
          createdAt: parameters.product.createdT ? new Date(parameters.product.createdT) : undefined,
          mainCategory: parameters.product.mainCategory,
          name: parameters.product.productName,
          quantity: parameters.product.quantity,
          status: parameters.product.status,
          nutriscoreGrade: parameters.product.nutriscoreGrade,
          nutriscoreScore: parameters.product.nutriscoreScore,
          purchasePlaces: parameters.product.purchasePlaces,
          servingQuantity: parameters.product.servingQuantity,
          servingSize: parameters.product.servingSize,
          stores: parameters.product.stores,
          traces: parameters.product.traces,
          url: parameters.product.url
        },
        where: { code: parameters.code }
      });

      return success(undefined);
    } catch (error: any) {
      const repositoryError = new RepositoryError({
        error,
        repository: {
          name: RepositoryNames.PRODUCTS,
          method: ProductsRepositoryMethods.UPDATE,
          externalName: 'prisma'
        }
      });
      this.loggerProvider.sendLogError({
        message: repositoryError.message,
        value: error
      });

      return failure(repositoryError);
    }
  }

  public async softDelete(
    parameters: SoftDeleteProductsRepositoryDTO.Parameters
  ): SoftDeleteProductsRepositoryDTO.Result {
    try {
      const softDeleted = await this.prisma.products.update({
        data: {
          status: parameters.status,
          deletedAt: new Date()
        },
        where: { code: parameters.code }
      });

      return success({
        productSoftDeleted: {
          code: softDeleted.code,
          id: softDeleted.id,
          status: selectProductStatus(softDeleted.status)
        }
      });
    } catch (error: any) {
      const repositoryError = new RepositoryError({
        error,
        repository: {
          name: RepositoryNames.PRODUCTS,
          method: ProductsRepositoryMethods.SOFT_DELETE,
          externalName: 'prisma'
        }
      });
      this.loggerProvider.sendLogError({
        message: repositoryError.message,
        value: error
      });

      return failure(repositoryError);
    }
  }

  public async find(parameters: FindProductsRepositoryDTO.Parameters): FindProductsRepositoryDTO.Result {
    try {
      const found = await this.prisma.products.findFirst({
        where: { code: parameters.code }
      });

      if (found === null) return success({ product: undefined });

      const productStatus = selectProductStatus(found.status);
      if (
        found.deletedAt !== null ||
        productStatus === ProductStatus.TRASH ||
        productStatus === ProductStatus.INVALID_STATUS
      ) {
        return success({ product: undefined });
      }

      return success({
        product: {
          brands: found.brands,
          categories: found.categories,
          cities: found.cities,
          code: found.code,
          creator: found.creator,
          createdT: found.createdAt.toString(),
          id: found.id,
          imageUrl: found.imageUrl,
          importedT: found.importedT,
          ingredientsText: found.ingredientsText,
          labels: found.labels,
          lastModifiedT: found.lastModifiedT,
          lastModifier: found.lastModifiedT,
          mainCategory: found.mainCategory,
          nutriscoreGrade: found.nutriscoreGrade,
          nutriscoreScore: found.nutriscoreScore,
          productName: found.name,
          purchasePlaces: found.purchasePlaces,
          quantity: found.quantity,
          servingSize: found.servingSize,
          servingQuantity: found.servingQuantity,
          url: found.url,
          stores: found.stores,
          traces: found.traces,
          status: selectProductStatus(found.status)
        }
      });
    } catch (error: any) {
      const repositoryError = new RepositoryError({
        error,
        repository: {
          name: RepositoryNames.PRODUCTS,
          method: ProductsRepositoryMethods.FIND,
          externalName: 'prisma'
        }
      });
      this.loggerProvider.sendLogError({
        message: repositoryError.message,
        value: error
      });

      return failure(repositoryError);
    }
  }

  public async getWithPagination(
    parameters: GetWithPaginationProductsRepositoryDTO.Parameters
  ): GetWithPaginationProductsRepositoryDTO.Result {
    try {
      const found = await this.prisma.products.findMany({
        skip: parameters.skip,
        take: parameters.take
      });

      const products: Product[] = found.map(product => ({
        brands: product.brands,
        categories: product.categories,
        cities: product.cities,
        code: product.code,
        creator: product.creator,
        createdT: product.createdAt.toString(),
        id: product.id,
        imageUrl: product.imageUrl,
        importedT: product.importedT,
        ingredientsText: product.ingredientsText,
        labels: product.labels,
        lastModifiedT: product.lastModifiedT,
        lastModifier: product.lastModifiedT,
        mainCategory: product.mainCategory,
        nutriscoreGrade: product.nutriscoreGrade,
        nutriscoreScore: product.nutriscoreScore,
        productName: product.name,
        purchasePlaces: product.purchasePlaces,
        quantity: product.quantity,
        servingSize: product.servingSize,
        servingQuantity: product.servingQuantity,
        url: product.url,
        stores: product.stores,
        traces: product.traces,
        status: selectProductStatus(product.status)
      }));

      return success({
        products: products.filter(
          product => product.status !== ProductStatus.TRASH && product.status !== ProductStatus.INVALID_STATUS
        )
      });
    } catch (error: any) {
      const repositoryError = new RepositoryError({
        error,
        repository: {
          name: RepositoryNames.PRODUCTS,
          method: ProductsRepositoryMethods.GET_WITH_PAGINATION,
          externalName: 'prisma'
        }
      });
      this.loggerProvider.sendLogError({
        message: repositoryError.message,
        value: error
      });

      return failure(repositoryError);
    }
  }

  public async getAll(): GetAllProductsRepositoryDTO.Result {
    try {
      const found = await this.prisma.products.findMany({
        select: { code: true }
      });

      return success({ products: found });
    } catch (error: any) {
      const repositoryError = new RepositoryError({
        error,
        repository: {
          name: RepositoryNames.PRODUCTS,
          method: ProductsRepositoryMethods.GET_ALL,
          externalName: 'prisma'
        }
      });
      this.loggerProvider.sendLogError({
        message: repositoryError.message,
        value: error
      });

      return failure(repositoryError);
    }
  }

  public async saveMany(parameters: SaveManyProductsRepositoryDTO.Parameters): SaveManyProductsRepositoryDTO.Result {
    try {
      await this.prisma.products.createMany({
        data: parameters.products.map(product => ({
          brands: product.brands,
          categories: product.categories,
          code: product.code.replace('"', ''),
          cities: product.cities,
          creator: product.creator,
          imageUrl: product.imageUrl,
          importedT: product.importedT,
          ingredientsText: product.ingredientsText,
          labels: product.labels,
          mainCategory: product.mainCategory,
          name: product.productName,
          nutriscoreGrade: product.nutriscoreGrade,
          nutriscoreScore: product.nutriscoreScore,
          purchasePlaces: product.purchasePlaces,
          quantity: product.quantity,
          stores: product.stores,
          traces: product.traces,
          url: product.url,
          servingQuantity: product.servingQuantity,
          servingSize: product.servingSize,
          status: product.status,
          lastModifiedT: product.lastModifiedT
        }))
      });

      return success(undefined);
    } catch (error: any) {
      const repositoryError = new RepositoryError({
        error,
        repository: {
          name: RepositoryNames.PRODUCTS,
          method: ProductsRepositoryMethods.SAVE_MANY,
          externalName: 'prisma'
        }
      });
      this.loggerProvider.sendLogError({
        message: repositoryError.message,
        value: error
      });

      return failure(repositoryError);
    }
  }
}
