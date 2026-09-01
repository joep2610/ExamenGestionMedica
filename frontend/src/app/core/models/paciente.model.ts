export interface Paciente {
  id: number;
  nombres: string;
  apellidos: string;
  fechaNacimiento: string;
  genero: string;
  direccion: string;
  telefono: string;
  email: string;
}

export type SolicitudPaciente = Omit<Paciente, 'id'>;
