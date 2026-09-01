import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-state',
  template: `<div class="loading" role="status"><span class="spinner" aria-hidden="true"></span><span>{{ label() }}</span></div>`,
  styles: [`.loading { min-height: 12rem; display: grid; place-items: center; align-content: center; gap: .75rem; color: var(--color-text-muted); } .spinner { width: 2rem; height: 2rem; border: 3px solid var(--color-primary-soft); border-top-color: var(--color-primary); border-radius: 50%; animation: spin .7s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingStateComponent { readonly label = input('Cargando información…'); }
