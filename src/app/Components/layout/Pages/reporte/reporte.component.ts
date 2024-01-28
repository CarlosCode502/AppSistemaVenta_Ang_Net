//Agregando e importando todos los recursos necesarios min 0.31 parte 14
//AfterViewInit es un evento que se ejecuta cuando un componente termina de reenderizarse
//ViewChild permite crear una instancia de algun componente de nuestro html
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
//Trabajar con los fórmularios reactivos min 16.10 parte 13
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//Para poder trabajar con tablas
import { MatTableDataSource } from '@angular/material/table';
//Para la páginación de nuestra tabla
import { MatPaginator } from '@angular/material/paginator';

//Esto nos va a permitir trabajar con formatos de fechas min 0.52 parte 14
import { MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
//Para las fechas
import * as moment from 'moment';

//Para poder importar a exel
import * as XLSX from 'xlsx';

//Recussos de nuestras clases min 01.38 parte 13
import { Reporte } from 'src/app/Interfaces/reporte';
import { VentaService } from 'src/app/Services/venta.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

//Configurando el formato de fecha que se va a utilizar min 02.00 parte 14
export const MY_DATA_FORMATS = {
  //Parseo de fecha de entrada 'Dia/Mes/Año'
  parse: {
    dateinput: 'DD/MM/YYYY',
  },
  //Como vamos a recibir las fechas 'Dia/Mes/Año'
  display: {
    dateinput: 'DD/MM/YYYY',
    //Como se va a mostrar en el calendario min 19.04 parte 13
    monthYearLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css'],
  //Agregamos a este componente un proveedor para servicio de fecha min 02.40 parte 14
  providers: [
    {
      provide: MAT_DATE_FORMATS,
      useValue: MY_DATA_FORMATS,
    },
  ],
})
export class ReporteComponent {
  //Creamos las variables a utilizar 02.41 parte 14
  //#-- Para obtener el importe 26/01/2024 22.27 pm
  obtenerImporteVar: number = 0;

  //#-- Se cambio el valor para detectar si existe un filtro 27/01/2024 16.02 pm
  filterValue: string = '';

  //Contiene los campos de busqueda
  formularioFiltro: FormGroup;
  //Modelo de la fuente de datos
  listaVentasReporte: Reporte[] = [];
  //Columnas que va a contener nuestra tabla reporte
  columnasTabla: string[] = [
    'fechaRegistro',
    'numeroVenta',
    'producto',
    'cantidad',
    'precio',
    'totalProducto',
    'tipoPago',
    'total',
  ];
  //Prueba con any valor y descripcion
  // columnasTabla: any[] = [
  //   { value: 'fechaRegistro', descripcion: 'Fecha de Registro' },
  //   { value: 'numeroVenta', descripcion: 'Número de Documento' },
  //   { value: 'producto', descripcion: 'Producto' },
  //   { value: 'cantidad', descripcion: 'Cantidad' },
  //   { value: 'precio', descripcion: 'Precio' },
  //   { value: 'totalProducto', descripcion: 'Total de Productos' },
  //   { value: 'tipoPago', descripcion: 'Tipo de Pago' },
  //   { value: 'total', descripcion: 'Total neto' },
  // ];

  //Fuente de datos de la tabla
  dataTableVentaReporte = new MatTableDataSource(this.listaVentasReporte);

  //Para agregar la paginación min 04.40 parte 14
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  //Inyectar las dependencias min 04.59 parte 14
  constructor(
    //Construccion de formularios
    private fb: FormBuilder,
    //Utilizar los servicos
    private _ventaService: VentaService,
    //Mostrar alertas
    private _utilidadService: UtilidadService
  ) {
    //Agregar campos del formulario para buscar o filtrar min 05.36 parte 14
    this.formularioFiltro = this.fb.group({
      //Si este campo se mantiene en fecha se búscara por fecha
      //Campos que son requeridos
      fechaInicio: ['2024-01-26T00:00:00-06:00', Validators.required],
      fechaFin: ['2024-01-27T00:00:00-06:00', Validators.required],
    });
  }

  //Método que permite aplicar los filtros a la tabla cuando se esta realizando una búsqueda arte 14
  //Recibe un evento
  aplicarFiltroTabla(event: Event) {
    //Obtiene el valor del filtro desde de un imput de tipo HTML
    this.filterValue = (event.target as HTMLInputElement).value;
    //Aplica los filtros solo a la fuente de datos de las ventas
    //Se usa trim(para eliminar espacios al inicio y fin) además todo el texto sera en minúsculas
    this.dataTableVentaReporte.filter = this.filterValue.trim();
    //No devolvia el producto ni tipo pago ya que hacia un to lower a los textos
    // .toLocaleLowerCase();
    // this.datosListaVentas.paginator = this.paginacionTabla;

    //#-- Establece el importe a 0 ya que se requiere un filtro 26/01/2024 22.54pm
    this.obtenerImporteVar = 0;

    // console.log(this.dataTableVentaReporte.filter);
  }

  //Crear el evento del componente AfterViewInit para la páginacion min 06.17 parte 14
  ngAfterViewInit(): void {
    //Se especifica la fuente de datos y la paginacion hacia esta
    this.dataTableVentaReporte.paginator = this.paginacionTabla;
  }

  //Método para poder realizar la búsqueda segun un rango especifico min 06.32 parte 14
  buscarVentasReporte() {
    //#-- Limpiar el área de filtro 27/01/2024 19.32pm

    //Utilizando moment para convertir a fecha con formato
    //Primero se obtiene el valor luego se encapsula con moment
    const _fechaInicio = moment(this.formularioFiltro.value.fechaInicio).format(
      'DD/MM/YYYY'
    );
    const _fechaFin = moment(this.formularioFiltro.value.fechaFin).format(
      'DD/MM/YYYY'
    );

    //Validar si las fechas recibidas son válidas min 07.39 parte 14
    //Si fecha inicio o fecha fin son invalidas
    if (_fechaInicio === 'Invalid date' || _fechaFin === 'Invalid date') {
      //Mostrará una alerta para que verifique las fechas si estan completas o correctas min 31.46 parte 13
      this._utilidadService.mostrarAlerta(
        'Debe ingresar ambas fechas',
        'Error!'
      );
      //Luego se retornara el msj que indica que debe verificar las fechas
      return;
    }

    //Ejecutar el servicio para obtener el reporte por rango de fechas min 07.48 parte 14
    this._ventaService.Reporte(_fechaInicio, _fechaFin).subscribe({
      //Se valida por medio de una op flecha
      next: (data) => {
        //Se valida el estatus si es true
        if (data.status) {
          //--VERIFICAR PORQUE UNO NO TIENE EL .DATA ---

          //Se actualiza los datos de ventareportes
          this.listaVentasReporte = data.value;
          // console.log('Listado de ventas reporte');
          // console.log(this.listaVentasReporte);

          //Se actualiza la tabla
          this.dataTableVentaReporte.data = data.value;
          // console.log('Elementos de datatable');
          // console.log(this.dataTableVentaReporte.data);
        }
        //En caso de no exitoso
        else {
          //Se borran los datos
          this.listaVentasReporte = [];
          //Se borran los datos de la tabla
          this.dataTableVentaReporte.data = [];
          //Se muestra un msj de error
          this._utilidadService.mostrarAlerta(
            'No se encontraron datos',
            'Opss!'
          );

          console.log('Entro al else');
        }
      },
      error: (e) => {
        console.log('Err');
      },
    });
  }

  //#-- Permite obtener el Importe total del reporte actual 26/01/2024 22.12pm
  obtenerImporte() {
    //#-- Verifica si importe ya tiene una cantidad asignada 26/01/2024 18.41pm
    if (this.obtenerImporteVar > 1) {
      //#-- Si tiene cambia el valor a 0 (esto evita que se sume el importe total anterior con el nuevo) 26/01/2024 18.43pm
      this.obtenerImporteVar = 0;
      // console.log('Se limpio el importe total dentro del método');
    }

    //FALTA BORRAR AL TENER FILTRO CAMBIAR A TABLA DE FILTRO PARA CALCULAR LOS TOTALES

    //#-- Si no se ha ingresado algun filtro 26/01/2020 16.30pm
    if (this.filterValue == '') {
      // console.log(
      //   'Elementos de listaVentasReporte dentro del método obtenerImporte()'
      // );
      // console.log(this.listaVentasReporte);

      //#-- Se hace una iteración por la longitud de listaVentasReporte
      for (
        let indexLVR = 0;
        indexLVR < this.listaVentasReporte.length;
        indexLVR++
      ) {
        //Para poder acceder a los elementos del array de objetos
        const element = this.listaVentasReporte[indexLVR];

        //Se reliza la suma el valor de oIV + el total actual y así sucesivamente (usado parse float ya que tiene decimales)
        this.obtenerImporteVar =
          this.obtenerImporteVar + parseFloat(element.total);
      }
    } else {
      //Obtener el listado devuelto por el filtro
      // console.log('\n');
      // console.log('Listado de ventas reporte (Sino)');
      // console.log(this.listaVentasReporte);
      // console.log('\n');
      // console.log('Elementos de datatable (Sino)');
      // console.log(this.dataTableVentaReporte.data);
      // console.log('\n');
      // console.log('Listado de ventas reporte (Sino) con filtro');
      // console.log(this.listaVentasReporte);

      //#-- Solo devuelve el filtro
      // console.log('\n');
      // console.log('Elementos de datatable (Sino) con filtro');
      // console.log((this.dataTableVentaReporte.filter = this.filterValue));

      // console.log('\n');
      // console.log('Elementos de datatable (Sino) con filtro');
      // console.log((this.dataTableVentaReporte.filter = this.filterValue));

      // console.log('Valor de la tabla luego del filtro');
      // console.log(

      const lstVR = this.listaVentasReporte.filter(
        (x) =>
          x.fechaRegistro === this.dataTableVentaReporte.filter ||
          x.numeroDocumento === this.dataTableVentaReporte.filter ||
          x.tipoPago === this.dataTableVentaReporte.filter ||
          x.producto === this.dataTableVentaReporte.filter
        // x.cantidad.toString() === this.dataTableVentaReporte.filter ||
        // x.precio.toString() === this.dataTableVentaReporte.filter ||

        // x.total.toString() === this.dataTableVentaReporte.filter ||
        // x.totalVenta.toString() === this.dataTableVentaReporte.filter
      );

      console.log(this.dataTableVentaReporte.filter);
      // const lstVR = this.listaVentasReporte.

      for (let index = 0; index < lstVR.length; index++) {
        const element = lstVR[index];

        this.obtenerImporteVar =
          this.obtenerImporteVar + parseFloat(element.total);
      }

      // );
    }
  }

  //Método que permitirá exportar un documento de tipo exel min 09.58 parte 14
  exportarExel() {
    let _fechaInicio = moment(this.formularioFiltro.value.fechaInicio).format(
      'DD/MM/YYYY'
    );
    let _fechaFin = moment(this.formularioFiltro.value.fechaFin).format(
      'DD/MM/YYYY'
    );

    const _HoraActual = new Date();

    //(libro)contiene la def para un nuevo libro de exel
    const wb = XLSX.utils.book_new();

    //(hoja)Dentro de este doc se va a mostrar la info de lista de ventas
    //Exporta exel a través de un array (this.listaVentasReporte)
    const ws = XLSX.utils.json_to_sheet(this.listaVentasReporte);

    //Se va a unir el libro con la hoja min 11.09 parte 14
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');

    // _fechaInicio = _fechaInicio.replace('-', '/');
    // console.log(_fechaInicio);
    // _fechaFin = _fechaFin.replace('-', '/');
    // console.log(_fechaFin);

    //Para poder descargar el archivo exel
    XLSX.writeFile(
      wb,
      'ReporteVentas (' +
        _fechaInicio +
        '-' +
        _fechaFin +
        ') - ' +
        new Date().toLocaleString() +
        '.xlsx'
    );
    // console.log(wb, _fechaInicio, _fechaFin, _HoraActual.toLocaleString());
  }

  limpiarCampos() {
    this.filterValue = '';

    this.listaVentasReporte = [];

    this.dataTableVentaReporte.data = [];
  }
}
