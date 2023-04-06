import { Request, Response } from 'express';
import { AnyZodObject } from 'zod';

import { HttpStatusCode } from '@main/utils/http-status-code.util';

import { HttpRequest } from '@shared/types/http-request.type';
import { HttpResponse } from '@shared/types/http-response.type';

export interface IController {
  handle(httpRequest: HttpRequest<any, any, any>): Promise<HttpResponse>;
}

export const adapterRoute = (parameters: { controller: IController; validation?: AnyZodObject }) => {
  return async (request: Request, response: Response) => {
    if (parameters.validation !== undefined) {
      try {
        await parameters.validation.parseAsync({
          body: request.body,
          query: request.query,
          params: request.params
        });
      } catch (error) {
        response.status(HttpStatusCode.BAD_REQUEST).json(error);
      }
    }

    const httpRequest: HttpRequest<any, any, any> = {
      body: request.body,
      access_token: request.headers.authorization ?? '',
      params: request.params,
      query: request.query
    };

    const { data, statusCode } = await parameters.controller.handle(httpRequest);
    if (statusCode >= HttpStatusCode.OK && statusCode <= 399) {
      response.status(statusCode).json(data);
    } else {
      response.status(statusCode).json({ error: data });
    }
  };
};
