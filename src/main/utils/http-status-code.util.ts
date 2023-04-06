import { StatusError } from '@errors/_shared/status-error';

import { StatusSuccess } from '@main/controllers/_shared/controller';

export enum HttpStatusCode {
  CONTINUE = 100,
  SWITCHING_PROTOCOLS = 101,
  PROCESSING = 102,
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NON_AUTHORITATIVE_INFORMATION = 203,
  NO_CONTENT = 204,
  RESET_CONTENT = 205,
  PARTIAL_CONTENT = 206,
  AMBIGUOUS = 300,
  MOVED_PERMANENTLY = 301,
  FOUND = 302,
  SEE_OTHER = 303,
  NOT_MODIFIED = 304,
  TEMPORARY_REDIRECT = 307,
  PERMANENT_REDIRECT = 308,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  NOT_ACCEPTABLE = 406,
  PROXY_AUTHENTICATION_REQUIRED = 407,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409,
  GONE = 410,
  LENGTH_REQUIRED = 411,
  PRECONDITION_FAILED = 412,
  PAYLOAD_TOO_LARGE = 413,
  URI_TOO_LONG = 414,
  UNSUPPORTED_MEDIA_TYPE = 415,
  REQUESTED_RANGE_NOT_SATISFIABLE = 416,
  EXPECTATION_FAILED = 417,
  I_AM_A_TEAPOT = 418,
  MISDIRECTED = 421,
  UNPROCESSABLE_ENTITY = 422,
  FAILED_DEPENDENCY = 424,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
  HTTP_VERSION_NOT_SUPPORTED = 505
}

export const selectStatusCode = (parameters: { status: StatusError | StatusSuccess }): HttpStatusCode => {
  switch (parameters.status) {
    case StatusError.CONFLICT: {
      return HttpStatusCode.CONFLICT;
    }
    case StatusError.INVALID: {
      return HttpStatusCode.BAD_REQUEST;
    }
    case StatusError.NOT_FOUND: {
      return HttpStatusCode.NOT_FOUND;
    }
    case StatusError.PROVIDER_ERROR: {
      return HttpStatusCode.INTERNAL_SERVER_ERROR;
    }
    case StatusError.REPOSITORY_ERROR: {
      return HttpStatusCode.INTERNAL_SERVER_ERROR;
    }
    case StatusSuccess.CREATED: {
      return HttpStatusCode.CREATED;
    }
    case StatusSuccess.DONE: {
      return HttpStatusCode.OK;
    }
    default: {
      return HttpStatusCode.INTERNAL_SERVER_ERROR;
    }
  }
};
