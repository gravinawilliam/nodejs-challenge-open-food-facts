/* eslint-disable security/detect-non-literal-fs-filename */
import ndjson from 'ndjson';
import fs from 'node:fs';
import { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { createUnzip } from 'node:zlib';
import Downloader from 'nodejs-file-downloader';
import readline from 'readline';

import { ISendLogErrorLoggerProvider } from '@contracts/providers/logger/send-log-error-logger.provider';
import { ISendLogInfoLoggerProvider } from '@contracts/providers/logger/send-log-info-logger.provider';
import {
  GetNewProductsOpenFoodFactsProviderDTO,
  IGetNewProductsOpenFoodFactsProvider
} from '@contracts/providers/open-food-facts/get-new-products.open-food-facts-provider';

import { OpenFoodFactsProviderMethods, ProviderError, ProviderNames } from '@errors/_shared/provider.error';

import { Product, ProductStatus } from '@models/product.model';

import { Either, failure, success } from '@shared/utils/either.util';

export class OpenFoodFactsApiProvider implements IGetNewProductsOpenFoodFactsProvider {
  constructor(private readonly loggerProvider: ISendLogErrorLoggerProvider & ISendLogInfoLoggerProvider) {}

  public async getNewProducts(
    parameters: GetNewProductsOpenFoodFactsProviderDTO.Parameters
  ): GetNewProductsOpenFoodFactsProviderDTO.Result {
    try {
      const resultDownloadTxt = await this.downloadFile({
        fileName: 'file-list-products.txt',
        url: `https://challenges.coode.sh/food/data/json/index.txt`
      });
      if (resultDownloadTxt.isFailure()) {
        this.deleteFiles({});
        return failure(resultDownloadTxt.value);
      }

      const resultReadFile = await this.readTxtFile({ filePath: './tmp/file-list-products.txt' });
      if (resultReadFile.isFailure()) {
        this.deleteFiles({});
        return failure(resultReadFile.value);
      }
      const { lines: fileNamesDotGz } = resultReadFile.value;

      const promiseDownloadProductFiles = fileNamesDotGz.map(async fileName => {
        return this.downloadFile({
          fileName: fileName,
          url: `https://challenges.coode.sh/food/data/json/${fileName}`
        });
      });
      const resultPromiseDowloadProductFiles = await Promise.all(promiseDownloadProductFiles);
      for (const result of resultPromiseDowloadProductFiles) {
        if (result.isFailure()) {
          this.deleteFiles({ fileNamesDotGz });
          return failure(result.value);
        }
      }

      const promiseDecompressProductFiles = fileNamesDotGz.map(async fileName => {
        return this.decompressFile({ fileName });
      });
      const resultPromiseDecompressProductFiles = await Promise.all(promiseDecompressProductFiles);
      for (const result of resultPromiseDecompressProductFiles) {
        if (result.isFailure()) {
          this.deleteFiles({ fileNamesDotGz });
          return failure(result.value);
        }
      }

      const promiseParseJsonFiles = fileNamesDotGz.map(async fileName => {
        return this.parseJsonFile({
          existingProducts: parameters.existingProducts,
          quantityProductsToImport: parameters.quantityProductsToGetPerFile,
          filePath: `./tmp/${fileName.replace('.gz', '')}`
        });
      });
      const resultPromiseParseJsonFiles = await Promise.all(promiseParseJsonFiles);
      for (const result of resultPromiseParseJsonFiles) {
        if (result.isFailure()) {
          this.deleteFiles({ fileNamesDotGz });
          return failure(result.value);
        }
      }

      let products: Omit<Product, 'id'>[] = [];
      for (const result of resultPromiseParseJsonFiles) {
        if (result.isSuccess()) products = [...products, ...result.value.importedProducts];
      }

      this.deleteFiles({ fileNamesDotGz });

      return success({ newProducts: products });
    } catch (error) {
      console.error(error);
      return failure(
        new ProviderError({
          provider: {
            method: OpenFoodFactsProviderMethods.GET_NEW_PRODUCTS,
            name: ProviderNames.OPEN_FOOD_FACTS,
            externalName: ''
          }
        })
      );
    }
  }

  private deleteFiles(parameters: { fileNamesDotGz?: string[] }) {
    fs.unlinkSync('./tmp/file-list-products.txt');
    if (parameters.fileNamesDotGz !== undefined) {
      for (const fileName of parameters.fileNamesDotGz) {
        fs.unlinkSync('./tmp/' + fileName);
        fs.unlinkSync('./tmp/' + fileName.replace('.gz', ''));
      }
    }
  }

  private async parseJsonFile(parameters: {
    existingProducts: Pick<Product, 'code'>[];
    quantityProductsToImport: number;
    filePath: string;
  }): Promise<Either<ProviderError, { importedProducts: Omit<Product, 'id'>[] }>> {
    return new Promise((resolve, reject) => {
      try {
        const importedProducts: Omit<Product, 'id'>[] = [];
        const stream = fs.createReadStream(parameters.filePath);
        stream.pipe(ndjson.parse()).on('data', chunk => {
          if (importedProducts.length < parameters.quantityProductsToImport) {
            const product = this.validateFieldsJson({ fields: chunk });
            const productExists = parameters.existingProducts.some(item => item.code === product.code);
            if (productExists === false) importedProducts.push(product);
          }

          if (importedProducts.length === parameters.quantityProductsToImport) {
            stream.destroy();
            resolve(success({ importedProducts }));
          }
        });
      } catch (error: any) {
        const providerError = new ProviderError({
          error,
          provider: {
            method: OpenFoodFactsProviderMethods.PARSE_JSON_FILE,
            name: ProviderNames.OPEN_FOOD_FACTS,
            externalName: 'ndjson'
          }
        });
        this.loggerProvider.sendLogError({
          message: providerError.message,
          value: providerError
        });
        reject(failure(providerError));
      }
    });
  }

  private validateFieldsJson(parameters: { fields: any }): Omit<Product, 'id'> {
    return {
      importedT: new Date(),
      status: ProductStatus.DRAFT,
      code: parameters.fields.code,
      url: parameters.fields.url,
      creator: parameters.fields.creator,
      createdT: parameters.fields.created_t,
      lastModifiedT: parameters.fields.last_modified_t,
      productName: parameters.fields.product_name,
      quantity: parameters.fields.quantity,
      brands: parameters.fields.brands,
      categories: parameters.fields.categories,
      labels: parameters.fields.labels,
      cities: parameters.fields.cities,
      purchasePlaces: parameters.fields.purchase_places,
      stores: parameters.fields.stores,
      ingredientsText: parameters.fields.ingredients_text,
      traces: parameters.fields.traces,
      servingSize: parameters.fields.serving_size,
      servingQuantity: parameters.fields.serving_quantity,
      nutriscoreScore: parameters.fields.nutriscore_score,
      nutriscoreGrade: parameters.fields.nutriscore_grade,
      mainCategory: parameters.fields.main_category,
      imageUrl: parameters.fields.image_url
    };
  }

  private async downloadFile(parameters: { fileName: string; url: string }): Promise<Either<ProviderError, undefined>> {
    try {
      const downloader = new Downloader({
        url: parameters.url,
        directory: './tmp/',
        fileName: parameters.fileName
      });
      await downloader.download();

      return success(undefined);
    } catch (error: any) {
      const providerError = new ProviderError({
        error,
        provider: {
          method: OpenFoodFactsProviderMethods.DOWNLOAD_FILE,
          name: ProviderNames.OPEN_FOOD_FACTS,
          externalName: 'nodejs-file-downloader'
        }
      });
      this.loggerProvider.sendLogError({
        message: providerError.message,
        value: providerError
      });
      return failure(providerError);
    }
  }

  private async readTxtFile(parameters: { filePath: string }): Promise<Either<ProviderError, { lines: string[] }>> {
    try {
      const fileStream = fs.createReadStream(parameters.filePath);
      const file = readline.createInterface({
        input: fileStream,
        crlfDelay: Number.POSITIVE_INFINITY
      });
      const lines: string[] = [];
      for await (const line of file) lines.push(line);
      return success({ lines });
    } catch (error: any) {
      const providerError = new ProviderError({
        error,
        provider: {
          method: OpenFoodFactsProviderMethods.READ_TXT_FILE,
          name: ProviderNames.OPEN_FOOD_FACTS,
          externalName: 'readline'
        }
      });
      this.loggerProvider.sendLogError({
        message: providerError.message,
        value: providerError
      });
      return failure(providerError);
    }
  }

  private async decompressFile(parameters: { fileName: string }): Promise<Either<ProviderError, undefined>> {
    try {
      const unzip = createUnzip();
      const input = fs.createReadStream(`./tmp/${parameters.fileName}`);
      const output = fs.createWriteStream(`./tmp/${parameters.fileName.replace('.gz', '')}`);
      await pipeline(input, unzip as Transform, output);

      return success(undefined);
    } catch (error: any) {
      const providerError = new ProviderError({
        error,
        provider: {
          method: OpenFoodFactsProviderMethods.DECOMPRESS_FILE,
          name: ProviderNames.OPEN_FOOD_FACTS,
          externalName: 'node:zlib'
        }
      });
      this.loggerProvider.sendLogError({
        message: providerError.message,
        value: providerError
      });
      return failure(providerError);
    }
  }
}
