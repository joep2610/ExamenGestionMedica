import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SolicitudPaciente } from '../../core/models/paciente.model';
import { NotificationService } from '../../core/services/notification.service';
import { ServicioPacientes } from '../../core/services/paciente.service';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state.component';
import { getErrorMessage } from '../../shared/utils/error-message';

@Component({ selector: 'app-paciente-formulario', imports: [ReactiveFormsModule, RouterLink, LoadingStateComponent], templateUrl: './paciente-formulario.component.html', styleUrl: './paciente-formulario.component.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class PacienteFormularioComponent {
  private readonly fb = inject(FormBuilder); private readonly api = inject(ServicioPacientes); private readonly notifications = inject(NotificationService); private readonly router = inject(Router); private readonly route = inject(ActivatedRoute);
  protected readonly pacienteId = parseRouteId(this.route.snapshot.paramMap.get('id')); protected readonly editing = this.pacienteId !== null; protected readonly loading = signal(this.editing); protected readonly saving = signal(false); protected readonly loadError = signal(''); protected readonly today = new Date().toISOString().slice(0, 10);
  protected readonly form = this.fb.nonNullable.group({ nombres: ['', [Validators.required, Validators.maxLength(120)]], apellidos: ['', [Validators.required, Validators.maxLength(120)]], fechaNacimiento: ['', Validators.required], genero: ['', [Validators.required, Validators.maxLength(30)]], direccion: ['', [Validators.required, Validators.maxLength(200)]], telefono: ['', [Validators.required, Validators.maxLength(30), Validators.pattern(/^[+\d][\d\s()-]{6,29}$/)]], email: ['', [Validators.required, Validators.email, Validators.maxLength(180)]] });
  constructor() { if (this.pacienteId) this.loadPatient(this.pacienteId); }
  protected submit(): void { if (this.form.invalid || this.saving()) { this.form.markAllAsTouched(); return; } const value = this.form.getRawValue(); if (value.fechaNacimiento > this.today) { this.form.controls.fechaNacimiento.setErrors({ future: true }); return; } const request: SolicitudPaciente = value; this.saving.set(true); const operation = this.pacienteId ? this.api.actualizar(this.pacienteId, request) : this.api.crear(request); operation.subscribe({ next: (patient) => { this.notifications.success(this.editing ? 'Paciente actualizado correctamente.' : 'Paciente registrado correctamente.'); void this.router.navigate(['/pacientes', patient.id]); }, error: (error: unknown) => { this.notifications.error(getErrorMessage(error)); this.saving.set(false); } }); }
  protected hasError(controlName: keyof typeof this.form.controls, error?: string): boolean { const control = this.form.controls[controlName]; return control.touched && (error ? control.hasError(error) : control.invalid); }
  private loadPatient(id: number): void { this.api.obtenerPorId(id).subscribe({ next: (patient) => { this.form.patchValue(patient); this.loading.set(false); }, error: (error: unknown) => { this.loadError.set(getErrorMessage(error)); this.loading.set(false); } }); }
}

function parseRouteId(value: string | null): number | null {
  if (value === null) return null;
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

