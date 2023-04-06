import { performance } from 'node:perf_hooks';

import { ISendLogTimeUseCaseLoggerProvider } from '@contracts/providers/logger/send-log-time-use-case.logger-provider';

import { Either } from '@shared/utils/either.util';

export abstract class UseCase<Parameters, ResultFailure, ResultSuccess> {
  constructor(private readonly loggerProvider: ISendLogTimeUseCaseLoggerProvider) {}

  public async execute(parameters: Parameters): Promise<Either<ResultFailure, ResultSuccess>> {
    const startTime = performance.now();
    const response = await this.performOperation(parameters);
    const runtimeInMs = performance.now() - startTime;
    this.loggerProvider.sendLogTimeUseCase({
      message: `${this.constructor.name} took +${runtimeInMs} ms to execute!`,
      parameters: `${parameters}`,
      runtimeInMs,
      useCaseName: this.constructor.name,
      isSuccess: response.isSuccess()
    });
    return response;
  }

  protected abstract performOperation(parameters: Parameters): Promise<Either<ResultFailure, ResultSuccess>>;
}
