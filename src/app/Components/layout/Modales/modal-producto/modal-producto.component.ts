// Creado modal-producto.c.ts en min 01.15 parte 11

//Vamos a inyectar el componente (Inject) este componente permite recibir desde otro
//componente otro recurso que estemos pasando min 02.01 parte 11
import { Component, Inject, OnInit } from '@angular/core';

//Trabajar con los fórmularios reactivos min 02.10
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//Para obtener datos a través de los modales (ref de dialogos y data de dialogos)
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

//Importar algunas otras interfaces que vamos a utilizar en producto min 02.12 parte 11
//ICategoria
import { Categoria } from 'src/app/Interfaces/categoria';
//IProducto
import { Producto } from 'src/app/Interfaces/producto';
//Para obtener listado de categorias
import { CategoriaService } from 'src/app/Services/categoria.service';
//Pata obtener listado de productos
import { ProductoService } from 'src/app/Services/producto.service';
//Utilidad para mostrar alertas y obtener la sesion del usuario
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

@Component({
  selector: 'app-modal-producto',
  templateUrl: './modal-producto.component.html',
  styleUrls: ['./modal-producto.component.css'],
})
export class ModalProductoComponent implements OnInit {
  //Crear las variables min 03.02 parte 11
  //Contiene los campos o controles del form para producto
  formularioProducto: FormGroup;
  //Para cambiar el titulo de la accion que se esta realizando (creando o editando)
  tituloAccion: string = 'Agregar'; //Texto por defecto
  //Botón que contiene el titulo de la accion que se esta realizando
  botonAccion: string = 'Guardar'; //Texto por defecto
  //El producto estará ligado a categorias por lo que debe existir un DList min 03.37 parte 11
  listaCategorias: Categoria[] = [];

  //Agregamos las variable que se van a inicializar en el constructor min 04.09 parte 11
  //Inyección de dependencias
  constructor(
    //Modal para poder agregar productos (modalDeProductos)
    private modalActual: MatDialogRef<ModalProductoComponent>,
    //Inyectar el componente para poder recibir los datos
    //Aquí recibimos los datos del producto
    @Inject(MAT_DIALOG_DATA) public datosProducto: Producto,
    //Va a permitir crear los campos de nuestro formulario
    private fb: FormBuilder,
    //Agregar una def para la categoriaService min 04.48 parte 11
    private _categoriaServicio: CategoriaService,
    //Def para productoService
    private _productoServicio: ProductoService,
    //Def para utilidadService min 05.11 parte 11
    private _utilidadServicio: UtilidadService
  ) {
    //Campos que va a contener el formulario de Productos min 05.33 parte 11
    this.formularioProducto = this.fb.group({
      nombreProducto: ['', Validators.required],
      idCategoria: ['', Validators.required],
      stock: ['', Validators.required],
      precio: ['', Validators.required],
      esActivo: ['1', Validators.required], //Se definio 1 por defecto (VERIFICAR)
    });

    //Modificar el texto si se esta recibiendo información del producto min 06.47 parte 11
    //Valida si los datos del producto son distintos a nulos
    if (this.datosProducto != null) {
      //Se procede a reasignar el valor de esa variable
      this.tituloAccion = 'Editar';
      this.botonAccion = 'Actualizar';
    }

    //Obtener el listado de categorias para mostrar el desplegable min 07.10 parte 11
    //Con subscribe obtenemos la información del producto
    this._categoriaServicio.Lista().subscribe({
      //Obtiene o valida una respuesta
      next: (data) => {
        //Si la data corresponde a estatus se le asigna el value a listaCategorias
        if (data.status) this.listaCategorias = data.value; //Setea los valores al array
      },
      //En caso contrario se muestra un error
      error: (e) => {},
    });
  }

  //Para resetera los campos si existe información en la variable productos min 07.51 parte 11
  //Indica que cuando se tenga información del producto es por que se desa editar
  //Por lo que el formulario debe corresponder a editar
  ngOnInit(): void {
    //Se ejecuta al cargar o mostrar el modal
    //Si el modal con los campos datos productos es distinto a nulo
    if (this.datosProducto != null) {
      //Entonces asignar estos valores
      this.formularioProducto.patchValue({
        nombreProducto: this.datosProducto.nombreProducto,
        idCategoria: this.datosProducto.idCategoria,
        stock: this.datosProducto.stock,
        precio: this.datosProducto.precio,
        esActivo: this.datosProducto.esActivo.toString(),
      }); //fin min 08.59 parte 11
    }
  }

  //Método para poder crear un producto o poder editar(ambos) min 09.53 parte 11
  guardarEditar_Producto() {
    //Constante del tipo producto que contiene todos los datos que recibe dicho modelo
    const _producto: Producto = {
      //Si el id producto es nulo será cero sino va a ser el id del reg obtenido
      idProducto:
        this.datosProducto == null ? 0 : this.datosProducto.idProducto,
      //Asigna el valor a la propiedad NP desde el formulario y el campo nombre producto
      //Propiedad: obtiene del formulario el valor del campo (igual para los demás)
      nombreProducto: this.formularioProducto.value.nombreProducto,
      idCategoria: this.formularioProducto.value.idCategoria,
      //No necesitamos asignar un descCategoria por ahora
      descripcionCategoria: '',
      //Se cambio a string (se evita el error bad request 400) BAD REQUEST
      //The JSON value could not be converted to System.String. Path: $.precio
      precio: this.formularioProducto.value.precio.toString(),
      stock: this.formularioProducto.value.stock,
      //Recibe un int y se manda un string (necesita conversion) min 12.01 parte 11
      esActivo: parseInt(this.formularioProducto.value.esActivo),
    };

    //Válida para poder guardar el producto min 12.12 parte 11
    //Si es igual a nulo es porque se va a guardar
    if (this.datosProducto == null) {
      //Entonces se creará un nuevo producto
      this._productoServicio.Guardar(_producto).subscribe({
        //Ejecuta una ejecución que funciona como una respuesta o error
        next: (data) => {
          if (data.status) {
            //Luego de guardar el producto se otendra el status (se envia el msj exitoso)
            //Se muestra el msj a través del utilidad service
            this._utilidadServicio.mostrarAlerta(
              'El producto fue registrado',
              'Exito'
            );
            //Luego de registrar el producto se debera cerrar este modal
            //se envia un valor al btn que activa o muestra este formulario min 12.54 parte 11
            //Retorna el valor de true al cerrase el modal al boton que lo abre
            this.modalActual.close('true');
          } else {
            //Si no se pudo guardar entonces se mostrara una alerta de error min 12.58 parte 11
            this._utilidadServicio.mostrarAlerta(
              'No se pudo registrar el producto',
              'Error'
            );
          }
        },
        error: (e) => {}, //Muestra error agregado min 13.05 parte 11
      });
      //Se ejecuta la logica para poder editar el producto (datos producto no es nulo)
    } else {
      //Si el producto no es nulo es porque se editara un producto
      //(subscribe guarda info del producto) min 13.11 parte 11
      this._productoServicio.Editar(_producto).subscribe({
        //Ejecuta una ejecución que funciona como una respuesta o error
        next: (data) => {
          if (data.status) {
            //Luego de editar el producto se otendrá el status (se envia el msj exitoso)
            this._utilidadServicio.mostrarAlerta(
              'El producto fue editado',
              'Exito'
            );
            //Luego de editar el usuario se debera cerrar este modal
            //se envia un valor al btn que activa o muestra este formulario min 13.19 parte 11
            //Retorna el valor de true al cerrase el modal al boton que lo abre
            this.modalActual.close('true');
          } else {
            //Si no se pudo editar entonces se mostrara una alerta de error min 13.25 parte 11
            this._utilidadServicio.mostrarAlerta(
              'No se pudo editar el producto',
              'Error'
            );
          }
        },
        error: (e) => {}, //Muestra error agregado min 13.05 parte 11
      });
    }
  }
}
