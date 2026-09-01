import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/main-layout.component').then((module) => module.MainLayoutComponent),
    children: [
      { path: 'panel', title: 'Panel principal | Clínica Vital', loadComponent: () => import('./features/panel/panel.component').then((module) => module.PanelComponent) },
      { path: 'pacientes', title: 'Pacientes | Clínica Vital', loadChildren: () => import('./features/pacientes/paciente.routes').then((module) => module.RUTAS_PACIENTES) },
      { path: 'citas', title: 'Citas médicas | Clínica Vital', loadChildren: () => import('./features/citas/cita.routes').then((module) => module.RUTAS_CITAS) },
      { path: '', pathMatch: 'full', redirectTo: 'panel' },
    ],
  },
  { path: '**', redirectTo: 'panel' },
];
