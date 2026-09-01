import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../config/api.config';
import { Paciente, SolicitudPaciente } from '../models/paciente.model';

@Injectable({ providedIn: 'root' })
export class ServicioPacientes {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${API_URL}/pacientes`;

  obtenerTodos(search = ''): Observable<Paciente[]> {
    const params = search.trim() ? new HttpParams().set('search', search.trim()) : undefined;
    return this.http.get<Paciente[]>(this.endpoint, { params });
  }

  obtenerPorId(id: number): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.endpoint}/${id}`);
  }

  crear(request: SolicitudPaciente): Observable<Paciente> {
    return this.http.post<Paciente>(this.endpoint, request);
  }

  actualizar(id: number, request: SolicitudPaciente): Observable<Paciente> {
    return this.http.put<Paciente>(`${this.endpoint}/${id}`, request);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}

