// <!-- Creando páginas y componentes a partir del min 16.50 parte 8 -->
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';

//Trabajar con los fórmularios reactivos min 00.52 parte 12
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//Para obtener datos a través de los modales (ref de dialogos y data de dialogos)
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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

//#-- Agregando componente para poder copiar el numero de doc a portapapeles 15/01/2024 19.03pm
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css'],
})
export class VentaComponent implements OnInit {
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
  //Al principio es nulo por eso (!)
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
    'acciones',
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
    private _utilidadService: UtilidadService,
    //#--Agremos un campo dentro del constructor para hacer referencia a Clipboard 15/01/2024 19.06pm
    private _clipboard: Clipboard
  ) {
    //Campos que va a tener el formulario de productos min 11.20 parte 12
    //Contiene el producto y la cantidad a comprar
    this.formularioProductoVenta = this.fb.group({
      producto: ['', Validators.required],
      cantidad: ['', Validators.required],
    });

    //#-- Ejecutamos el método obtener productos activos y con stock 07/01/2024 07.42pm
    this.obtenerProductosActivosYStockMayorACero();

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

  //#-- Se ejecuta al iniciar  12/01/2024 19.26pm
  ngOnInit(): void {
    //#-- Es necesario volver a obtener los productos 12/01/2024 19.26pm
    this.obtenerProductosActivosYStockMayorACero();
  }

  //#-- Se creo este método para obtener todos los productos se podra llamar luego de agregar 07/01/2024 07.41pm
  //#-- (No se debe quitar sino no se cargan los productos) 08/01/2024 08.47am
  obtenerProductosActivosYStockMayorACero() {
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
  }

  //Evento para mostrar el producto seleccionado por medio del campo de búsqueda min 15.40 parte 12
  //Recibe la IProducto
  mostrarProducto(producto: Producto): string {
    //Retorna el producto y su propiedad nombre Producto
    return producto.nombreProducto;
  }

  //Evento para guardar temporalmente el producto seleccionado de la lista min 16.20 parte 12
  //Recibe un evento
  productoParaVenta(event: any) {
    //Le pasamos el objeto que se esta recibiendo
    this.productoSeleccionado = event.option.value;
  }

  //Método para agregar el producto elegido o seleccionado para proceder a la venta min 17.12 parte 12
  agregarProductoParaVenta() {
    //#-- Válida si se selecciono un producto (sino sera indefinido) 15/01/2024 15.22pm
    if (
      this.productoSeleccionado === null ||
      this.productoSeleccionado === undefined
    ) {
      this._utilidadService.mostrarAlerta(
        'Seleccione un producto para vender.',
        'Error!'
      );
    } else {
      //#-- Contiene el id del producto seleccionado 14/01/2024 15.51
      let _idProducto: number = this.productoSeleccionado.idProducto;

      //#-- Obtenemos los datos del producto seleccionado 08/01/2024
      //Representa al valor del campo cantidad del formularioProducto venta en (min 06.35 parte 12)
      let _cantidad: number = this.formularioProductoVenta.value.cantidad;
      //Representa el valor del campo precio del productoSeleccionado
      let _precio: number = parseFloat(this.productoSeleccionado.precio);
      //Representa el valor del campo total (op de cant * precio)
      let _total: number = _cantidad * _precio;
      //Contiene el total de todos los productos
      this.totalPagar = this.totalPagar + _total;

      //#-- Válida si el total a pagar es menor o igual que cero 14/01/2024 18.05 pm
      //#-- En caso de que el usuario agregué números negativos o cero
      if (this.totalPagar <= 0) {
        //#-- Se va a bloquear el btn registrar venta
        this.bloquearBotonRegistrar = true;
        //#-- El total pasará a ser 0 (si es negativo)
        this.totalPagar = 0;
        //#-- El liistado de productos se reseteara (Al llegar el total a 0 se queda el prod) pero se bloquea el reg
        this.listaProductosParaVenta = [];
      } else {
        //#-- En caso de que el total sea mayor a 0 se habilita el btn registrar 14/01/2024
        //#-- Y se ejecutan todas las válidaciones
        this.bloquearBotonRegistrar = false;

        //#-- Al agregar el producto se válida si la cantidad es mayor al stock dispon
        // //#-- Valida si la cantidad del producto seleccionado no es mayor al stock actual 07/01/2024 18.57 pm
        // //#-- Si la cantidad es menor al producto en stock se seguíra con la venta 07/01/2024 18.57 pm
        if (_cantidad <= this.productoSeleccionado.stock) {
          //#-- Falta válidar si un id dentro del listado es igual al de prod selec 14/01/2024 16.55
          //#-- Devuelve true si el producto seleccionado se encuentra en la listaproductosparaventa
          if (
            this.listaProductosParaVenta.find(
              (p) => p.idProducto === this.productoSeleccionado.idProducto
            )
          ) {
            //#-- Recorre el array de objetos y a través de una validación 14/01/2024 15.51 pm
            //#-- se cambian las propiedades de los elementos exitentes en listaproductosparaventa
            this.listaProductosParaVenta.map(function (dato) {
              //#-- Si el id del producto que se encuentra en el listado es igual al del producto seleccionado
              //Para agregarlo
              if (dato.idProducto === _idProducto) {
                //#-- Si es afirmativo se sobrescribe la cantidad (la anterior existente por la nueva ingresada)
                dato.cantidad = dato.cantidad + _cantidad;
                //#-- Obtiene el valor de la op multiplicacion entre la cantidad de productos por precio unitario
                let obTotalTexto = dato.cantidad * _precio;
                //#-- Total texto por producto (se usa la var obTotalTexto y se formatea para mostrar solo 2 decimal)
                dato.totalTexto = obTotalTexto.toFixed(2);
              }
              //#-- Se retorna el nuevo listado (se sobrescribe)
              return dato;
            });

            // console.log('2');
            // console.log(this.listaProductosParaVenta);
          }
          //#-- En caso de que el id no coincida con uno exitente es porque se va a agregar un nuevo producto
          else {
            //Actualizamos los productos seleccionados para la venta min 19.09 parte 12
            //Especificamos las propiedades correspondientes a I detalle-venta
            this.listaProductosParaVenta.push({
              idProducto: this.productoSeleccionado.idProducto,
              descripcionProducto: this.productoSeleccionado.nombreProducto,
              cantidad: _cantidad,
              precioTexto: String(_precio.toFixed(2)),
              totalTexto: String(_total.toFixed(2)),
            });
          }

          //Actualizamos la tabla de productos para la venta min 20.42 parte 12
          //Agremos el nuevo producto o mostramos el modificado en (min 19.09 parte 12)
          this.datosDetalleVenta = new MatTableDataSource(
            this.listaProductosParaVenta
          );

          //#-- Itera cada uno de los elementos del arreglo 15/01/2024 12.18pm
          //#-- Como ya se válido que la cantidad ingresada no es menor al stock existente
          //#-- Luego se sobrescribe el arreglo y se resta la cantidad ingresada
          this.listaProductoFiltro.map(function (data) {
            data.stock = data.stock - _cantidad;

            return data;
          });

          //Para restablecer los campos del formulario min 21.03 parte 12
          this.formularioProductoVenta.patchValue({
            producto: '',
            cantidad: '',
          });

          //#--Hace que el producto ya no se muestre seleccionado al agregarl a listaprodparaventa 12/01/24 18.1
          //#--Si se elimina se muestra seleccionado luego de unos seg se resetea 12/01/24 19.32pm
          // this.listaProductoFiltro = [];
        }
        //#-- Si cantidad ingresada es mayor al stock del producto se muestra un msj de alerta 07/01/2024
        else {
          if (this.productoSeleccionado.stock === 0) {
            //#-- Alerta que se muestra si la cantidad es mayor al stock de ese producto
            Swal.fire({
              icon: 'error',
              title: 'Agotado',
              text: `¡Este producto se encuentra agotado!`,
              // color: 'skyblue',
            });
          } else {
            //#-- Alerta que se muestra si la cantidad es mayor al stock de ese producto
            Swal.fire({
              icon: 'warning',
              title: 'Producto con pocas unidades',
              text: `Solo quedan ${this.productoSeleccionado.stock} en stock.`,
              // color: 'skyblue',
            });
          }

          //#-- Verificamos si no existe algun otro producto en el listado paraventa 08/01/2024 09.30pm
          if (this.listaProductosParaVenta.length < 0) {
            //#-- Restablecemos el valor de los campos
            _cantidad = 0;
            _precio = 0;
            _total = 0;
            this.totalPagar = 0;
          }
          //#Sino solo se resta el total de productos a pagar
          else {
            this.totalPagar = this.totalPagar - _total;
          }
        }
      }
    }
  }

  //Método para poder registrar la venta min 23.28 parte 12
  registrarVenta() {
    //#-- Antes de registrar la venta se verifica si la cantidad de productos no superan el stock 14/01/2024 18.28pm

    // //#-- Todos los productos
    // let productoYStock: any[] = [];
    // this.listaProductos.forEach((element) => {
    //   productoYStock = [element.idProducto, element.stock];
    // });

    // const pI = productoYStock.map((v) => v.idProducto);
    // const pS = productoYStock.map((v) => v.stock);
    // console.log('Producto y Stock');
    // console.log(pI, pS);

    // //#-- Productos listaparaventa
    // let productosYCantidad: any[] = [];
    // this.listaProductosParaVenta.forEach((element2) => {
    //   productosYCantidad = [element2.idProducto, element2.cantidad];
    // });

    // console.log('Producto y Cantidad');
    // console.log(productosYCantidad);

    // this.listaProductos

    //Primero se valida si existen productos para vender
    if (this.listaProductosParaVenta.length > 0) {
      //Se procederá con la venta

      //     //#-- Recorrer todos los elementos de listadoparaventa (iterar) 15/01/2024 10.29am
      // for (
      //   let index = 0;
      //   index < this.listaProductosParaVenta.length;
      //   index++
      // ) {
      //   const element = this.listaProductosParaVenta[index];

      //   //#-- Si la listaProductos idProducto coincide con un id de listaparaventa 15/01/2024 10.29am
      //   if (
      //     this.listaProductos.find((p) => p.idProducto === element.idProducto)
      //   ) {
      //     //Se válida si la cantidad de stock es mayor a la cantidad ordenada
      //     if (this.listaProductos.find((p) => p.stock < element.cantidad)) {
      //       // const obtIndice = this.listaProductos.indexOf(this.listaProductos)

      //       //#-- Alerta que se muestra si la cantidad es mayor al stock de ese producto
      //       Swal.fire({
      //         icon: 'warning',
      //         title: 'Producto con pocas unidades',
      //         text: `Solo quedan pocos en stock.`,
      //         // color: 'skyblue',
      //       });
      //     } else {

      //     }
      //   }
      // }

      //Se bloquea el botón registrar si lo presiona
      this.bloquearBotonRegistrar = true;

      //Contiene una solicitud de venta min 24.15 parte 12
      //Se va a enviar a la API este objeto
      let request: Venta = {
        //Propiedades necesarias en Venta
        tipoPago: this.tipodePagoPorDefecto,
        totalTexto: String(this.totalPagar.toFixed(2)), //Convertir y solo 2 decimales
        tblDetalleVenta: this.listaProductosParaVenta,
      };

      //#-- Verificamos si existe un producto con el mismo id 12/01/2024 17.07pm
      //#-- Si existe obtenemos la cantidad de los productos en listaproductosparaventa
      //#-- Válidamos si la cantidad no es mayor al stock del producto
      // const sumaProductosde

      //#-- Verificamos si dentro de la lista productos para la venta existe un producto que dicha
      //cantidad supere a la que se encuentra en stock
      // if(this.listaProductosParaVenta.find(c => c.cantidad && this.listaProductos.find(p => p.stock)))

      //Se va a registrar la venta min 25.12 parte 12
      this._ventaServicio.Registrar(request).subscribe({
        next: (response) => {
          //#-- Contiene los datos de la venta ParaLaFactura 15/01/2024 11.57am
          console.log(response.value);

          if (response.status) {
            //Si el registro es exitoso procederemos a setear los campos min 26.03 parte 12
            this.totalPagar = 0.0;
            this.listaProductosParaVenta = [];
            //Se actualiza el origen con la lista vacía
            this.datosDetalleVenta = new MatTableDataSource(
              this.listaProductosParaVenta
            );

            //#-- Var para almacenar el númeroDocumento 15/01/2024 19.20 pm
            const textoCopiar = response.value.numeroDocumento;
            // console.log(textoCopiar);
            // this.copiarTexto(textoCopiar);

            //#-- Se modifico el contenido de la alerta 15/01/2024 19.39 pm
            //#-- Para permitir al usuario copiar el número de doc para la venta
            //Finalmente se muestra el msj de registro venta exitoso min 26.09 parte 12
            Swal.fire({
              icon: 'success',
              // title: 'Venta Realizada!',
              // text: `Número de venta: ${response.value.numeroDocumento}`,
              //#-- Se puede agregar una estructura html para mostrar contenido
              html: `<h1>Venta Realizada!</h1>
              <p>Número de venta: <strong> ${response.value.numeroDocumento} </strong></p>`,
              //#-- Mostrar y modificar botones
              showCancelButton: true,
              confirmButtonText: 'Aceptar',
              cancelButtonColor: '#2ecc71',
              cancelButtonText: 'Copiar',
              //#-- Entonces se válida la opcion elegida 15/01/2024 19.46 pm
            }).then((r) => {
              //#-- Si el resultado es distinto (se presiono el btn cancelar)
              //#-- Si se presiona aceptar solo se cierra la ventana
              if (!r.value) {
                //#-- Se ejecuta el método pasandole como parametro el texto a copiar
                this.copiarTexto(textoCopiar);

                //#-- Se muestra una alerta indicando que se copió el texto
                this._utilidadService.mostrarAlerta(
                  'El número de venta se copió en el portapapeles',
                  'Copiado!'
                );
              }
            });

            //Para restablecer el formulario min 21.03 parte 12
            this.formularioProductoVenta.patchValue({
              producto: '',
              cantidad: '',
            });

            // this.listaProductos = [];
            // this.obtenerProductosActivosYStockMayorACero();
            // const texto: string = '';
            // this.retornarProductosPorFiltro(texto);
            //#-- Agregado msj 12/01/24 19.32pm
            //Evento que obtiene los productos cuando se realiza una búsqueda por caracter min 14.10 parte
            //Obtener el campo producto cuando cambien los valores (valueChanges)
            // this.formularioProductoVenta
            //   .get('producto')
            //   ?.valueChanges.subscribe((value) => {
            //     // Contendrá la lista de productos que coincidan con el filtro
            //     // listaProductoFiltro(Se va a mostrar al usuario para que elija lo que desee)
            //     // this.listaProductoFiltro = this.retornarProductosPorFiltro(this.onInit());
            //     this.ngOnInit();
            //   });
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
          // this.obtenerProductosActivosYStockMayorACero();
        },
        //En caso de error usar exepciones min 28.35 parte 12
        error: (e) => {},
      });
    }
  }

  //#-- Se agrego el método copiar texto que recibe como parametro un string con el texto 15/01/2024 19.44
  copiarTexto(textoACopiar: string) {
    //#-- Hace uso del componente Clipboar y el método copy recibiendo el texto a copiar
    this._clipboard.copy(textoACopiar);
  }

  //Método para poder eliminar un producto seleccionado en la listaParaVenta min 21.40 parte 12
  //Recibe un modeloDetalleVenta
  eliminarProducto(detalle: DetalleVenta) {
    // OBTENER LA POSICION DEL PRODUCTO SELECCIONADO DE LISTAPRODUCTOSPARAVENTE
    // Y DEVOLVER EL LISTADO QUITANDO ESA POSICION 11/01/2024 21.35PM
    //obtiene la posición del elemento
    // console.log(this.listaProductosParaVenta);
    // const indiceElemento = this.listaProductosParaVenta.indexOf(detalle);
    // console.log('El indice del elemento seleccionado es: ', indiceElemento);

    //#-- Válida si existe un producto con el mismo id 14/01/2024 13.34
    // if(indiceElemento != -1){

    // }
    // this.listaProductosParaVenta.forEach(element => {
    //   if(element.idProducto === detalle.idProducto){

    //   }
    // });

    // let cantidadDeVeces = 0;

    //#-- Obtener la cantidad de veces que se repite un producto en la lista
    // this.listaProductosParaVenta.forEach((value) => {
    //   if (value == detalle) {
    //     cantidadDeVeces++;
    //   }

    //   console.log(value.descripcionProducto, 'Se repite ', cantidadDeVeces);
    // });

    //#-- Agregado 15/01/2024 15.50
    // console.log('La lista para vender es:');
    // console.log(this.listaProductosParaVenta);

    // console.log('El producto a eliminar es:');
    // console.log(detalle);

    //#-- modificado 12/01/24 12.16pm
    //Actualizamos el total a pagar restando el valor del producto eliminado
    this.totalPagar = this.totalPagar - parseFloat(detalle.totalTexto);

    //Se va a actualizar productosParaVenta desde el filtro
    //Se retornan los productos que no coincidan con el id del producto a eliminar
    this.listaProductosParaVenta = this.listaProductosParaVenta.filter(
      (p) => p.idProducto != detalle.idProducto
    );

    //#-- Itera cada elemento del listado para vender 15/01/2024 15.33
    //#--Se obtiene a tavés de un filtro solo los activos o con stock > 0
    this.listaProductoFiltro.map(function (restablecer) {
      //#-- Se compara cada elemento del arreglo si coincide con el id del producto seleccionado
      if (restablecer.idProducto === detalle.idProducto) {
        //#-- Se cambia su valor de stock + la cantidad del producto a eliminar
        //#-- Que es la cantidad que tenía anteriormente
        restablecer.stock = restablecer.stock + detalle.cantidad;
      }
    });

    //#-- El nuevo valor del array sera menos el indice del elemento seleccionado 14/01/2024 12.33
    //#-- El producto seleccionado es el único que queda
    //#-- Los iguales se quitan
    // this.listaProductosParaVenta = this.listaProductosParaVenta.splice(
    //   indiceElemento,
    //   indiceElemento
    // );
    // this.listaProductosParaVenta = this.listaProductosParaVenta.splice(
    //   indiceElemento,
    //   1
    // );

    // let contador = {};

    // this.listaProductosParaVenta.forEach((n) => {
    //   n.idProducto == detalle.idProducto === true ? '': ''
    // });

    // console.log('El nuevo valor es:');
    // console.log(this.listaProductosParaVenta);

    // for (let index = 0; index < this.listaProductosParaVenta.length; index++) {
    //   const element = this.listaProductosParaVenta[index];

    //   if(element. != indiceElemento )

    // }

    //Si la cantidad de elementos de la listaProductos para venta es menor o igual a cero
    //Restablecemos el valor del campo
    if (this.listaProductosParaVenta.length <= 0) {
      //El total a pagar sera cero
      this.totalPagar = 0;
    }

    //Actualizamos la tabla de productos vendidos min 23.09 parte 12
    //a la tabla le mandamos los datos obtenidos arriba en (min 19.09 parte 12)
    this.datosDetalleVenta = new MatTableDataSource(
      this.listaProductosParaVenta
    );

    // console.log('La lista para vender ahora es:');
    // console.log(this.listaProductosParaVenta);
  }
}
