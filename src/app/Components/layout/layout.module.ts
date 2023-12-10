import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//Usando la especificación de todos los ruteos (se escribio el comentario en) min 28.32 parte 8
import { LayoutRoutingModule } from './layout-routing.module';
//Se importaron los componentes para las páginas automáticamente min 18.55 parte 8
import { DashBoardComponent } from './Pages/dash-board/dash-board.component';
import { UsuarioComponent } from './Pages/usuario/usuario.component';
import { ProductoComponent } from './Pages/producto/producto.component';
import { VentaComponent } from './Pages/venta/venta.component';
import { HistorialVentaComponent } from './Pages/historial-venta/historial-venta.component';
import { ReporteComponent } from './Pages/reporte/reporte.component';

//Se importa automaticamente luego de importar shared module min 29.14 parte 8
//Todo lo declarado en shared module se llama al layout principal
import { SharedModule } from 'src/app/Reutilizable/shared/shared.module';

//Este layout.module.ts solo va a pertenecer a la carpeta layout únicamente min 15.42 parte 8

@NgModule({
  declarations: [
    //Aquí estan declarados con el nombre+component min 19.07 parte 8
    DashBoardComponent,
    UsuarioComponent,
    ProductoComponent,
    VentaComponent,
    HistorialVentaComponent,
    ReporteComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    //Importar el modulo que contiene todos los componentes de diseño (interfaz) min 29.14 parte 8
    SharedModule
  ]
})
export class LayoutModule { }
