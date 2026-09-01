import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification-center',
  template: `
    <section class="notifications" aria-label="Notificaciones" aria-live="polite">
      @for (notification of service.notifications(); track notification.id) {
        <div [class]="'notification notification--' + notification.kind" role="status">
          <span class="notification__icon" aria-hidden="true">{{ notification.kind === 'success' ? '✓' : notification.kind === 'error' ? '!' : 'i' }}</span>
          <p>{{ notification.message }}</p>
          <button type="button" class="notification__close" (click)="service.dismiss(notification.id)" aria-label="Cerrar notificación">×</button>
        </div>
      }
    </section>
  `,
  styleUrl: './notification.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent { protected readonly service = inject(NotificationService); }
