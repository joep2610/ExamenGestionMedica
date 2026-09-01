import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { Cita, EstadoCita, ESTADOS_CITA, ETIQUETAS_ESTADO_CITA, SolicitudCita } from '../../core/models/cita.model';
import { Paciente } from '../../core/models/paciente.model';
import { ServicioCitas } from '../../core/services/cita.service';
import { NotificationService } from '../../core/services/notification.service';
import { ServicioPacientes } from '../../core/services/paciente.service';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state.component';
import { getErrorMessage } from '../../shared/utils/error-message';

@Component({ selector:'app-cita-formulario', imports:[ReactiveFormsModule,RouterLink,LoadingStateComponent], templateUrl:'./cita-formulario.component.html', styleUrl:'./cita-formulario.component.scss', changeDetection:ChangeDetectionStrategy.OnPush })
export class CitaFormularioComponent {
  private readonly fb=inject(FormBuilder);private readonly api=inject(ServicioCitas);private readonly patientsApi=inject(ServicioPacientes);private readonly notifications=inject(NotificationService);private readonly router=inject(Router);private readonly route=inject(ActivatedRoute);
  protected readonly appointmentId=parseRouteId(this.route.snapshot.paramMap.get('id'));protected readonly editing=this.appointmentId!==null;protected readonly loading=signal(true);protected readonly saving=signal(false);protected readonly loadError=signal('');protected readonly patients=signal<Paciente[]>([]);protected readonly statuses=ESTADOS_CITA;protected readonly labels=ETIQUETAS_ESTADO_CITA;
  protected readonly form=this.fb.nonNullable.group({pacienteId:[0,[Validators.required,Validators.min(1)]],medico:['',[Validators.required,Validators.maxLength(120)]],fechaHora:['',Validators.required],estado:['Scheduled' as EstadoCita,Validators.required],motivo:['',[Validators.required,Validators.maxLength(250)]],diagnostico:['',[Validators.maxLength(500)]],tratamiento:['',[Validators.maxLength(500)]]});
  constructor(){this.loadData()}
  protected submit():void{if(this.form.invalid||this.saving()){this.form.markAllAsTouched();return}const value=this.form.getRawValue();const request:SolicitudCita={...value,diagnostico:value.diagnostico.trim()||null,tratamiento:value.tratamiento.trim()||null};this.saving.set(true);const operation=this.appointmentId?this.api.actualizar(this.appointmentId,request):this.api.crear(request);operation.subscribe({next:()=>{this.notifications.success(this.editing?'Cita actualizada correctamente.':'Cita programada correctamente.');void this.router.navigate(['/citas'])},error:(error:unknown)=>{this.notifications.error(getErrorMessage(error));this.saving.set(false)}})}
  protected hasError(name:keyof typeof this.form.controls,error?:string):boolean{const control=this.form.controls[name];return control.touched&&(error?control.hasError(error):control.invalid)}
  private loadData():void{const appointment$=this.appointmentId?this.api.obtenerPorId(this.appointmentId):of(null);forkJoin({patients:this.patientsApi.obtenerTodos(),appointment:appointment$}).subscribe({next:({patients,appointment})=>{this.patients.set(patients);if(appointment)this.patchAppointment(appointment);this.loading.set(false)},error:(error:unknown)=>{this.loadError.set(getErrorMessage(error));this.loading.set(false)}})}
  private patchAppointment(item:Cita):void{this.form.patchValue({pacienteId:item.pacienteId,medico:item.medico,fechaHora:toLocalInput(item.fechaHora),estado:item.estado,motivo:item.motivo,diagnostico:item.diagnostico??'',tratamiento:item.tratamiento??''})}
}
function toLocalInput(value:string):string{const fecha=new Date(value);const offset=fecha.getTimezoneOffset();return new Date(fecha.getTime()-offset*60_000).toISOString().slice(0,16)}
function parseRouteId(value:string|null):number|null{if(value===null)return null;const id=Number(value);return Number.isInteger(id)&&id>0?id:null}

