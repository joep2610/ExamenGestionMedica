import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Paciente } from '../../core/models/paciente.model';
import { NotificationService } from '../../core/services/notification.service';
import { ServicioPacientes } from '../../core/services/paciente.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state.component';
import { getErrorMessage } from '../../shared/utils/error-message';

@Component({ selector: 'app-paciente-lista', imports: [ReactiveFormsModule, RouterLink, ConfirmDialogComponent, EmptyStateComponent, LoadingStateComponent], templateUrl: './paciente-lista.component.html', styleUrl: './paciente-lista.component.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class PacienteListaComponent {
  private readonly api = inject(ServicioPacientes); private readonly notifications = inject(NotificationService);
  protected readonly searchControl = new FormControl('', { nonNullable: true });
  protected readonly patients = signal<Paciente[]>([]); protected readonly loading = signal(true); protected readonly error = signal(''); protected readonly pendingDelete = signal<Paciente | null>(null); protected readonly deleting = signal(false);
  constructor() { this.load(); this.searchControl.valueChanges.pipe(debounceTime(350), distinctUntilChanged()).subscribe((search) => this.load(search)); }
  protected load(search = this.searchControl.value): void { this.loading.set(true); this.error.set(''); this.api.obtenerTodos(search).subscribe({ next: (patients) => { this.patients.set(patients); this.loading.set(false); }, error: (error: unknown) => { this.error.set(getErrorMessage(error)); this.loading.set(false); } }); }
  protected confirmDelete(): void { const patient = this.pendingDelete(); if (!patient || this.deleting()) return; this.deleting.set(true); this.api.eliminar(patient.id).subscribe({ next: () => { this.notifications.success('Paciente eliminado correctamente.'); this.pendingDelete.set(null); this.deleting.set(false); this.load(); }, error: (error: unknown) => { this.notifications.error(getErrorMessage(error)); this.pendingDelete.set(null); this.deleting.set(false); } }); }
  protected initials(patient: Paciente): string { return `${patient.nombres[0] ?? ''}${patient.apellidos[0] ?? ''}`.toUpperCase(); }
  protected formatDate(value: string): string { return new Intl.DateTimeFormat('es-PE').format(new Date(`${value}T00:00:00`)); }
}

