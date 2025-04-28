import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/empleados'; // URL del BackEnd

  constructor(private http: HttpClient, private router: Router) {}

  // Verificar si el RFC existe
  login(rfc: string): Observable<boolean> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(empleados => {
        const empleado = empleados.find(emp => emp.RFC === rfc);
        if (empleado) {
          localStorage.setItem('rfc', rfc); // Guardar RFC en localStorage
          localStorage.setItem('empleado', JSON.stringify(empleado)); // Guarda todos los datos
          this.router.navigate(['/inicio']);
        }
        return !!empleado;
      })
    );
  }

  // Cerrar sesión
  logout(): void {
    localStorage.removeItem('rfc');
    this.router.navigate(['/login']);
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('rfc');
  }
}