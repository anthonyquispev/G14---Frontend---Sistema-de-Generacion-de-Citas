import { Especialidad } from './../models/especialidad.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadesService {
  URL_API_PROD: string = 'https://policlinico.herokuapp.com/api/especialidades';
  URL_API_DEV: string = 'http://localhost:4000/api/especialidades';

  constructor(private http: HttpClient) { }

  getEspecialidades(): Observable<any> {
    return this.http.get<any>(this.URL_API_PROD);
  }

  createEspecialidad(data: Especialidad) {
    return this.http.post(this.URL_API_PROD, data);
  }

  updateEspecialidad(id: string, data: Especialidad) {
    return this.http.put(`${this.URL_API_PROD}/${id}`, data);
  }

  deleteEspecialidad(id: string) {
    return this.http.delete(`${this.URL_API_PROD}/${id}`);
  }

}
