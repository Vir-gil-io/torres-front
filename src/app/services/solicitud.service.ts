import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {
  private apiUrl = 'http://localhost:3000/api/solicitudes'; // URL del BackEnd

  constructor(private http: HttpClient) { }

  obtenerSolicitudes() {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Asegúrate de agregar este método si no lo tienes
  obtenerSolicitud(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  crearSolicitud(solicitud: any) {
    return this.http.post(this.apiUrl, solicitud);
  }

  actualizarSolicitud(id: string, cambios: any) {
    return this.http.put(`${this.apiUrl}/${id}`, cambios);
  }

  eliminarSolicitud(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}