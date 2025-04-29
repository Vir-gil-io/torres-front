import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SolicitudService } from '../services/solicitud.service';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit {
  solicitudes: any[] = [];
  cargando: boolean = true;
  filtroEstado: string = '';
  filtroSolicitante: string = '';
  
  constructor(
    private solicitudService: SolicitudService,
    private router: Router
  ) { }
  
  ngOnInit(): void {
    this.cargarSolicitudes();
  }
  
  cargarSolicitudes() {
    this.cargando = true;
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
    if (confirm('¿Está seguro de eliminar esta solicitud?')) {
      this.solicitudService.eliminarSolicitud(id).subscribe({
        next: () => {
          alert('Solicitud eliminada correctamente');
          this.cargarSolicitudes(); // Recargar la lista
        },
        error: (error) => {
          console.error('Error al eliminar solicitud:', error);
          alert('Error al eliminar la solicitud');
        }
      });
    }
  }
  
  editarSolicitud(id: string) {
    this.router.navigate(['/edit-sol', id]);
  }
  
  getEstadoClase(estado: string): string {
    switch (estado) {
      case 'Atendida':
        return 'badge bg-success';
      case 'En espera':
        return 'badge bg-warning text-dark';
      case 'Rechazada':
        return 'badge bg-danger';
      case 'Cancelada':
        return 'badge bg-secondary';
      default:
        return 'badge bg-info';
    }
  }
  
  get solicitudesFiltradas() {
    return this.solicitudes.filter(sol => {
      return (this.filtroEstado ? sol.estado === this.filtroEstado : true) &&
             (this.filtroSolicitante ? sol.solicitante.toLowerCase().includes(this.filtroSolicitante.toLowerCase()) : true);
    });
  }
}