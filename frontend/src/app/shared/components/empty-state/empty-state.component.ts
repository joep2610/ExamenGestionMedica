import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  template: `<div class="empty"><span class="empty__icon" aria-hidden="true">{{ icon() }}</span><h2>{{ title() }}</h2><p>{{ message() }}</p><ng-content /></div>`,
  styles: [`.empty { min-height: 15rem; display: grid; place-items: center; align-content: center; text-align: center; padding: 2rem; } .empty__icon { display:grid; place-items:center; width:3.5rem; height:3.5rem; border-radius:1rem; color:var(--color-primary); background:var(--color-primary-soft); font-size:1.5rem; } h2 { margin: .9rem 0 .3rem; font-size: 1.1rem; } p { max-width: 30rem; margin: 0 0 1rem; color: var(--color-text-muted); }`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateComponent {
  readonly icon = input('＋');
  readonly title = input('Aún no hay información');
  readonly message = input('Los nuevos registros aparecerán aquí.');
}
