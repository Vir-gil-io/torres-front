import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  rfc: string = '';
  error: string = '';

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    this.authService.login(this.rfc).subscribe({
      next: (valido) => {
        if (!valido) this.error = 'RFC inválido, intente de nuevo';
      },
      error: () => this.error = 'Error al conectar con el servidor'
    });
  }
}