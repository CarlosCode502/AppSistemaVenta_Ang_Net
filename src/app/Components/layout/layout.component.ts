//Agregando la lógica para poder mostrar los menus segun el tipo de usuario min 00.31 parte 16
import { Component, OnInit } from '@angular/core';
//Para poder redireccionarnos entre páginas
import { Router } from '@angular/router';
//Interfaz de menu
import { Menu } from 'src/app/Interfaces/menu';

//Servicio de menu (contiene el método para poder listar los menus)
import { MenuService } from 'src/app/Services/menu.service';
//Para poder mostrar alertas min 01.17 parte 16
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  //Varibles a utilizar min 01.31 parte 16

  //Contendrá el listado de menús a mostrar
  listaMenu: Menu[] = [];
  //Obtendrá el correo del usuario
  correoUsuario: string = '';
  //Contendrá el rol del usuario
  rolUsuario: string = '';

  //Contendrá el estado del usuario (Activo/Inactivo)
  estadoUsuario: string = '';

  //Inyectando las dependencias del proyecto min 02.10 parte 16
  constructor(
    //Contiene una def para el ruteo
    private _router: Router,
    //Para el menuservice
    private _menuService: MenuService,
    //para las alerta
    private _utilidadService: UtilidadService
  ) {}

  //Se ejecuta al momento que un componente es visible o entra en foco min 03.02 parte 16
  ngOnInit(): void {
    //Obtiene la sesion del usuario del método en (min 16.58 parte 9)
    //Que obtiene la sesión local guardada
    const usuario = this._utilidadService.obtenerSesionUsuario();

    //Validamos si el usuario no es nulo en caso de que llegué a serlo
    if (usuario != null) {
      //Asignamos el correo del usuario
      this.correoUsuario = usuario.correo;
      //Asignamos el rol del usuario
      this.rolUsuario = usuario.rolDescripcion;
      //Asignamos el estado del usuario
      this.estadoUsuario = usuario.esActivo;

      console.log(this.estadoUsuario);
      // if(this.estadoUsuario === 'Activo'){

      // }

      //Obtenemos el listado de usuarios del método en (min 40.38 parte 7)
      //Y le mandamos el id del usuario recien obtenido
      this._menuService.Lista(usuario.idUsuario).subscribe({
        //Con op flecha validamos
        next: (data) => {
          //Si el estatus es exitoso
          if (data.status) {
            //Asignamos el listado de menús
            this.listaMenu = data.value;
          }
        },
        error: (e) => {},
      });
    } else {
      this.cerrarSesion();
    }
  }

  //Método para cerrar la sesión del usuario min 05.08 parte 16
  cerrarSesion() {
    //Ejecutamos el métod para cerrar la sesion del usuario en (min 18.23 parte 9 aprox)
    this._utilidadService.eliminarSesionUsuario();

    //Para que redirija a la vista del login min 05.26 parte 16
    this._router.navigate(['login']);
  }
}
