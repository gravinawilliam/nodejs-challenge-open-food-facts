import { PrismaClient } from '@prisma/client';

import { ISendLogErrorLoggerProvider } from '@contracts/providers/logger/send-log-error-logger.provider';
import {
  FindLastProductsImportHistoryRepositoryDTO,
  IFindLastProductsImportHistoryRepository
} from '@contracts/repositories/products-import-history/find-last.products-import-history-repository';
import {
  ISaveProductsImportHistoryRepository,
  SaveProductsImportHistoryRepositoryDTO
} from '@contracts/repositories/products-import-history/save.products-import-history-repository';

import {
  ProductsImportHistoryRepositoryMethods,
  RepositoryError,
  RepositoryNames
} from '@errors/_shared/repository.error';

import { failure, success } from '@shared/utils/either.util';

export class ProductsImportHistoryPrismaRepository
  implements IFindLastProductsImportHistoryRepository, ISaveProductsImportHistoryRepository
{
  constructor(private readonly loggerProvider: ISendLogErrorLoggerProvider, private readonly prisma: PrismaClient) {}

  public async findLast(): FindLastProductsImportHistoryRepositoryDTO.Result {
    try {
      const found = await this.prisma.productsImportHistory.findFirst({
        select: {
          createdAt: true,
          isSuccess: true,
          id: true,
          quantityImportedProducts: true,
          runtimeInMilliseconds: true
        },
        orderBy: { createdAt: 'desc' }
      });
      if (!found) return success({ lastImport: undefined });

      return success({
        lastImport: {
          createdAt: found.createdAt,
          isSuccess: found.isSuccess,
          id: found.id,
          quantityImportedProducts: found.quantityImportedProducts,
          runtimeInMilliseconds: found.runtimeInMilliseconds
        }
      });
    } catch (error: any) {
      const repositoryError = new RepositoryError({
        error,
        repository: {
          name: RepositoryNames.PRODUCTS_IMPORT_HISTORY,
          method: ProductsImportHistoryRepositoryMethods.FIND_LAST,
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

  public async save(
    parameters: SaveProductsImportHistoryRepositoryDTO.Parameters
  ): SaveProductsImportHistoryRepositoryDTO.Result {
    try {
      await this.prisma.productsImportHistory.create({
        data: {
          isSuccess: parameters.isSuccess,
          createdAt: parameters.createdAt,
          quantityImportedProducts: parameters.quantityImportedProducts,
          runtimeInMilliseconds: parameters.runtimeInMilliseconds
        }
      });

      return success(undefined);
    } catch (error: any) {
      const repositoryError = new RepositoryError({
        error,
        repository: {
          name: RepositoryNames.PRODUCTS_IMPORT_HISTORY,
          method: ProductsImportHistoryRepositoryMethods.SAVE,
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
