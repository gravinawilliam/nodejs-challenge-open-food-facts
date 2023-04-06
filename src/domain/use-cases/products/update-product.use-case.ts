import { ISendLogTimeUseCaseLoggerProvider } from '@contracts/providers/logger/send-log-time-use-case.logger-provider';
import { IFindProductsRepository } from '@contracts/repositories/products/find.products-repository';
import { IUpdateProductsRepository } from '@contracts/repositories/products/update.products-repository';

import { RepositoryError } from '@errors/_shared/repository.error';
import { NoExistsProductError } from '@errors/models/product/no-exists-product.error';

import { Product } from '@models/product.model';

import { UseCase } from '@use-cases/_shared/use-case';

import { Either, failure, success } from '@shared/utils/either.util';

export class UpdateProductUseCase extends UseCase<
  UpdateProductUseCaseDTO.Parameters,
  UpdateProductUseCaseDTO.ResultFailure,
  UpdateProductUseCaseDTO.ResultSuccess
> {
  constructor(
    loggerProvider: ISendLogTimeUseCaseLoggerProvider,
    private readonly productsRepository: IFindProductsRepository & IUpdateProductsRepository
  ) {
    super(loggerProvider);
  }

  protected async performOperation(parameters: UpdateProductUseCaseDTO.Parameters): UpdateProductUseCaseDTO.Result {
    const resultFindProduct = await this.productsRepository.find({ code: parameters.code });
    if (resultFindProduct.isFailure()) return failure(resultFindProduct.value);

    const { product } = resultFindProduct.value;
    if (product === undefined) return failure(new NoExistsProductError({ code: parameters.code }));

    const resultUpdateProduct = await this.productsRepository.update({
      code: parameters.code,
      product: this.updateProduct({ product, productToUpdate: parameters.product })
    });
    if (resultUpdateProduct.isFailure()) return failure(resultUpdateProduct.value);

    return success({ message: 'Product updated successfully.' });
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  private updateProduct(parameters: {
    product: Omit<Product, 'id'>;
    productToUpdate: Omit<Partial<Product>, 'id'>;
  }): Omit<Product, 'id'> {
    return {
      brands: parameters.productToUpdate.brands ?? parameters.product.brands,
      categories: parameters.productToUpdate.categories ?? parameters.product.categories,
      cities: parameters.productToUpdate.cities ?? parameters.product.cities,
      code: parameters.productToUpdate.code ?? parameters.product.code,
      createdT: parameters.productToUpdate.createdT ?? parameters.product.createdT,
      creator: parameters.productToUpdate.creator ?? parameters.product.creator,
      imageUrl: parameters.productToUpdate.imageUrl ?? parameters.product.imageUrl,
      importedT: parameters.productToUpdate.importedT ?? parameters.product.importedT,
      ingredientsText: parameters.productToUpdate.ingredientsText ?? parameters.product.ingredientsText,
      labels: parameters.productToUpdate.labels ?? parameters.product.labels,
      lastModifiedT: parameters.productToUpdate.lastModifiedT ?? parameters.product.lastModifiedT,
      mainCategory: parameters.productToUpdate.mainCategory ?? parameters.product.mainCategory,
      nutriscoreGrade: parameters.productToUpdate.nutriscoreGrade ?? parameters.product.nutriscoreGrade,
      nutriscoreScore: parameters.productToUpdate.nutriscoreScore ?? parameters.product.nutriscoreScore,
      productName: parameters.productToUpdate.productName ?? parameters.product.productName,
      purchasePlaces: parameters.productToUpdate.purchasePlaces ?? parameters.product.purchasePlaces,
      quantity: parameters.productToUpdate.quantity ?? parameters.product.quantity,
      servingQuantity: parameters.productToUpdate.servingQuantity ?? parameters.product.servingQuantity,
      servingSize: parameters.productToUpdate.servingSize ?? parameters.product.servingSize,
      status: parameters.productToUpdate.status ?? parameters.product.status,
      stores: parameters.productToUpdate.stores ?? parameters.product.stores,
      traces: parameters.productToUpdate.traces ?? parameters.product.traces,
      url: parameters.productToUpdate.url ?? parameters.product.url
    };
  }
}

export namespace UpdateProductUseCaseDTO {
  export type Parameters = Readonly<{ code: string; product: Partial<Product> }>;

  export type ResultFailure = Readonly<RepositoryError | NoExistsProductError>;
  export type ResultSuccess = Readonly<{ message: string }>;

  export type Result = Promise<Either<ResultFailure, ResultSuccess>>;
}
