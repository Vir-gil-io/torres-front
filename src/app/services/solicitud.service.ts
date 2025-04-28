import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {
  private apiUrl = 'http://localhost:3000/api/solicitudes'; // URL del BackEnd

  constructor(private http: HttpClient) { }

  obtenerSolicitudes() {
    return this.http.get<any[]>(this.apiUrl);
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