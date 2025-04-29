import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SolicitudService } from '../../services/solicitud.service';
import { ProductoService } from '../../services/producto.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit {
  solicitudForm!: FormGroup;
  solicitudId: string = '';
  cargando: boolean = true;
  estadoOptions: string[] = ['Atendida', 'En espera', 'Rechazada', 'Cancelada'];
  
  // Campos para la selección de productos
  productos: any[] = [];
  productoSeleccionado: string = '';
  cantidad: number = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private solicitudService: SolicitudService,
    private productoService: ProductoService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.inicializarFormulario();
    
    // Cargar la lista de productos disponibles
    this.productoService.obtenerProductos().subscribe({
      next: (data) => {
        this.productos = data;
      },
      error: (error) => {
        console.error('Error al cargar productos', error);
      }
    });
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.solicitudId = params['id'];
        this.cargarSolicitud(this.solicitudId);
      } else {
        this.cargando = false;
        this.router.navigate(['/solicitudes']);
      }
    });
  }

  inicializarFormulario(): void {
    // Solo incluimos los campos editables y los campos de solo lectura
    this.solicitudForm = this.fb.group({
      // Campos solo lectura
      departamento: [{ value: '', disabled: true }],
      area: [{ value: '', disabled: true }],
      solicitante: [{ value: '', disabled: true }],
      folio: [{ value: '', disabled: true }],
      fecha_solicitud: [{ value: '', disabled: true }],
      comentario: [{ value: '', disabled: true }],
      atendido_por: [{ value: '', disabled: true }],
      // Campos editables
      estado: ['', Validators.required],
      consumibles: this.fb.array([])
    });
  }

  get consumiblesFormArray(): FormArray {
    return this.solicitudForm.get('consumibles') as FormArray;
  }

  cargarSolicitud(id: string): void {
    this.cargando = true;
    this.solicitudService.obtenerSolicitud(id).subscribe({
      next: (solicitud) => {
        // Cargar consumibles si existen
        if (solicitud.consumibles && Array.isArray(solicitud.consumibles) && solicitud.consumibles.length > 0) {
          solicitud.consumibles.forEach((consumible: any) => {
            this.agregarConsumibleExistente(consumible);
          });
        }
        
        // Formatear la fecha para mostrarla correctamente en el formulario
        const fechaSolicitud = solicitud.fecha_solicitud ? new Date(solicitud.fecha_solicitud).toISOString().slice(0, 10) : '';
        
        // Cargar todos los datos en el formulario
        this.solicitudForm.patchValue({
          departamento: solicitud.departamento,
          area: solicitud.area,
          solicitante: solicitud.solicitante,
          estado: solicitud.estado,
          folio: solicitud.folio,
          fecha_solicitud: fechaSolicitud,
          comentario: solicitud.comentario || '',
          atendido_por: solicitud.atendido_por || ''
        });
        
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar la solicitud', error);
        this.cargando = false;
        alert('Error al cargar la solicitud');
        this.router.navigate(['/solicitudes']);
      }
    });
  }

  agregarConsumibleExistente(consumible: any): void {
    const consumibleForm = this.fb.group({
      nombre_consumible: [consumible.nombre_consumible, Validators.required],
      cantidad_solicitada: [consumible.cantidad_solicitada, [Validators.required, Validators.min(1)]]
    });
    
    this.consumiblesFormArray.push(consumibleForm);
  }

  agregarProducto(): void {
    const producto = this.productos.find(p => p._id === this.productoSeleccionado);
    if (producto && this.cantidad > 0) {
      const consumibleForm = this.fb.group({
        nombre_consumible: [producto.nombre, Validators.required],
        cantidad_solicitada: [this.cantidad, [Validators.required, Validators.min(1)]]
      });
      
      this.consumiblesFormArray.push(consumibleForm);
      this.productoSeleccionado = '';
      this.cantidad = 1;
    }
  }

  eliminarConsumible(index: number): void {
    this.consumiblesFormArray.removeAt(index);
  }

  obtenerNombreProducto(id: string): string {
    return this.productos.find(p => p.nombre === id)?.nombre || id;
  }

  guardarCambios(): void {
    if (this.solicitudForm.invalid) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }
    // Obtenemos los valores del formulario (los habilitados)
    const formValues = this.solicitudForm.getRawValue();
    
    const solicitudActualizada = {
      estado: formValues.estado,
      consumibles: formValues.consumibles,
      fecha_ultima_modificacion: new Date()
    };

    this.solicitudService.actualizarSolicitud(this.solicitudId, solicitudActualizada).subscribe({
      next: () => {
        alert('Solicitud actualizada correctamente');
        this.router.navigate(['/solicitudes']);
      },
      error: (error) => {
        console.error('Error al actualizar la solicitud', error);
        alert('Error al actualizar la solicitud');
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/solicitudes']);
  }
}