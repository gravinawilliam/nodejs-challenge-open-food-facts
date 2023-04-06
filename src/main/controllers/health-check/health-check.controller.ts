import { UseCase } from '@use-cases/_shared/use-case';
import { GetLastProductsImportHistoryUseCaseDTO } from '@use-cases/products-import-history/get-last-products-import-history.use-case';

import { HttpStatusCode } from '@main/utils/http-status-code.util';

import { HttpResponse } from '@shared/types/http-response.type';

export class HealthCheckController {
  constructor(
    private readonly getLastProductsImportHistoryUseCase: UseCase<
      GetLastProductsImportHistoryUseCaseDTO.Parameters,
      GetLastProductsImportHistoryUseCaseDTO.ResultFailure,
      GetLastProductsImportHistoryUseCaseDTO.ResultSuccess
    >
  ) {}

  public async handle(): HealthCheckControllerDTO.Result {
    const resultGetLast = await this.getLastProductsImportHistoryUseCase.execute(undefined);

    const statusDB = resultGetLast.isFailure() && resultGetLast.value.name === 'RepositoryError' ? 'DOWN' : 'UP';

    if (resultGetLast.isFailure()) {
      return {
        data: {
          status_db: statusDB,
          error: resultGetLast.value
        },
        statusCode: HttpStatusCode.BAD_REQUEST
      };
    }

    const { lastImport } = resultGetLast.value;

    return {
      statusCode: HttpStatusCode.OK,
      data: {
        status_db: statusDB,
        last_import:
          lastImport === undefined
            ? undefined
            : {
                created_at: lastImport.createdAt,
                id: lastImport.id,
                is_success: lastImport.isSuccess,
                quantity_imported_products: lastImport.quantityImportedProducts,
                runtime_in_milliseconds: lastImport.runtimeInMilliseconds
              }
      }
    };
  }
}

export namespace HealthCheckControllerDTO {
  export type Result = Promise<
    HttpResponse<{
      status_db: string;
      error?: any;
      last_import?: {
        id: string;
        quantity_imported_products: number;
        created_at: Date;
        is_success: boolean;
        runtime_in_milliseconds: number;
      };
    }>
  >;
}
