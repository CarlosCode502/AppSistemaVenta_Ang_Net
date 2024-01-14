//Este modulo principal no sabe que se han creado las páginas min 19.25 parte 8
//Solo el modulo que se encuentra en la misma úbicación

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//Se agregaron las referencias automaticamente luego de crealos min 14.26 parte 8
import { LoginComponent } from './Components/login/login.component';
import { LayoutComponent } from './Components/layout/layout.component';

//Se agregó luego de importar el sharedmodule min 29.54 parte 8
import { SharedModule } from './Reutilizable/shared/shared.module';

@NgModule({
  declarations: [AppComponent, LoginComponent, LayoutComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    //Importando el sharedmodule al modulo principal min 29.53 parte 8
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
