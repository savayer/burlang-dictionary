import { BasicError } from './BasicError';

export class HttpError extends BasicError {
  httpStatus: number;

  constructor(status: number, message: string) {
    super(message);
    this.httpStatus = status;
    this.name = 'http_error';
  }
}

export class HttpServerError extends HttpError {
  constructor(status: number, message: string) {
    super(status, message);
    this.name = 'server_error';
  }
}

export class HttpClientError extends HttpError {
  constructor(status: number, message: string) {
    super(status, message);
    this.name = 'client_error';
  }
}
