import { Injectable, signal } from '@angular/core';

export type NotificationKind = 'success' | 'error' | 'info';

export interface AppNotification {
  id: number;
  kind: NotificationKind;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private nextId = 0;
  readonly notifications = signal<AppNotification[]>([]);

  show(message: string, kind: NotificationKind = 'info'): void {
    const notification = { id: ++this.nextId, kind, message };
    this.notifications.update((items) => [...items, notification]);
    window.setTimeout(() => this.dismiss(notification.id), 5000);
  }

  success(message: string): void { this.show(message, 'success'); }
  error(message: string): void { this.show(message, 'error'); }
  dismiss(id: number): void { this.notifications.update((items) => items.filter((item) => item.id !== id)); }
}
