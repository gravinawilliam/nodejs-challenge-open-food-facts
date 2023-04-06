import { StatusError } from './status-error';

type ParametersConstructorDTO = {
  error?: Error;
  repository: {
    name: RepositoryNames;
    method: ProductsRepositoryMethods | ProductsImportHistoryRepositoryMethods;
    externalName?: string;
  };
};

export enum RepositoryNames {
  PRODUCTS = 'products',
  PRODUCTS_IMPORT_HISTORY = 'products import history'
}

export enum ProductsRepositoryMethods {
  GET_ALL = 'get all',
  SAVE_MANY = 'save many',
  FIND = 'find',
  GET_WITH_PAGINATION = 'get with pagination',
  SOFT_DELETE = 'soft delete',
  UPDATE = 'update'
}

export enum ProductsImportHistoryRepositoryMethods {
  FIND_LAST = 'find last',
  SAVE = 'save'
}

export class RepositoryError {
  readonly status: StatusError;

  readonly message: string;

  readonly name: 'RepositoryError';

  readonly error?: Error;

  constructor(parameters: ParametersConstructorDTO) {
    this.name = 'RepositoryError';
    this.message = `Error in ${parameters.repository.name} repository in ${parameters.repository.method} method.${
      parameters.repository.externalName === undefined
        ? ''
        : ` Error in external lib name: ${parameters.repository.externalName}.`
    }`;
    this.status = StatusError.REPOSITORY_ERROR;
    this.error = parameters.error;
  }
}
