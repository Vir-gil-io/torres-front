import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
  empleado: any;
  rfc: string | null = localStorage.getItem('rfc');
  nombre: string | null = localStorage.getItem('nombre');

  constructor(private authService: AuthService) {
    const empleadoData = localStorage.getItem('empleado');
    this.empleado = empleadoData ? JSON.parse(empleadoData) : {};
  }

  logout(): void {
    this.authService.logout();
  }
}