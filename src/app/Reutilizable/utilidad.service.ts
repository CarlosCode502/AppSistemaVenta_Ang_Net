//Servicio para compartir el inicio de sesión min 13.32 parte 9
//Este servicio se creó ya que sera necesario mostrar alertas y usar los datos de sesion del usuario

import { Injectable } from '@angular/core';

//Importando componentes para mostrar alertas (angular) min 13.45 parte 9
import { MatSnackBar } from '@angular/material/snack-bar';
//Interfaz de sesion
import { Sesion } from '../Interfaces/sesion';

@Injectable({
  providedIn: 'root',
})
export class UtilidadService {
  //Inyectar la referencia de las alertas de matsnackbar
  constructor(private _snackBar: MatSnackBar) {}

  //Método que devuelve un msj de alerta (recibe parametros) min 14.52 parte 9
  mostrarAlerta(mensaje: string, tipo: string) {
    //Abre un acceso al componente
    this._snackBar.open(mensaje, tipo, {
      //Se va a usar la dirección horizontal y se va a mostrar al fondo
      horizontalPosition: 'end',
      //De manera vertical al inicio
      verticalPosition: 'top',
      //Se va mostrar durante 3s
      duration: 3000,
    });
  }

  //min 16.05 parte 9
  //Método que guarda la sesion del usuario (recibe la sesion)
  guardarSesionUsuario(usuarioSesion: Sesion) {
    //Permite guardar la sesion del usuario en la cache del navegador
    //como un archivo o texto json al que mandamos la usuarioSesion (cadena)
    localStorage.setItem('usuario', JSON.stringify(usuarioSesion));
  }

  //Método que permite obtener la sesion del usuario min 16.58 parte 9
  obtenerSesionUsuario() {
    //Obtiene la sesion del usuario como cadena (se guardo como cadena)
    const dataCadena = localStorage.getItem('usuario');

    //Convertir esa cadena a un usuario (!) para ignorar si es nulo o no
    const usuario = JSON.parse(dataCadena!);

    //Retorna el usuario
    return usuario;
  }

  //Método para eliminar o cerrar la sesión del usuario
  eliminarSesionUsuario() {
    //Remueve la sesion de la memoria local del navegador
    localStorage.removeItem('usuario');
  }
  //Fin de servicio de utilidad min 18.23 parte 9
}
