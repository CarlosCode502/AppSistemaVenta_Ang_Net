//Sirve para especificar como se van a redireccionar las páginas
//Creado junto con (layout.module.ts) min 15.42 parte 8
//Ruteo Principal solo de este layout o pages
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';

//Se importa automáticamente al especificar las pag hijas min 20.45 parte 8 
import { DashBoardComponent } from './Pages/dash-board/dash-board.component';
import { UsuarioComponent } from './Pages/usuario/usuario.component';
import { ProductoComponent } from './Pages/producto/producto.component';
import { VentaComponent } from './Pages/venta/venta.component';
import { HistorialVentaComponent } from './Pages/historial-venta/historial-venta.component';
import { ReporteComponent } from './Pages/reporte/reporte.component';

//Configurando las rutas (ruteos) min 20.04 parte 8
const routes: Routes = [{
  path:'', //Si la ruta no tiene una url
  component:LayoutComponent, //Cargar el componente
  //Páginas hijas (cuando se reciba una url se carga el componente de nombre:)
children:[
  //Cuando en la ruta se escriba 'nombre' se apuntara al componente min 20.58 parte 8
  {path:'dashboard', component:DashBoardComponent}, 
  {path:'usuarios', component:UsuarioComponent},
  {path:'productos', component:ProductoComponent},  
  {path:'venta', component:VentaComponent},
  {path:'historial', component:HistorialVentaComponent},
  {path:'reporte', component:ReporteComponent}
]
}];

@NgModule({
  //Verificando si los ha activado min 22.57 parte 8
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
