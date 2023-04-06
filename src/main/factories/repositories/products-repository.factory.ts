import { IFindProductsRepository } from '@contracts/repositories/products/find.products-repository';
import { IGetAllProductsRepository } from '@contracts/repositories/products/get-all.products-repository';
import { IGetWithPaginationProductsRepository } from '@contracts/repositories/products/get-with-pagination.products-repository';
import { ISaveManyProductsRepository } from '@contracts/repositories/products/save-many.products-repository';
import { ISoftDeleteProductsRepository } from '@contracts/repositories/products/soft-delete.products-repository';
import { IUpdateProductsRepository } from '@contracts/repositories/products/update.products-repository';

import { prisma } from '@infrastructure/database/prisma/prisma';
import { ProductsPrismaRepository } from '@infrastructure/database/prisma/repositories/products.prisma-repository';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';

export const makeProductsRepository = (): IGetAllProductsRepository &
  ISaveManyProductsRepository &
  IGetWithPaginationProductsRepository &
  ISoftDeleteProductsRepository &
  IFindProductsRepository &
  IUpdateProductsRepository => new ProductsPrismaRepository(makeLoggerProvider(), prisma);
