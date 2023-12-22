//Maneja toda la logica de la pagina min 18.40 parte 9
//Maneja toda la logica de incio de sesion del usuario validando los campos

import { Component } from '@angular/core';

//Agregar todos los recursos que estaremos utilizando
//Contruir y validar
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//Permite hacer redirecciones a otras páginas
import { Router } from '@angular/router';
//Interfaz de login
import { Login } from 'src/app/Interfaces/login';
//Para usar el servicio de usuario
import { UsuarioService } from 'src/app/Services/usuario.service'; //(De carpeta Services min 29.21 parte 7)
//Importar el servicio de utilida donde esta (para manejar la sesion)
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  //Variables min 19.56 parte 9
  formularioLogin: FormGroup;
  //Para ocultar la contraseña bool = true
  ocultarPassword: boolean = true;
  //Mostrar un loading
  mostrarLoading: boolean = false;

  //Inyectar las dependencias en el constructor min 20.43 parte 9
  constructor(
    //Para construir los campos dentro del formulario
    private fb: FormBuilder,
    //Para redireccionar
    private router: Router,
    //Hacer uso de usuario servicio (de tipo UsuarioService)
    private _usuarioServicio: UsuarioService,
    //HAciendo uso de UtilidadService (de tipo UtilidadService)
    private _utilidadServicio: UtilidadService
  ) {
    //min 21.47 parte 9
    //Para solucionar el error de formularioLogin(ya que recibe un grupo de campos)
    this.formularioLogin = this.fb.group({
      email: ['', Validators.required], //Recibe correo dicho val inicial será 0
      password: ['', Validators.required], //Recibe correo dicho val inicial será 0
    });
  }

  //Crear un método que permite iniciar sesion min 22.54 parte 9
  iniciarSesion() {
    //Se va a ejecutar cuando el usuario haga click en el btn ingresar
    //Se muestra la animación de carga
    this.mostrarLoading = true;

    //Modelo que se va a enviar a la api para la validación del login min 23.30 parte 9
    const request: Login = {
      //Recibe un correo del campo email (propiedad del modelo o comp login.ts (Interfaces))
      correo: this.formularioLogin.value.email,
      //Recibe una clave del campo password (propiedad del modelo o comp login.ts (Interfaces))
      clave: this.formularioLogin.value.password,
    };

    //Ejecuta este método iniciar con un rq (es necesario subscribirse para obtener la resp)
    this._usuarioServicio.IniciarSesion(request).subscribe({
      //Devuelve la respuesta en caso de ser exitoso o no
      next: (data) => {
        //Si la respuesta es true (ha encontrado un usuario con esas credenciales)
        if (data.status) {
          //status = true
          //Si existe un usuario se ejecuta el método y se guardan las credenciales en memoria del nav
          this._utilidadServicio.guardarSesionUsuario(data.value);
          //Para navegar o redirigir luego de registro exitoso (navega a la pag de inicio menu)
          this.router.navigate(['pages']);
        } else {
          //Si no existe el usuario (se muestra una alerta de error
          this._utilidadServicio.mostrarAlerta(
            'Las credenciales no coinciden con un usuario existente',
            'Opss!'
          );
        }
      },
      //Evento de complete que se ejecuta luego de una solicitud min 26.30 parte 9
      complete: () => {
        //Indica al mostrarLoading que se debe ocultar
        this.mostrarLoading = false;
      },
      //Método de error en caso de que se tenga que retornar alguno min 27.14 parte 9
      error: () => {
        this._utilidadServicio.mostrarAlerta('Ocurrio un error', 'Opss!');
      },
    });
  }
}
