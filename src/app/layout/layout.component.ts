import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  empleado: any;

  constructor(private authService: AuthService) {
    const empleadoData = localStorage.getItem('empleado');
    this.empleado = empleadoData ? JSON.parse(empleadoData) : {};
  }

  logout(): void {
    this.authService.logout();
  }
}