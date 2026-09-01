import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Cita, EstadoCita, ETIQUETAS_ESTADO_CITA } from '../../core/models/cita.model';
import { ServicioCitas } from '../../core/services/cita.service';
import { ServicioPacientes } from '../../core/services/paciente.service';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state.component';
import { getErrorMessage } from '../../shared/utils/error-message';

@Component({
  selector: 'app-panel',
  imports: [LoadingStateComponent, EmptyStateComponent],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelComponent {
  private readonly patientsApi = inject(ServicioPacientes);
  private readonly appointmentsApi = inject(ServicioCitas);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly patientCount = signal(0);
  protected readonly appointments = signal<Cita[]>([]);
  protected readonly labels = ETIQUETAS_ESTADO_CITA;
  protected readonly statusCounts = computed(() => {
    const counts: Record<EstadoCita, number> = { Scheduled: 0, Confirmed: 0, Completed: 0, Cancelled: 0 };
    for (const appointment of this.appointments()) counts[appointment.estado] += 1;
    return counts;
  });
  protected readonly upcoming = computed(() => this.appointments()
    .filter((item) => item.estado !== 'Cancelled' && item.estado !== 'Completed' && new Date(item.fechaHora).getTime() >= Date.now())
    .sort((a, b) => a.fechaHora.localeCompare(b.fechaHora)).slice(0, 5));

  constructor() { this.load(); }

  protected load(): void {
    this.loading.set(true); this.error.set('');
    forkJoin({ patients: this.patientsApi.obtenerTodos(), appointments: this.appointmentsApi.obtenerTodas() }).subscribe({
      next: ({ patients, appointments }) => { this.patientCount.set(patients.length); this.appointments.set(appointments); this.loading.set(false); },
      error: (error: unknown) => { this.error.set(getErrorMessage(error)); this.loading.set(false); },
    });
  }

  protected formatDate(value: string): string { return new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value)); }
  protected formatTime(value: string): string { return new Intl.DateTimeFormat('es-PE', { hour: '2-digit', minute: '2-digit' }).format(new Date(value)); }
}

