import { StatusError } from '@errors/_shared/status-error';

type ParametersConstructorDTO = {
  code: string;
};

export class NoExistsProductError {
  readonly status: StatusError;

  readonly message: string;

  readonly name: 'NoExistsProductError';

  constructor(parameters: ParametersConstructorDTO) {
    this.message = `Product with code ${parameters.code} not exists.`;
    this.name = 'NoExistsProductError';
    this.status = StatusError.NOT_FOUND;
  }
}
