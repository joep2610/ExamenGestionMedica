import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime } from 'rxjs';
import { Cita, EstadoCita, ESTADOS_CITA, ETIQUETAS_ESTADO_CITA, FiltrosCita } from '../../core/models/cita.model';
import { ServicioCitas } from '../../core/services/cita.service';
import { NotificationService } from '../../core/services/notification.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state.component';
import { getErrorMessage } from '../../shared/utils/error-message';

@Component({ selector:'app-cita-lista', imports:[ReactiveFormsModule,RouterLink,ConfirmDialogComponent,EmptyStateComponent,LoadingStateComponent], templateUrl:'./cita-lista.component.html', styleUrl:'./cita-lista.component.scss', changeDetection:ChangeDetectionStrategy.OnPush })
export class CitaListaComponent {
  private readonly fb=inject(FormBuilder); private readonly api=inject(ServicioCitas); private readonly notifications=inject(NotificationService);
  protected readonly appointments=signal<Cita[]>([]); protected readonly loading=signal(true); protected readonly error=signal(''); protected readonly pendingCancel=signal<Cita|null>(null); protected readonly cancelling=signal(false); protected readonly statuses=ESTADOS_CITA; protected readonly labels=ETIQUETAS_ESTADO_CITA;
  protected readonly filters=this.fb.nonNullable.group({fecha:'',medico:'',estado:'' as EstadoCita|''});
  constructor(){this.load();this.filters.valueChanges.pipe(debounceTime(300)).subscribe(()=>this.load())}
  protected load():void{this.loading.set(true);this.error.set('');const value=this.filters.getRawValue();const filters:FiltrosCita={};if(value.fecha)filters.fecha=value.fecha;if(value.medico.trim())filters.medico=value.medico;if(value.estado)filters.estado=value.estado;this.api.obtenerTodas(filters).subscribe({next:(items)=>{this.appointments.set(items);this.loading.set(false)},error:(error:unknown)=>{this.error.set(getErrorMessage(error));this.loading.set(false)}})}
  protected clearFilters():void{this.filters.reset({fecha:'',medico:'',estado:''})}
  protected confirmCancel():void{const item=this.pendingCancel();if(!item||this.cancelling())return;this.cancelling.set(true);this.api.cancelar(item.id).subscribe({next:()=>{this.notifications.success('Cita cancelada correctamente.');this.pendingCancel.set(null);this.cancelling.set(false);this.load()},error:(error:unknown)=>{this.notifications.error(getErrorMessage(error));this.pendingCancel.set(null);this.cancelling.set(false)}})}
  protected formatDate(value:string):string{return new Intl.DateTimeFormat('es-PE',{day:'2-digit',month:'short',year:'numeric'}).format(new Date(value))} protected formatTime(value:string):string{return new Intl.DateTimeFormat('es-PE',{hour:'2-digit',minute:'2-digit'}).format(new Date(value))}
}

