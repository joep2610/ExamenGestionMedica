export const ESTADOS_CITA = ['Scheduled', 'Confirmed', 'Completed', 'Cancelled'] as const;

export type EstadoCita = (typeof ESTADOS_CITA)[number];

export interface Cita {
  id: number;
  pacienteId: number;
  nombreCompletoPaciente: string;
  medico: string;
  fechaHora: string;
  estado: EstadoCita;
  motivo: string;
  diagnostico: string | null;
  tratamiento: string | null;
}

export interface SolicitudCita {
  pacienteId: number;
  medico: string;
  fechaHora: string;
  estado: EstadoCita;
  motivo: string;
  diagnostico: string | null;
  tratamiento: string | null;
}

export interface FiltrosCita {
  fecha?: string;
  medico?: string;
  estado?: EstadoCita;
}

export const ETIQUETAS_ESTADO_CITA: Record<EstadoCita, string> = {
  Scheduled: 'Programada',
  Confirmed: 'Confirmada',
  Completed: 'Completada',
  Cancelled: 'Cancelada',
};
