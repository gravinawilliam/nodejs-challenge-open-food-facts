import { UseCase } from '@use-cases/_shared/use-case';
import { ListProductsUseCaseDTO } from '@use-cases/products/list-products.use-case';

import { HttpStatusCode, selectStatusCode } from '@main/utils/http-status-code.util';

import { HttpRequest } from '@shared/types/http-request.type';
import { HttpResponse } from '@shared/types/http-response.type';

export class ListProductsController {
  constructor(
    private readonly listProductsUseCase: UseCase<
      ListProductsUseCaseDTO.Parameters,
      ListProductsUseCaseDTO.ResultFailure,
      ListProductsUseCaseDTO.ResultSuccess
    >
  ) {}

  public async handle(parameters: ListProductsControllerDTO.Parameters): ListProductsControllerDTO.Result {
    const resultListProducts = await this.listProductsUseCase.execute({
      skip: Number(parameters.query.skip),
      take: Number(parameters.query.take)
    });
    if (resultListProducts.isFailure()) {
      return {
        data: resultListProducts.value,
        statusCode: selectStatusCode({ status: resultListProducts.value.status })
      };
    }
    const { products } = resultListProducts.value;

    return {
      statusCode: HttpStatusCode.OK,
      data: {
        products: products.map(product => ({
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
        }))
      }
    };
  }
}

export namespace ListProductsControllerDTO {
  export type Parameters = HttpRequest<
    undefined,
    {
      take: string;
      skip: string;
    },
    undefined
  >;

  export type Result = Promise<
    HttpResponse<
      | {
          products: {
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
          }[];
        }
      | ListProductsUseCaseDTO.ResultFailure
    >
  >;
}
