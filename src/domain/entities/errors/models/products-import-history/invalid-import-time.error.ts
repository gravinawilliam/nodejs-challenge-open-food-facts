import { StatusError } from '@errors/_shared/status-error';

export class InvalidImportTimeError {
  readonly status: StatusError;

  readonly message: string;

  readonly name: 'InvalidImportTimeError';

  constructor() {
    this.message = `Invalid time to run next cron of import new products.`;
    this.name = 'InvalidImportTimeError';
    this.status = StatusError.INVALID;
  }
}
