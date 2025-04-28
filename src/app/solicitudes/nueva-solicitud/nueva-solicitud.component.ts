import { Component, OnInit } from '@angular/core';
import { SolicitudService } from '../../services/solicitud.service';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-nueva-solicitud',
  templateUrl: './nueva-solicitud.component.html',
  styleUrls: ['./nueva-solicitud.component.css']
})
export class NuevaSolicitudComponent implements OnInit {
  empleado: any;
  productos: any[] = [];
  productoSeleccionado: string = '';
  cantidad: number = 1;
  consumibles: any[] = [];
  cargando: boolean = true;

  constructor(
    private solicitudService: SolicitudService,
    private productoService: ProductoService
  ) {
    const empleadoData = localStorage.getItem('empleado');
    this.empleado = empleadoData ? JSON.parse(empleadoData) : {};
  }

  ngOnInit(): void {
    this.productoService.obtenerProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.cargando = false;
      },
      error: () => this.cargando = false
    });
  }

  agregarProducto() {
    const producto = this.productos.find(p => p._id === this.productoSeleccionado);
    if (producto && this.cantidad > 0) {
      this.consumibles.push({
        nombre_consumible: producto.nombre,
        cantidad_solicitada: this.cantidad
      });
      this.productoSeleccionado = '';
      this.cantidad = 1;
    }
  }

  eliminarProducto(item: any) {
    this.consumibles = this.consumibles.filter(i => i !== item);
  }

  obtenerNombreProducto(id: string): string {
    return this.productos.find(p => p.nombre === id)?.nombre || id;
  }

  onSubmit() {
    const nuevaSolicitud = {
      departamento: this.empleado.departamento,
      area: this.empleado.area,
      solicitante: this.empleado.nombre_empleado,
      consumibles: this.consumibles
    };

    this.solicitudService.crearSolicitud(nuevaSolicitud).subscribe({
      next: () => {
        alert('Solicitud creada exitosamente!');
        window.location.href = '/solicitudes';
      },
      error: () => alert('Error al crear la solicitud')
    });
  }
}