import { IFindLastProductsImportHistoryRepository } from '@contracts/repositories/products-import-history/find-last.products-import-history-repository';
import { ISaveProductsImportHistoryRepository } from '@contracts/repositories/products-import-history/save.products-import-history-repository';

import { prisma } from '@infrastructure/database/prisma/prisma';
import { ProductsImportHistoryPrismaRepository } from '@infrastructure/database/prisma/repositories/products-import-history.prisma-repository';

import { makeLoggerProvider } from '@factories/providers/logger-provider.factory';

export const makeProductsImportHistoryRepository = (): IFindLastProductsImportHistoryRepository &
  ISaveProductsImportHistoryRepository => new ProductsImportHistoryPrismaRepository(makeLoggerProvider(), prisma);
