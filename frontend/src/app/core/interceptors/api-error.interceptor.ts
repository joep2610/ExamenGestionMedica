import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ApiError, ProblemDetails } from '../models/api-error.model';

export const apiErrorInterceptor: HttpInterceptorFn = (request, next) =>
  next(request).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse)) {
        return throwError((): ApiError => ({ status: 0, message: 'Ocurrió un error inesperado.' }));
      }

      const problem = isProblemDetails(error.error) ? error.error : undefined;
      const detail = problem?.detail ?? firstValidationError(problem) ?? undefined;
      return throwError((): ApiError => ({
        status: error.status,
        detail,
        message: friendlyMessage(error.status, detail),
      }));
    }),
  );

function isProblemDetails(value: unknown): value is ProblemDetails {
  return typeof value === 'object' && value !== null;
}

function firstValidationError(problem?: ProblemDetails): string | undefined {
  if (!problem?.errors) return undefined;
  return Object.values(problem.errors).flat()[0];
}

function friendlyMessage(status: number, detail?: string): string {
  if (status === 0) return 'No se pudo conectar con la API. Verifica que el backend esté en ejecución.';
  if (status === 400) return detail ?? 'Revisa los datos ingresados e inténtalo nuevamente.';
  if (status === 404) return detail ?? 'El recurso solicitado ya no está disponible.';
  if (status === 409) {
    return detail?.toLocaleLowerCase().includes('horario')
      ? 'El médico ya tiene una cita activa en ese horario. Elige otra fecha u hora.'
      : detail ?? 'La operación entra en conflicto con información existente.';
  }
  if (status >= 500) return 'El servidor no pudo completar la solicitud. Inténtalo más tarde.';
  return detail ?? 'No se pudo completar la operación.';
}
