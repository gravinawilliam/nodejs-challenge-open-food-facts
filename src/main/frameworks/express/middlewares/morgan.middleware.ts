import { RequestHandler } from 'express';
import morgan, { StreamOptions } from 'morgan';

import { GLOBAL_CONFIG } from '@external/configs/infrastructure.config';

import { makeLoggerProvider } from '@main/factories/providers/logger-provider.factory';

const stream: StreamOptions = {
  write: message =>
    makeLoggerProvider().sendLogHttp({ message: message.slice(0, Math.max(0, message.lastIndexOf('\n'))) })
};
const skip = () => GLOBAL_CONFIG.IS_PRODUCTION;

type Adapter = () => RequestHandler;

export const morganMiddleware: Adapter = () => async (request, response, next) => {
  morgan(':method :url :status :res[content-length] - :response-time ms', {
    stream,
    skip
  })(request, response, next);
};
