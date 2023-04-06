import { RequestHandler } from 'express';
import emoji from 'node-emoji';

import { GLOBAL_CONFIG } from '@infrastructure/configs/infrastructure.config';

import { HttpStatusCode } from '@main/utils/http-status-code.util';

type Adapter = () => RequestHandler;

export const notFoundRouteMiddleware: Adapter = () => async (request, response, _next) => {
  if (!response.headersSent) {
    const error = {
      code: 'not_found',
      message: `${emoji.get('cry')} Can't find ${request.method.toUpperCase()} ${request.originalUrl} on this server.`,
      status: HttpStatusCode.NOT_FOUND,
      appVersion: GLOBAL_CONFIG.APP_VERSION
    };
    response.status(error.status).send(error);
  }
  response.end();
};
