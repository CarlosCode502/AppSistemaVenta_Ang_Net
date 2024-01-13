//Agregando e importando todos los componentes necesarios min 20.25 parte 11
//AfterViewInit es un evento que se ejecuta cuando un componente termina de reenderizarse
//ViewChild permite crear una instancia de algun componente de nuestro html
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
//Para poder trabajar con tablas
import { MatTableDataSource } from '@angular/material/table';
//Para la páginación de nuestra tabla
import { MatPaginator } from '@angular/material/paginator';
//Para trabajar con los dialogos
import { MatDialog } from '@angular/material/dialog';

//Agregar el modal usuario min 20.56 parte 11
import { ModalProductoComponent } from '../../Modales/modal-producto/modal-producto.component';
//La interfaz de producto (como el modelo del producto)
import { Producto } from 'src/app/Interfaces/producto';
//Servicio de producto (contiene el CRUD para el producto)
import { ProductoService } from 'src/app/Services/producto.service';
//Servicio de utilidad (para mostrar alertas y ob la sesion del usuario en min 13.32 parte 9)
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

//Agregando o utilizando SweetAlert2 (para mostrar alertas personalizadas) min 21.28 parte 11
import Swal from 'sweetalert2';
import { find } from 'rxjs';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css'],
})

//Implementar los eventos (heredar) min 21.38 parte 11
//AfterViewInit se ejecuta al terminar un elemento de renderizarse
export class ProductoComponent implements OnInit, AfterViewInit {
  //Creando variables a utilizar min 21.50 parte 11
  //Columnas que va a tener las tablas titulos min 21.59 parte 11
  //En acciones irán los botones editar/eliminar
  columnasTabla: string[] = [
    'nombreProducto',
    'categoria',
    'stock',
    'precio',
    'estado',
    'acciones',
  ];

  //Var que contiene los datos de los productos (solo para inicializar valores)
  dataInicio: Producto[] = [];

  //Fuente de datos de la tabla (de donde bienen esos datos) min 22.44 parte 11
  dataListaProductos = new MatTableDataSource(this.dataInicio);

  //Se crea una instancia para la paginacion (! es para poder inicializarlo y no sea nulo)
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  //Inyectando todas las dependencias min 23.13 parte 11
  constructor(
    //Hace referencia a matdialog para poder mostrar los modales
    private dialog: MatDialog,
    //Hace ref a prodservice
    private _productoServicio: ProductoService,
    //Ref a utilidadservice
    private _utilidadServicio: UtilidadService
  ) {}

  //Método para poder obtener todos los productos min 23.42 parte 11
  obtenenrProductos() {
    //Accedemos al productoService y obtenemos la lista
    //Con subscribe obtenemos la información del producto
    this._productoServicio.Lista().subscribe({
      //Obtiene o valida una respuesta
      next: (data) => {
        //Si la data status el correcto
        if (data.status) {
          //#-- Válida si un producto tiene stock menor o igual a cero (<= 0) 11/01/2024 18.44pm

          // for (let index = 0; index < data.value.length; index++) {
          //   const element = data.value[index];

          //   if (element.stock <= 0) {
          //     element.esActivo = 0;

          // const _producto: Producto = {
          //   //Si el id producto es nulo será cero sino va a ser el id del reg obtenido
          //   idProducto: data.value.idProducto,
          //   //Asigna el valor a la propiedad NP desde el formulario y el campo nombre producto
          //   //Propiedad: obtiene del formulario el valor del campo (igual para los demás)
          //   nombreProducto: data.value.nombreProducto,
          //   idCategoria: data.value.idCategoria,
          //   //No necesitamos asignar un descCategoria por ahora
          //   descripcionCategoria: data.value.descripcionCategoria,
          //   //Se cambio a string (se evita el error bad request 400) BAD REQUEST
          //   //The JSON value could not be converted to System.String. Path: $.precio
          //   precio: data.value.precio,
          //   stock: data.value.stock <= 0 ? '0' : data.value.stock,
          //   //Recibe un int y se manda un string (necesita conversion) min 12.01 parte 11
          //   esActivo: data.value.esActivo === true ? 1 : 0,
          // };

          // console.log(_producto);
          //   // this.editarProducto(_producto);
          // } else {
          //   element.esActivo = 1;
          // }
          //   data.value[index] = element;
          // }

          //Accede a la lista o fuente de datos y se le asigna el valor de la lista obtenidos
          this.dataListaProductos.data = data.value; //Actualiza la fuente

          // this.ngOnInit();
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
      //En caso contrario se muestra un error min 24.12 parte 11
      error: (e) => {},
    });
  }

  //Evento para cuando se muestra el componente o inicia min 24.24 parte 11
  ngOnInit(): void {
    //Cuando se muestra se ejecuta este método para obtener todos los productos
    this.obtenenrProductos();
  }

  //Crear el evento del componente AfterViewInit para la páginacion min 24.39 parte 11
  ngAfterViewInit(): void {
    //Accedemos a la fuente de datos con el método paginator y se le asigna
    //se crea una nueva instancia que va a contener el valor de la páginacion
    this.dataListaProductos.paginator = this.paginacionTabla;
  }

  //Método que permite aplicar los filtros a la tabla cuando se esta realizando una búsqueda min 24.51 parte 11
  //Recibe un evento
  aplicarFiltroTabla(event: Event) {
    //Obtiene el valor del filtro desde de un imput de tipo HTML
    const filterValue = (event.target as HTMLInputElement).value;
    //Aplica los filtros solo a la fuente de datos de los usuarios
    //Se usa trim(para eliminar espacios al inicio y fin) además todo el texto sera en minúsculas
    this.dataListaProductos.filter = filterValue.trim().toLocaleLowerCase();
  }

  //Método para poder abrir el modal al momento en que el usuario haga clic en el btn crear min 25.21 parte 11
  nuevoProducto(/*No recibe parametros*/) {
    //Se utiliza al dialog para que ejecute o abra el modal producto
    this.dialog
      .open(ModalProductoComponent, {
        //Para evitar que el modal se cierre si el usuario hace click fuera de este
        disableClose: true,
      })
      //Se ejecuta luego de cerrar se obtiene un resultado (que se envia en min 19.25 parte 10)
      .afterClosed()
      .subscribe((resultado) => {
        //Valida si el resultado es igual a true
        if (resultado === 'true') {
          //Se ejecuta el método obtener productos
          this.obtenenrProductos();
        }
      });
  }

  //Método para poder editar un producto al momento de hacer clic en dicho btn min 25.58 parte 11
  //Recibe como parametro un producto
  editarProducto(producto: Producto) {
    //Se utiliza al dialog para que ejecute o abra el modal producto
    this.dialog
      //Tambien puede recibir datos del producto
      .open(ModalProductoComponent, {
        //Para evitar que el modal se cierre si el usuario hace click fuera de este
        disableClose: true,
        data: producto, //Le pasamos el producto
      })
      //Se ejecuta luego de cerrar se obtiene un resultado (que se envia en min 19.25 parte 10)
      .afterClosed()
      .subscribe((resultado) => {
        //Valida si el resultado es igual a true
        if (resultado === 'true') {
          //Se ejecuta el método obtener productos (actualiza la tabla)
          this.obtenenrProductos();
        }
      });
  }

  //Método para poder eliminar un producto min 26.49 parte 11
  //Recibe un producto
  eliminarProductos(producto: Producto) {
    //Mostrar un msj de alerta con la libreria o componente Swal de Swit2 min 26.59 parte 11
    //Resultado de cuando presiona algun boton
    Swal.fire({
      //Titulo del msj
      title: '¿Desea eliminar este producto?',
      //Contenido sera el nombre del usuario
      text: producto.nombreProducto,
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
      cancelButtonText: 'No, regresar', //Fin min 27.22 parte 11
    })
      //Respuesta para cuando se presiona algun btn min 27.28 parte 11
      //Resultado va a tomar la respuesta que pasará por una serie de validaciones
      .then((resultado) => {
        //Si resultado es afirmativo o confirmado
        if (resultado.isConfirmed) {
          //Se accede al producto servicio y se ejecuta el método eliminar pasandole el idprod obtenido aqui
          this._productoServicio.Eliminar(producto.idProducto).subscribe({
            //Lo siguiente es obtener la respuesta si el estatus es correcto
            next: (data) => {
              if (data.status) {
                //Se envia una alerta de exitoso
                this._utilidadServicio.mostrarAlerta(
                  'El producto fue eliminado',
                  'Listo!'
                );
                //Luego se vuelven a cargar los productos
                this.obtenenrProductos();
              }
              //Si no es exitoso
              else {
                //Igual se muestra una alerta de que no se pudo guardar min 27.58 parte 11
                this._utilidadServicio.mostrarAlerta(
                  'No se pudo eliminar el producto',
                  'Error'
                );
              }
            },
            //Si ocurre algun error se muestra min 28.05 parte 11
            error: (e) => {},
          });
        }
      });
  }
}
