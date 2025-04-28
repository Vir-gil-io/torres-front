import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { InicioComponent } from './inicio/inicio.component';
import { AuthGuard } from './guards/auth.guard';
import { LayoutComponent } from './layout/layout.component';
import { SolicitudesComponent } from './solicitudes/solicitudes.component';
import { NuevaSolicitudComponent } from './solicitudes/nueva-solicitud/nueva-solicitud.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'inicio', component: InicioComponent, canActivate: [AuthGuard] }, // Ruta protegida
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '', redirectTo: 'inicio', pathMatch: 'full' }, //Redirige a "inicio"
  { 
    path: '', 
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'inicio', component: InicioComponent },
      { path: 'solicitudes', component: SolicitudesComponent },
    ]
  },
  { 
    path: '', 
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'inicio', component: InicioComponent },
      { path: 'solicitudes', component: SolicitudesComponent },
      { path: 'solicitudes/nueva', component: NuevaSolicitudComponent } // Nueva ruta
    ]
  }
  
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }