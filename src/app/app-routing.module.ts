//Archivo de ruteo principal de todos (redireccionamiento) min 24.00 parte 8
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';

//Aquí se configuran las rutas min 24.09 parte 8
const routes: Routes = [
  //Lo primero es trabajar cuando la url se encuentra vacía
  { path: '', component: LoginComponent, pathMatch: 'full' }, //Cargar el login (full para que sea completa)
  { path: 'login', component: LoginComponent, pathMatch: 'full' }, //Si se escribe es login
  //Solo el nombre de pag(Carga perezosa) cargar los componentes hijos)
  //Se obtienen los hijos del layout module no del routing de la carpeta LayoutModule
  {
    path: 'pages',
    loadChildren: () =>
      import('./Components/layout/layout.module').then((m) => m.LayoutModule),
  },
  //Cuando el usuario escriba una pagina que no es existente lo redirige al login
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  //Aseguramos de que esté siendo llamado el ruteo min 27.46 parte 8
  //Se configura por defecto pero debe ser verificado
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
