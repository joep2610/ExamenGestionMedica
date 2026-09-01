import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../config/api.config';
import { Cita, FiltrosCita, SolicitudCita } from '../models/cita.model';

@Injectable({ providedIn: 'root' })
export class ServicioCitas {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${API_URL}/citas-medicas`;

  obtenerTodas(filters: FiltrosCita = {}): Observable<Cita[]> {
    let params = new HttpParams();
    if (filters.fecha) params = params.set('fecha', filters.fecha);
    if (filters.medico?.trim()) params = params.set('medico', filters.medico.trim());
    if (filters.estado) params = params.set('estado', filters.estado);
    return this.http.get<Cita[]>(this.endpoint, { params });
  }

  obtenerPorId(id: number): Observable<Cita> {
    return this.http.get<Cita>(`${this.endpoint}/${id}`);
  }

  crear(request: SolicitudCita): Observable<Cita> {
    return this.http.post<Cita>(this.endpoint, request);
  }

  actualizar(id: number, request: SolicitudCita): Observable<Cita> {
    return this.http.put<Cita>(`${this.endpoint}/${id}`, request);
  }

  cancelar(id: number): Observable<Cita> {
    return this.http.patch<Cita>(`${this.endpoint}/${id}/cancelar`, null);
  }
}

