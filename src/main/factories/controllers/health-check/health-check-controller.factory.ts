import { makeGetLastProductsImportHistoryUseCase } from '@factories/use-cases/products-import-history/get-last-products-import-history-use-case.factory';

import { HealthCheckController } from '@main/controllers/health-check/health-check.controller';

export const makeHealthCheckController = () => new HealthCheckController(makeGetLastProductsImportHistoryUseCase());
