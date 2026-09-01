import { Routes } from '@angular/router';

export const RUTAS_PACIENTES: Routes = [
  { path: '', loadComponent: () => import('./paciente-lista.component').then((module) => module.PacienteListaComponent) },
  { path: 'nuevo', title: 'Nuevo paciente | Clínica Vital', loadComponent: () => import('./paciente-formulario.component').then((module) => module.PacienteFormularioComponent) },
  { path: ':id/editar', title: 'Editar paciente | Clínica Vital', loadComponent: () => import('./paciente-formulario.component').then((module) => module.PacienteFormularioComponent) },
  { path: ':id', title: 'Detalle del paciente | Clínica Vital', loadComponent: () => import('./paciente-detalle.component').then((module) => module.PacienteDetalleComponent) },
];

