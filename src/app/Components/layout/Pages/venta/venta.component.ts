// <!-- Creando páginas y componentes a partir del min 16.50 parte 8 -->
import { Component } from '@angular/core';

//Trabajar con los fórmularios reactivos min 00.52 parte 12
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//Para poder trabajar con tablas
import { MatTableDataSource } from '@angular/material/table';

//ProductoService min 01. 15 parte 12
import { ProductoService } from 'src/app/Services/producto.service';
//VentaService min 01. 24 parte 12
import { VentaService } from 'src/app/Services/venta.service';
//Para mostrar alertas y ob sesion
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

//IProducto
import { Producto } from 'src/app/Interfaces/producto';
//IVenta
import { Venta } from 'src/app/Interfaces/venta';
//DetalleVenta
import { DetalleVenta } from 'src/app/Interfaces/detalle-venta';

//Agregando o utilizando SweetAlert2 (para mostrar alertas personalizadas) min 02.02 parte 12
import Swal from 'sweetalert2';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css'],
})
export class VentaComponent {
  //Variables 02.20 parte 12
  //Va a contener un arreglo de todos los productos
  listaProductos: Producto[] = [];
  //Búsqueda
  //Los productos obtenidos por filtros se van a almacenar aquí (obtenidos de lista productos)
  listaProductoFiltro: Producto[] = [];

  //Contendrá los productos seleccionados o elegidos para la venta (del listado)
  listaProductosParaVenta: DetalleVenta[] = [];

  //Para bloquear botón registrar venta si existe alguna irregularidad
  bloquearBotonRegistrar: boolean = false;

  //El producto seleccionado al momento de una búsqueda se va a guardar aquí temporalmente luego se
  //va a guardar en listaProductosParaVenta
  productoSeleccionado!: Producto;

  //Variable tipo de pago por tarjeta o efectivo (Efectivo por defecto)
  tipodePagoPorDefecto: string = 'Efectivo';

  //Total a pagar por la cuenta  min 05.56 parte 12
  //Para que pueda ser actualizado el total en caso de quitar un producto
  totalPagar: number = 0;

  //Formulario para agregar controles extras para validar la venta
  formularioProductoVenta: FormGroup;

  //Columnas o encabezados de la tabla ventas min 06.35 parte 12
  columnasTabla: string[] = [
    'producto',
    'cantidad',
    'precio',
    'total',
    'accion',
  ];

  //Fuente de datos para la tabla ventas
  datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);

  //Método para retornar los productos por la búsqueda o filtro min 07.54 parte 12
  //Recibimos una búsqueda de tipo any
  //Este método devuelve un array de productos
  retornarProductosPorFiltro(busqueda: any): Producto[] {
    //Valida la entrada de la búsqueda
    //Si búsqeuda es una cadena de texto se va convertir todo lo ingresado a minúscula
    //En caso contrario busqueda va a ser un objeto al que accedemos a su propiedad nombreProducto convert minus
    const valorBuscado =
      typeof busqueda === 'string'
        ? busqueda.toLocaleLowerCase()
        : busqueda.nombreProducto.toLocaleLowerCase();

    //retornar la lista de productos con un filtro que coincidan con sel nombre del valor buscado min 09.51 parte 12
    return this.listaProductos.filter((item) =>
      item.nombreProducto.toLocaleLowerCase().includes(valorBuscado)
    );
  }

  //Inyección de dependencias de los componentes y servicios min 10.29 parte 12
  constructor(
    private fb: FormBuilder,
    private _productoServicio: ProductoService,
    private _ventaServicio: VentaService,
    private _utilidadService: UtilidadService
  ) {
    //Campos que va a tener el formulario de productos min 11.20 parte 12
    //Contiene el producto y la cantidad a comprar
    this.formularioProductoVenta = this.fb.group({
      producto: ['', Validators.required],
      cantidad: ['', Validators.required],
    });

    //Obtener los productos para mostrar el desplegable min 12.28 parte 12
    //Con subscribe obtenemos la información del usuario
    this._productoServicio.Lista().subscribe({
      //Obtiene o valida una respuesta
      next: (data) => {
        //Si la data corresponde a estatus se le asigna el value a listaRoles
        if (data.status) {
          //Contiene el valor de la respuesta de la api convertida como un arreglo de productos
          const lista = data.value as Producto[];

          //Obtenemos la lista de productos luego de aplicar un filtro min 13.06 parte 12
          //Si esta activo y si el stock es mayor a 0
          this.listaProductos = lista.filter(
            (p) => p.esActivo == 1 && p.stock > 0
          );
        }
      },
      //En caso contrario se muestra un error
      error: (e) => {},
    });

    //Evento que obtiene los productos cuando se realiza una búsqueda por caracter min 14.10 parte
    //Obtener el campo producto cuando cambien los valores (valueChanges)

    this.formularioProductoVenta
      .get('producto')
      ?.valueChanges.subscribe((value) => {
        //Contendrá la lista de productos que coincidan con el filtro
        //listaProductoFiltro(Se va a mostrar al usuario para que elija lo que desee)
        this.listaProductoFiltro = this.retornarProductosPorFiltro(value);
      });
  }

  //Evento para mostrar el producto seleccionado por medio del campo de búsqueda min 15.40 parte 12
  //Recibe la IProducto
  mostrarProducto(producto: Producto): string {
    //Retorna el producto y su propiedad nombre Producto
    return producto.nombreProducto;
  }

  //Evento para mostrar el precio del producto búscado

  //Evento para guardar temporalmente el producto seleccionado de la lista min 16.20 parte 12
  //Recibe un evento
  productoParaVenta(event: any) {
    //Le pasamos el objeto que se esta recibiendo
    this.productoSeleccionado = event.option.value;
  }

  //Método para agregar el producto elegido o seleccionado para proceder a la venta min 17.12 parte 12
  agregarProductoParaVenta() {
    //Representa al valor del campo cantidad del formularioProducto venta en (min 06.35 parte 12)
    const _cantidad: number = this.formularioProductoVenta.value.cantidad;
    //Representa el valor del campo precio del productoSeleccionado
    const _precio: number = parseFloat(this.productoSeleccionado.precio);
    //Representa el valor del campo total (op de cant * precio)
    const _total: number = _cantidad * _precio;
    //Contiene el total de todos los productos
    this.totalPagar = this.totalPagar + _total;

    //Actualizamos los productos seleccionados para la venta min 19.09 parte 12
    //Especificamos las propiedades correspondientes a I detalle-venta
    this.listaProductosParaVenta.push({
      idProducto: this.productoSeleccionado.idProducto,
      descripcionProducto: this.productoSeleccionado.nombreProducto,
      cantidad: _cantidad,
      precioTexto: String(_precio.toFixed(2)),
      totalTexto: String(_total.toFixed(2)),
    });

    //Actualizamos la tabla de productos vendidos (VERIFICAR) min 20.42 parte 12
    //a la tabla le mandamos los datos obtenidos arriba en (min 19.09 parte 12)
    this.datosDetalleVenta = new MatTableDataSource(
      this.listaProductosParaVenta
    );

    //Para restablecer el formulario min 21.03 parte 12
    this.formularioProductoVenta.patchValue({
      producto: '',
      cantidad: '',
    });
  }

  //Método para poder eliminar un producto seleccionado en la listaParaVenta min 21.40 parte 12
  //Recibe un modeloDetalleVenta
  eliminarProducto(detalle: DetalleVenta) {
    //Actualizamos el total a pagar restando el valor del producto eliminado
    (this.totalPagar = this.totalPagar - parseFloat(detalle.totalTexto)),
      //Se va a actualizar productosParaVenta desde el filtro
      //Se retornan los productos que no coincidan con el id del producto a eliminar
      (this.listaProductosParaVenta = this.listaProductosParaVenta.filter(
        (p) => p.idProducto != detalle.idProducto
      ));

    //Actualizamos la tabla de productos vendidos min 23.09 parte 12
    //a la tabla le mandamos los datos obtenidos arriba en (min 19.09 parte 12)
    this.datosDetalleVenta = new MatTableDataSource(
      this.listaProductosParaVenta
    );
  }

  //Método para poder registrar la venta min 23.28 parte 12
  registrarVenta() {
    //Primero se valida si existen productos para vender
    if (this.listaProductosParaVenta.length > 0) {
      //Se procederá con la venta

      //Se bloquea el botón registrar si lo presiona
      this.bloquearBotonRegistrar = true;

      //Contiene una solicitud de venta min 24.15 parte 12
      //Se va a enviar a la API este objeto
      const request: Venta = {
        //Propiedades necesarias en Venta
        tipoPago: this.tipodePagoPorDefecto,
        totalTexto: String(this.totalPagar.toFixed(2)), //Convertir y solo 2 decimales
        tblDetalleVenta: this.listaProductosParaVenta,
      };

      //Se va a registrar la venta min 25.12 parte 12
      this._ventaServicio.Registrar(request).subscribe({
        next: (response) => {
          if (response.status) {
            //Si el registro es exitoso procederemos a setear los campos min 26.03 parte 12
            this.totalPagar = 0.0;
            this.listaProductosParaVenta = [];
            //Se actualiza el origen con la lista vacía
            this.datosDetalleVenta = new MatTableDataSource(
              this.listaProductosParaVenta
            );

            //Finalmente se muestra el msj de registro venta exitoso min 26.09 parte 12
            Swal.fire({
              icon: 'success',
              title: 'Venta Realizada!',
              text: `Número de venta: ${response.value.numeroDocumento}`,
            });
          }
          //Si el status no es exitoso
          else {
            this._utilidadService.mostrarAlerta(
              'No se pudo registrar la venta',
              'Opss'
            );
          }
        },
        //Al finalizar el registro se va a desbloquear el btn registrar min 28.25 parte 12
        complete: () => {
          this.bloquearBotonRegistrar = false;
        },
        //En caso de error usar exepciones min 28.35 parte 12
        error: (e) => {},
      });
    }
  }
}
