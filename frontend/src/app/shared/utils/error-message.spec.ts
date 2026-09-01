import { describe, expect, it } from 'vitest';
import { getErrorMessage } from './error-message';

describe('getErrorMessage', () => {
  it('uses the friendly API message', () => {
    expect(getErrorMessage({ status: 409, message: 'El médico ya tiene una cita activa.' })).toBe('El médico ya tiene una cita activa.');
  });

  it('returns a safe fallback for unknown errors', () => {
    expect(getErrorMessage(new Error('internal detail'))).toBe('Ocurrió un error inesperado. Inténtalo nuevamente.');
  });
});
