import { BasicError } from './BasicError.js';

export class HttpError extends BasicError {
  constructor(status, message) {
    super(message);
    this.httpStatus = status;
    this.name = 'http_error';
  }
}

export class HttpServerError extends HttpError {
  constructor(status, message) {
    super(status, message);
    this.name = 'server_error';
  }
}

export class HttpClientError extends HttpError {
  constructor(status, message) {
    super(status, message);
    this.name = 'client_error';
  }
}
