import { UseCase } from '@use-cases/_shared/use-case';
import { FindProductUseCaseDTO } from '@use-cases/products/find-product.use-case';

import { HttpStatusCode, selectStatusCode } from '@main/utils/http-status-code.util';

import { HttpRequest } from '@shared/types/http-request.type';
import { HttpResponse } from '@shared/types/http-response.type';

export class FindProductController {
  constructor(
    private readonly findProductUseCase: UseCase<
      FindProductUseCaseDTO.Parameters,
      FindProductUseCaseDTO.ResultFailure,
      FindProductUseCaseDTO.ResultSuccess
    >
  ) {}

  public async handle(parameters: FindProductControllerDTO.Parameters): FindProductControllerDTO.Result {
    const result = await this.findProductUseCase.execute({
      code: parameters.params.code
    });
    if (result.isFailure()) {
      return {
        data: result.value,
        statusCode: selectStatusCode({ status: result.value.status })
      };
    }
    const { product } = result.value;

    return {
      statusCode: HttpStatusCode.OK,
      data: {
        product: {
          id: product.id,
          serving_size: product.servingSize,
          brands: product.brands,
          categories: product.categories,
          labels: product.labels,
          cities: product.cities,
          purchase_places: product.purchasePlaces,
          stores: product.stores,
          ingredients_text: product.ingredientsText,
          traces: product.traces,
          serving_quantity: product.servingQuantity,
          nutriscore_score: product.nutriscoreScore,
          nutriscore_grade: product.nutriscoreGrade,
          main_category: product.mainCategory,
          image_url: product.imageUrl,
          status: product.status,
          code: product.code,
          imported_t: product.importedT,
          url: product.url,
          creator: product.creator,
          created_t: product.createdT,
          last_modified_t: product.lastModifiedT,
          product_name: product.productName,
          quantity: product.quantity
        }
      }
    };
  }
}

export namespace FindProductControllerDTO {
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
          product: {
            id: string;
            status: string;
            code: string;
            imported_t: Date;
            url: string;
            creator: string;
            created_t: string;
            last_modified_t: string;
            product_name: string;
            quantity: string;
            brands: string;
            categories: string;
            labels: string;
            cities: string;
            purchase_places: string;
            stores: string;
            ingredients_text: string;
            traces: string;
            serving_size: string;
            serving_quantity: string;
            nutriscore_score: string;
            nutriscore_grade: string;
            main_category: string;
            image_url: string;
          };
        }
      | FindProductUseCaseDTO.ResultFailure
    >
  >;
}
