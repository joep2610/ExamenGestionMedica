import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Paciente } from '../../core/models/paciente.model';
import { NotificationService } from '../../core/services/notification.service';
import { ServicioPacientes } from '../../core/services/paciente.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state.component';
import { getErrorMessage } from '../../shared/utils/error-message';

@Component({ selector:'app-paciente-detalle', imports:[RouterLink,ConfirmDialogComponent,LoadingStateComponent], templateUrl:'./paciente-detalle.component.html', styleUrl:'./paciente-detalle.component.scss', changeDetection:ChangeDetectionStrategy.OnPush })
export class PacienteDetalleComponent {
  private readonly api=inject(ServicioPacientes); private readonly route=inject(ActivatedRoute); private readonly router=inject(Router); private readonly notifications=inject(NotificationService);
  protected readonly patient=signal<Paciente|null>(null); protected readonly loading=signal(true); protected readonly error=signal(''); protected readonly confirmOpen=signal(false); protected readonly deleting=signal(false);
  constructor(){this.load();} protected load():void{const id=Number(this.route.snapshot.paramMap.get('id'));if(!Number.isInteger(id)||id<=0)return;this.loading.set(true);this.api.obtenerPorId(id).subscribe({next:(patient)=>{this.patient.set(patient);this.loading.set(false)},error:(error:unknown)=>{this.error.set(getErrorMessage(error));this.loading.set(false)}})}
  protected delete():void{const patient=this.patient();if(!patient||this.deleting())return;this.deleting.set(true);this.api.eliminar(patient.id).subscribe({next:()=>{this.notifications.success('Paciente eliminado correctamente.');void this.router.navigate(['/pacientes'])},error:(error:unknown)=>{this.notifications.error(getErrorMessage(error));this.deleting.set(false);this.confirmOpen.set(false)}})}
  protected formatDate(value:string):string{return new Intl.DateTimeFormat('es-PE',{dateStyle:'long'}).format(new Date(`${value}T00:00:00`))}
}

