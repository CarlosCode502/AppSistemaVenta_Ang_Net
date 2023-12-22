// <!-- Creando páginas y componentes a partir del min 16.50 parte 8 -->

//Agregando o importando todos los componentes necesarios min 36.31 parte 10
//AfterViewInit es un evento que se ejecuta cuando un componente termina de reenderizarse
//ViewChild permite crear una instancia de algun componente de nuestro html
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
//Para poder trabajar con tablas
import { MatTableDataSource } from '@angular/material/table';
//Para la páginación de nuestra tabla
import { MatPaginator } from '@angular/material/paginator';
//Para trabajar con los dialogos
import { MatDialog } from '@angular/material/dialog';

//Agregar el modal usuario min 37.35 parte 10
import { ModalUsuarioComponent } from '../../Modales/modal-usuario/modal-usuario.component';
//La interfaz de usuario (como el modelo del usuario creado en min 18.54 parte 7)
import { Usuario } from 'src/app/Interfaces/usuario';
//Servicio de usuario (contiene el CRUD para el usuario del min 31.20 parte 7)
import { UsuarioService } from 'src/app/Services/usuario.service';
//Servicio de utilidad (para mostrar alertas y ob la sesion del usuario en min 13.32 parte 9)
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

//Agregando o utilizando SweetAlert2 (para mostrar alertas personalizadas) min 38.07 parte 10
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],
})

//Implementar los enventos min 38.27 parte 10
export class UsuarioComponent implements OnInit, AfterViewInit {
  //Creando las variables a utilizar min 38.32 parte 10

  //Columnas que va a tener las tablas titulos min 38.46 parte 10
  //En acciones irán los botones editar/eliminar
  columnasTabla: string[] = [
    'nombreCompleto',
    'correo',
    'rolDescripcion',
    'estado',
    'acciones',
  ];

  //Var que contiene los datos de los usuarios (solo para inicializar valores)
  dataInicio: Usuario[] = [];

  //Fuente de datos de la tabla (de donde bienen esos datos)
  dataListaUsuarios = new MatTableDataSource(this.dataInicio);

  //Se crea una instancia para la paginacion (! es para poder inicializarlo y no sea nulo)
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  //Inyectando todas las dependencias min 41.20 parte 10
  constructor(
    //Hace referencia a matdialog para poder mostrar los modales
    private dialog: MatDialog,
    //Hace ref a usuarioservice
    private _usuarioServicio: UsuarioService,
    //Ref a utilidadservice
    private _utilidadServicio: UtilidadService
  ) {}

  //Método para poder obtener los usuarios min 42.12 parte 10
  obtenenrUsuarios() {
    //Accedemos al usuarioService y obtenemos la lista
    //Con subscribe obtenemos la información del usuario
    this._usuarioServicio.Lista().subscribe({
      //Obtiene o valida una respuesta
      next: (data) => {
        //Si la data status el correcto
        if (data.status) {
          //Accede a la lista o fuente de datos y se le asigna el valor de la lista obtenidos
          this.dataListaUsuarios.data = data.value;
        }
        //En caso contrario o error
        else {
          //Accedemos al utilidad service para poder mostrar una alerta de error
          this._utilidadServicio.mostrarAlerta(
            'No se encontraron datos',
            'Oops!'
          );
        }
      },
      //En caso contrario se muestra un error min 43.37 parte 10
      error: (e) => {},
    });
  }

  //Evento para cuando se muestra el componente o inicia min 43.48 parte 10
  ngOnInit(): void {
    //Cuando se muestra se ejecuta este método para obtener todos los usuarios
    this.obtenenrUsuarios();
  }

  //Crear el evento del componente AfterViewInit para la páginacion min 44.21 parte 10
  ngAfterViewInit(): void {
    //Accedemos a la fuente de datos con el método paginator y se le asigna
    //se crea una nueva instancia que va a contener el valor de la páginacion min 44.38 parte 10
    this.dataListaUsuarios.paginator = this.paginacionTabla;
  }

  //Método que permite aplicar los filtros a la tabla cuando se esta realizando una búsqueda min 44.57 parte 10
  //Recibe un evento
  aplicarFiltroTabla(event: Event) {
    //Obtiene el valor del filtro desde de un imput de tipo HTML
    const filterValue = (event.target as HTMLInputElement).value;
    //Aplica los filtros solo a la fuente de datos de los usuarios
    //Se usa trim(para eliminar espacios al inicio y fin) además todo el texto sera en minúsculas
    this.dataListaUsuarios.filter = filterValue.trim().toLocaleLowerCase();
  }

  //Método para poder abrir el modal al momento en que el usuario haga clic en el btn crear min 46.39 parte 10
  nuevoUsuario(/*No recibe parametros*/) {
    //Se utiliza al dialog para que ejecute o abra el modal usuario
    this.dialog
      .open(ModalUsuarioComponent, {
        //Para evitar que el modal se cierre si el usuario hace click fuera de este
        disableClose: true,
      })
      //Se ejecuta luego de cerrar se obtiene un resultado (que se envia en min 19.25 parte 10)
      .afterClosed()
      .subscribe((resultado) => {
        //Valida si el resultado es igual a true
        if (resultado === 'true') {
          //Se ejecuta el método obtener usuarios
          this.obtenenrUsuarios();
        }
      });
  }

  //Método para poder editar un usuario al momento de hacer clic en dicho btn min 48.48 parte 10
  //Recibe como parametro un usuario
  editarUsuario(usuario: Usuario) {
    //Se utiliza al dialog para que ejecute o abra el modal usuario
    this.dialog
      //Tambien puede recibir datos del usuario
      .open(ModalUsuarioComponent, {
        //Para evitar que el modal se cierre si el usuario hace click fuera de este
        disableClose: true,
        data: usuario, //Le pasamos el usuario
      })
      //Se ejecuta luego de cerrar se obtiene un resultado (que se envia en min 19.25 parte 10)
      .afterClosed()
      .subscribe((resultado) => {
        //Valida si el resultado es igual a true
        if (resultado === 'true') {
          //Se ejecuta el método obtener usuarios (actualiza la tabla)
          this.obtenenrUsuarios();
        }
      });
  }

  //Método para poder eliminar un usuario min 49.47 parte 10
  //Recibe un usuario
  eliminarUsuario(usuario: Usuario) {
    //Mostrar un msj de alerta con la libreria o componente Swal de Swit2 min 50.10 parte 10
    //Resultado de cuando presiona algun boton min 52.57 parte 10
    Swal.fire({
      //Titulo del msj
      title: '¿Desea eliminar este usuario?',
      //Contenido sera el nombre del usuario
      text: usuario.nombreCompleto,
      //Icono de alerta
      icon: 'warning',
      //Color de btn
      confirmButtonColor: '#3085d6',
      //Btn confirmar
      confirmButtonText: 'Si, eliminar',
      //Mostrar btn cancelar
      showCancelButton: true,
      //Color de btn
      cancelButtonColor: '#d33',
      //Btn cancelar
      cancelButtonText: 'No, regresar', //Fin min 52.35 parte 10
    })
      //Respuesta para cuando se presiona algun btn min 52.57 parte 10
      //Resultado va a tomar la respuesta que pasará por una serie de validaciones
      .then((resultado) => {
        //Si resultado es afirmativo o confirmado
        if (resultado.isConfirmed) {
          //Se accede al usuario servicio y se ejecuta el método eliminar pasandole el idusuario obtenido aqui
          this._usuarioServicio.Eliminar(usuario.idUsuario).subscribe({
            //Lo siguiente es obtener la respuesta si el estatus es correcto
            next: (data) => {
              if (data.status) {
                //Se envia una alerta de exitoso
                this._utilidadServicio.mostrarAlerta(
                  'El usuario fue eliminado',
                  'Listo!'
                );
                //Luego se vuelven a cargar los usuarios
                this.obtenenrUsuarios();
              }
              //Si no es exitoso
              else {
                //Igual se muestra una alerta de que no se pudo guardar min 55.20 parte 10
                this._utilidadServicio.mostrarAlerta(
                  'No se pudo eliminar el usuario',
                  'Error'
                );
              }
            },
            //Si ocurre algun error se muestra min 55.34 parte 10
            error: (e) => {},
          });
        }
      });
  }
}
