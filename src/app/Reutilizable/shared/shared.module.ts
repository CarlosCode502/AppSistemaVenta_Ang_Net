import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//Aquí se van a importar todos los recursos y archivos necesarios autilizar min 02.30 parte 8
//Para poder utilizar formularios reactivos
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
//Para poder hacer solicitudes HttpClientModule
import { HttpClientModule } from '@angular/common/http';
//Permite utilizar tarjetas
import { MatCardModule } from '@angular/material/card';
//Permite trabajar con cajas de texto (txt, correo, number)
import { MatInputModule } from '@angular/material/input';
//Permite trabajar con los select (DropDown)
import { MatSelectModule } from '@angular/material/select';
//Trabajar con las barras de progreso (Como un loading de carga en barra)
import { MatProgressBarModule } from '@angular/material/progress-bar';
//Circulo de carga (de espera o loading)
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
//Permite trabajar con lineas y columnas
import { MatGridListModule } from '@angular/material/grid-list';

//Permite trabajar con contenedores
import { LayoutModule } from '@angular/cdk/layout';
//Para poder complementar el menu (opciones)
import { MatToolbarModule } from '@angular/material/toolbar';
//Trabjar con navBar(Barra de navegación)
import { MatSidenavModule } from '@angular/material/sidenav';
//Botones
import { MatButtonModule } from '@angular/material/button';
//Iconos de angular
import { MatIconModule } from '@angular/material/icon';
//Trabjar con listas
import { MatListModule } from '@angular/material/list';

//Para trabajar con tablas
import { MatTableModule } from '@angular/material/table';
//Para trabajar con páginación
import { MatPaginatorModule } from '@angular/material/paginator';
//Para trabajar con dialogos(ventanas modales)
import { MatDialogModule } from '@angular/material/dialog';
//Para mostrar alertas
import { MatSnackBarModule } from '@angular/material/snack-bar';
//Para mostrar información sobre el control (al que se le pone el cursor)
import { MatTooltipModule } from '@angular/material/tooltip';
//Para autocompletar las cajas de texto según lo que se haya escrito
import { MatAutocompleteModule } from '@angular/material/autocomplete';
//Mostrar el control para mostrar y elegir las fechas
import { MatDatepickerModule } from '@angular/material/datepicker';

//Trabajar con fecha nativa (Verificar)
import { MatNativeDateModule } from '@angular/material/core';
//Permite cambiar el formato de fechas
import { MomentDateModule } from '@angular/material-moment-adapter';
//Fin de agregar los componentes min 09.00 parte 8 

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports:[
    //Importando todos los componentes declarados min 09.41 parte 8
    CommonModule,
    ReactiveFormsModule, 
    FormsModule,
    HttpClientModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MomentDateModule
  ]
})
export class SharedModule {

 }
