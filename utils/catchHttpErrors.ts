import { AxiosError } from 'axios';
import { HttpClientError, HttpServerError } from './errors';

export function catchHttpErrors(error: AxiosError | unknown): never {
  const axiosError = error as AxiosError;
  const statusCode = axiosError?.response?.status;
  const message = `${axiosError?.message}. \n\nConfig: ${JSON.stringify(
    axiosError?.config,
    undefined,
    2,
  )}`;

  if (statusCode && statusCode >= 500) {
    throw new HttpServerError(statusCode, message);
  } else if (statusCode && statusCode >= 400 && statusCode < 500) {
    throw new HttpClientError(statusCode, message);
  }

  throw error;
}
