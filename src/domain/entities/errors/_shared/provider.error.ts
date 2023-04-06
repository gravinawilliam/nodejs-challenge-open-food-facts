import { StatusError } from './status-error';

type ParametersConstructorDTO = {
  error?: Error;
  provider: {
    name: ProviderNames;
    method: OpenFoodFactsProviderMethods;
    externalName?: string;
  };
};

export enum ProviderNames {
  OPEN_FOOD_FACTS = 'open food facts'
}

export enum OpenFoodFactsProviderMethods {
  GET_NEW_PRODUCTS = 'get products',
  DOWNLOAD_FILE = 'download file',
  READ_TXT_FILE = 'read txt file',
  DECOMPRESS_FILE = 'decompress file',
  PARSE_JSON_FILE = 'parse json file'
}

export class ProviderError {
  readonly status: StatusError;

  readonly message: string;

  readonly name: 'ProviderError';

  readonly error?: Error;

  constructor(parameters: ParametersConstructorDTO) {
    this.name = 'ProviderError';
    this.message = `Error in ${parameters.provider.name} provider in ${parameters.provider.method} method.${
      parameters.provider.externalName === undefined
        ? ''
        : ` Error in external lib name: ${parameters.provider.externalName}.`
    }`;
    this.status = StatusError.PROVIDER_ERROR;
    this.error = parameters.error;
  }
}
