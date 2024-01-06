//Creado con Modales/modalUsuario en min 02.07 parte 10
//Vamos a inyectar el componente (Inject) este componente permite recibir desde otro
//componente otro recurso que estemos pasando min 02.23
import { Component, Inject, OnInit } from '@angular/core';

//Trabajar con los fórmularios reactivos min 02.53
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//Para obtener datos a través de los modales (ref de dialogos y data de dialogos)
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
//Agregar la interfaz de rol
import { Rol } from 'src/app/Interfaces/rol';
//Agregamos la interfaz de usuario
import { Usuario } from 'src/app/Interfaces/usuario';

//Agregamos el servicio rol
import { RolService } from 'src/app/Services/rol.service';
//Agregamos el servicio de usuarios
import { UsuarioService } from 'src/app/Services/usuario.service';
//Agregar el sercicio de utilidad creado en: (Contiene datos del inicio de sesión min 13.32 parte 9)
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.css'],
})

//Este componente va a ser un modal por eso se le van a enviar datos min 02.31 parte 10
//Se implemento OnInit min 12.56
export class ModalUsuarioComponent implements OnInit {
  //Crear las variables min 04.29
  //Formulario para poder crear o editar el usuario
  formularioUsuario: FormGroup;
  //Para ocultar la contraseña si es true sino se muestra
  ocultarPassword: boolean = true;
  //Para cambiar el titulo de la accion que se esta realizando (creando o editando)
  tituloAccion: string = 'Agregar'; //Texto por defecto
  //Botón que contiene el titulo de la accion que se esta realizando
  botonAccion: string = 'Guardar'; //Texto por defecto
  //Contiene el listado de roles (arreglo de valor 0)
  listaRoles: Rol[] = [];

  //Agregamos las variable que se van a inicializar en el constructor min 06.30 parte 10
  constructor(
    //modalActual hace ref a que es un Modal
    private modalActual: MatDialogRef<ModalUsuarioComponent>,
    //Inyectar el componente para poder recibir los datos
    //Aquí recibimos los datos del usuario
    @Inject(MAT_DIALOG_DATA) public datosUsuario: Usuario,
    //Va a permitir crear los campos de nuestro formulario
    private fb: FormBuilder,
    //Hace ref al rol service
    private _rolServicio: RolService,
    //Ref del usuario service
    private _usuarioServicio: UsuarioService,
    //Ref a la var utilidad service
    private _utilidadServicio: UtilidadService //Fin min 08.07 parte 10
  ) {
    //Declarando campos del fórmulario min 08.12 parte 10

    //Va a contener los campos de nuestro formulario o modal
    this.formularioUsuario = this.fb.group({
      nombreCompleto: ['', Validators.required],
      correo: ['', Validators.required],
      idRol: ['', Validators.required],
      clave: ['', Validators.required],
      esActivo: ['', Validators.required],
    });

    //Modificar el texto si se esta recibiendo información del usuario min 09.45 parte 10

    //Valida si los datos del usuario son distintos a nulos
    if (this.datosUsuario != null) {
      //Se procede a reasignar el valor de esa variable
      this.tituloAccion = 'Editar';
      this.botonAccion = 'Actualizar';
    }

    //Obtener los roles para mostrar el desplegable min 11.12 parte 10
    //Con subscribe obtenemos la información del usuario
    this._rolServicio.Lista().subscribe({
      //Obtiene o valida una respuesta
      next: (data) => {
        //Si la data corresponde a estatus se le asigna el value a listaRoles
        if (data.status) {
          this.listaRoles = data.value;
          // console.log(this.listaRoles);
        }
      },
      //En caso contrario se muestra un error
      error: (e) => {},
    });
  }

  //Configurar método por defecto (aqui se utiliza) min 12.55 parte 10
  //Indica que cuando se tenga información del usuario es por que se desa editar
  //Por lo que el formulario debe corresponder a editar
  ngOnInit(): void {
    //Se ejecuta al cargar o mostrar el formulario
    if (this.datosUsuario != null) {
      //Obtiene el valor asignado en al momento de ejecutarse este método
      this.formularioUsuario.patchValue({
        nombreCompleto: this.datosUsuario.nombreCompleto,
        correo: this.datosUsuario.correo,
        idRol: this.datosUsuario.idRol,
        clave: this.datosUsuario.clave,
        esActivo: this.datosUsuario.esActivo.toString(),
      });
    }
  }

  //Método para poder crear un usuario o poder editar(ambos) min 15.01 parte 10
  guardarEditar_Usuario() {
    //Constante del tipo usuario que contiene todos los datos que recibe dicho modelo
    const _usuario: Usuario = {
      //Si el id usuario es nulo será cero sino va a ser el id del reg obtenido
      idUsuario: this.datosUsuario == null ? 0 : this.datosUsuario.idUsuario,
      //Asigna el valor a la propiedad NC desde el formulario y el campo nombre completo
      //Propiedad: obtiene del formulario el valor del campo (igual para los demás)
      nombreCompleto: this.formularioUsuario.value.nombreCompleto,
      correo: this.formularioUsuario.value.correo,
      idRol: this.formularioUsuario.value.idRol,
      //No necesitamos asignar un roldesc por ahora
      rolDescripcion: '',
      clave: this.formularioUsuario.value.clave,
      //Recibe un int y se manda un string (necesita conversion) min 17.14 parte 10
      esActivo: parseInt(this.formularioUsuario.value.esActivo),
    };

    //Válida para poder guardar el usuario min 17.53 parte 10
    //Si es igual a nulo
    if (this.datosUsuario == null) {
      //Agregando validación para inpedir que se guarde un usuario existente

      //Entonces se creará un nuevo usuario
      this._usuarioServicio.Guardar(_usuario).subscribe({
        //Ejecuta una ejecución que funciona como una respuesta o error
        next: (data) => {
          if (data.status) {
            //Luego de guardar el usuario se otendra el status (se envia el msj exitoso)
            this._utilidadServicio.mostrarAlerta(
              'El usuario fue registrado',
              'Exito'
            );
            //Luego de registrar el usuario se debera cerrar este modal
            //se envia un valor al btn que activa o muestra este formulario min 19.25 parte 10
            //Retorna el valor de true al cerrase el modal al boton que lo abre
            this.modalActual.close('true');
          } else {
            //Si no se pudo guardar entonces se mostrara una alerta de error min 20.35 parte 10
            this._utilidadServicio.mostrarAlerta(
              'No se pudo registrar el usuario',
              'Error'
            );
          }
        },
      });
      //Se ejecuta la logica para poder editar el usuario
    } else {
      //Si el usuario no es nulo es porque se editara un usuario
      //(subscribe guarda info del usuario) min 21.30 parte 10
      this._usuarioServicio.Editar(_usuario).subscribe({
        //Ejecuta una ejecución que funciona como una respuesta o error
        next: (data) => {
          if (data.status) {
            //Luego de editar el usuario se otendra el status (se envia el msj exitoso)
            this._utilidadServicio.mostrarAlerta(
              'El usuario fue editado',
              'Exito'
            );
            //Luego de editar el usuario se debera cerrar este modal
            //se envia un valor al btn que activa o muestra este formulario min 21.30 parte 10
            //Retorna el valor de true al cerrase el modal al boton que lo abre
            this.modalActual.close('true');
          } else {
            //Si no se pudo editar entonces se mostrara una alerta de error min 21.45 parte 10
            this._utilidadServicio.mostrarAlerta(
              'No se pudo editar el usuario',
              'Error'
            );
          }
        },
      });
    }
  }
}
