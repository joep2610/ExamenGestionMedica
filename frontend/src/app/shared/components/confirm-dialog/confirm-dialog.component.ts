import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    @if (open()) {
      <div class="dialog-backdrop" (click)="cancelled.emit()">
        <section class="dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-dialog-title" aria-describedby="confirm-dialog-description" (click)="$event.stopPropagation()">
          <span class="dialog__icon" aria-hidden="true">!</span>
          <h2 id="confirm-dialog-title">{{ title() }}</h2>
          <p id="confirm-dialog-description">{{ message() }}</p>
          <div class="dialog__actions">
            <button type="button" class="button button--ghost" (click)="cancelled.emit()">Volver</button>
            <button type="button" class="button button--danger" (click)="confirmed.emit()">{{ confirmLabel() }}</button>
          </div>
        </section>
      </div>
    }
  `,
  styleUrl: './confirm-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {
  readonly open = input(false);
  readonly title = input('Confirmar acción');
  readonly message = input('¿Deseas continuar?');
  readonly confirmLabel = input('Confirmar');
  readonly confirmed = output<void>();
  readonly cancelled = output<void>();
}
