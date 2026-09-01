import { ApiError } from '../../core/models/api-error.model';

export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) return error.message;
  return 'Ocurrió un error inesperado. Inténtalo nuevamente.';
}

function isApiError(error: unknown): error is ApiError {
  return typeof error === 'object' && error !== null && 'message' in error && 'status' in error;
}
