import { HttpClientError, HttpServerError } from './errors';

/*
 * @param error - object from axios which we receive in a catch block
 * */
export function catchHttpErrors(error) {
  const statusCode = error?.response?.status;
  const message = `${error?.message}. \n\nConfig: ${JSON.stringify(
    error?.config,
    undefined,
    2,
  )}`;

  if (statusCode >= 500) {
    throw new HttpServerError(statusCode, message);
  } else if (statusCode >= 400 && statusCode < 500) {
    throw new HttpClientError(statusCode, message);
  }

  throw error;
}
