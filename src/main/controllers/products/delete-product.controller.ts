import { UseCase } from '@use-cases/_shared/use-case';
import { DeleteProductUseCaseDTO } from '@use-cases/products/delete-product.use-case';

import { HttpStatusCode, selectStatusCode } from '@main/utils/http-status-code.util';

import { HttpRequest } from '@shared/types/http-request.type';
import { HttpResponse } from '@shared/types/http-response.type';

export class DeleteProductController {
  constructor(
    private readonly deleteProductUseCase: UseCase<
      DeleteProductUseCaseDTO.Parameters,
      DeleteProductUseCaseDTO.ResultFailure,
      DeleteProductUseCaseDTO.ResultSuccess
    >
  ) {}

  public async handle(parameters: DeleteProductControllerDTO.Parameters): DeleteProductControllerDTO.Result {
    const result = await this.deleteProductUseCase.execute({
      code: parameters.params.code
    });
    if (result.isFailure()) {
      return {
        data: result.value,
        statusCode: selectStatusCode({ status: result.value.status })
      };
    }
    const { productDeleted } = result.value;

    return {
      statusCode: HttpStatusCode.OK,
      data: {
        productDeleted: {
          id: productDeleted.id,
          code: productDeleted.code,
          status: productDeleted.status
        }
      }
    };
  }
}

export namespace DeleteProductControllerDTO {
  export type Parameters = HttpRequest<
    undefined,
    undefined,
    {
      code: string;
    }
  >;

  export type Result = Promise<
    HttpResponse<
      | {
          productDeleted: {
            id: string;
            status: string;
            code: string;
          };
        }
      | DeleteProductUseCaseDTO.ResultFailure
    >
  >;
}
