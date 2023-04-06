import { ProductStatus, selectProductStatus } from '@models/product.model';

import { UseCase } from '@use-cases/_shared/use-case';
import { UpdateProductUseCaseDTO } from '@use-cases/products/update-product.use-case';

import { HttpStatusCode, selectStatusCode } from '@main/utils/http-status-code.util';

import { HttpRequest } from '@shared/types/http-request.type';
import { HttpResponse } from '@shared/types/http-response.type';

export class UpdateProductController {
  constructor(
    private readonly updateProductUseCase: UseCase<
      UpdateProductUseCaseDTO.Parameters,
      UpdateProductUseCaseDTO.ResultFailure,
      UpdateProductUseCaseDTO.ResultSuccess
    >
  ) {}

  public async handle(parameters: UpdateProductControllerDTO.Parameters): UpdateProductControllerDTO.Result {
    let productStatus = undefined;
    if (parameters.body.product.status !== undefined) {
      productStatus = selectProductStatus(parameters.body.product.status);
      if (productStatus === ProductStatus.INVALID_STATUS) {
        return {
          statusCode: HttpStatusCode.BAD_REQUEST,
          data: {
            message: 'Invalid product status: ' + parameters.body.product.status
          }
        };
      }
    }

    const result = await this.updateProductUseCase.execute({
      code: parameters.params.code,
      product: {
        status: productStatus,
        brands: parameters.body.product.brands,
        categories: parameters.body.product.categories,
        cities: parameters.body.product.cities,
        code: parameters.body.product.code,
        createdT: parameters.body.product.created_t,
        creator: parameters.body.product.creator,
        imageUrl: parameters.body.product.image_url,
        importedT: parameters.body.product.imported_t,
        ingredientsText: parameters.body.product.ingredients_text,
        labels: parameters.body.product.labels,
        lastModifiedT: parameters.body.product.last_modified_t,
        mainCategory: parameters.body.product.main_category,
        nutriscoreGrade: parameters.body.product.nutriscore_grade,
        nutriscoreScore: parameters.body.product.nutriscore_score,
        productName: parameters.body.product.product_name,
        purchasePlaces: parameters.body.product.purchase_places,
        quantity: parameters.body.product.quantity,
        servingQuantity: parameters.body.product.serving_quantity,
        servingSize: parameters.body.product.serving_size,
        stores: parameters.body.product.stores,
        traces: parameters.body.product.traces,
        url: parameters.body.product.url
      }
    });
    if (result.isFailure()) {
      return {
        data: result.value,
        statusCode: selectStatusCode({ status: result.value.status })
      };
    }
    const { message } = result.value;

    return {
      statusCode: HttpStatusCode.OK,
      data: { message }
    };
  }
}

export namespace UpdateProductControllerDTO {
  export type Parameters = HttpRequest<
    {
      product: {
        status?: string;
        code?: string;
        imported_t?: Date;
        url?: string;
        creator?: string;
        created_t?: string;
        last_modified_t?: string;
        product_name?: string;
        quantity?: string;
        brands?: string;
        categories?: string;
        labels?: string;
        cities?: string;
        purchase_places?: string;
        stores?: string;
        ingredients_text?: string;
        traces?: string;
        serving_size?: string;
        serving_quantity?: string;
        nutriscore_score?: string;
        nutriscore_grade?: string;
        main_category?: string;
        image_url?: string;
      };
    },
    undefined,
    {
      code: string;
    }
  >;

  export type Result = Promise<
    HttpResponse<
      | {
          message: string;
        }
      | UpdateProductUseCaseDTO.ResultFailure
    >
  >;
}
