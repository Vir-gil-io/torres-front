import { Component, OnInit } from '@angular/core';
import { SolicitudService } from '../services/solicitud.service';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit {
  solicitudes: any[] = [];
  cargando: boolean = true;

  constructor(private solicitudService: SolicitudService) { }

  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  cargarSolicitudes() {
    this.solicitudService.obtenerSolicitudes().subscribe({
      next: (data) => {
        this.solicitudes = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        alert('Error al cargar las solicitudes');
      }
    });
  }

  eliminarSolicitud(id: string) {
    if (confirm('¿Eliminar esta solicitud?')) {
      this.solicitudService.eliminarSolicitud(id).subscribe(() => {
        this.cargarSolicitudes(); // Recargar la lista
      });
    }
  }
}