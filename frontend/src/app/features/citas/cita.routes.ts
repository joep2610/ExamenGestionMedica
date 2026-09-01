import { Routes } from '@angular/router';

export const RUTAS_CITAS: Routes = [
  { path: '', loadComponent: () => import('./cita-lista.component').then((module) => module.CitaListaComponent) },
  { path: 'nueva', title: 'Nueva cita | Clínica Vital', loadComponent: () => import('./cita-formulario.component').then((module) => module.CitaFormularioComponent) },
  { path: ':id/editar', title: 'Editar cita | Clínica Vital', loadComponent: () => import('./cita-formulario.component').then((module) => module.CitaFormularioComponent) },
];

