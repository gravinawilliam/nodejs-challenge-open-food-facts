import { StatusError } from '@errors/_shared/status-error';

type ParametersConstructorDTO = {
  skip?: number;
  take?: number;
};

export class InvalidPaginationParametersError {
  readonly status: StatusError;

  readonly message: string;

  readonly name: 'InvalidPaginationParametersError';

  constructor(parameters: ParametersConstructorDTO) {
    this.message = `Invalid pagination parameters:${parameters.skip === undefined ? '' : ' skip = ' + parameters.skip} ${
      parameters.take === undefined ? '' : 'take = ' + parameters.take
    }`;
    this.name = 'InvalidPaginationParametersError';
    this.status = StatusError.INVALID;
  }
}
