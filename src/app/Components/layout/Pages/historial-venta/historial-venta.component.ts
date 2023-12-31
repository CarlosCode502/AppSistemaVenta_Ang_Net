//Agregando componentes para desarrollar la lógica de historial-venta.ct.ts min 15.45 parte 13
//AfterViewInit es un evento que se ejecuta cuando un componente termina de reenderizarse
//ViewChild permite crear una instancia de algun componente de nuestro html
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
//Trabajar con los fórmularios reactivos min 16.10 parte 13
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//Para poder trabajar con tablas
import { MatTableDataSource } from '@angular/material/table';
//Para la páginación de nuestra tabla
import { MatPaginator } from '@angular/material/paginator';
//Para trabajar con los dialogos
import { MatDialog } from '@angular/material/dialog';

//Esto nos va a permitir trabajar con formatos de fechas min 16.38 parte 13
import { MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
//Para las fechas
import * as moment from 'moment';

//Agregar modal detalleVenta (Creado en min 01.28 parte 13) min 17.02 parte 13
import { ModalDetalleVentaComponent } from '../../Modales/modal-detalle-venta/modal-detalle-venta.component';
//IVentas
import { Venta } from 'src/app/Interfaces/venta';
//Servicio de ventas
import { VentaService } from 'src/app/Services/venta.service';
//Para mostrar las alertas
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

//Configurando el formato de fecha que se va a utilizar min 17.42 parte 13
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
  selector: 'app-historial-venta',
  templateUrl: './historial-venta.component.html',
  styleUrls: ['./historial-venta.component.css'],
  //Agregamos a este componente un proveedor min 19.26 parte 13
  providers: [
    {
      provide: MAT_DATE_FORMATS,
      useValue: MY_DATA_FORMATS,
    },
  ],
})
//Importar el método o métodos min 20.01 parte 13
export class HistorialVentaComponent implements OnInit, AfterViewInit {
  //Formulario que contiene nuestros controles min 20.25 parte 13
  formularioBusqueda: FormGroup;

  //Contiene los distintos filtros por como se puede obtener un rango de fechas
  //Se mostrará en un desplegable con opcciones de búsqueda
  //Antes 29/12/2023
  opcionesBusqueda: any[] = [
    { value: 'fecha', descripcion: 'Rango de Fechas' },
    { value: 'numero', descripcion: 'Numero de venta' },
  ];

  //Columnas que va a tener la tabla min 22.19 parte 13
  columnasTabla: string[] = [
    'fechaRegistro',
    'numeroDocumento',
    'tipoPago',
    'total',
    'accion',
  ];

  //Los campos que va a contener la tabla min 23.01 parte 13
  dataInicio: Venta[] = [];
  //Fuente de origen para mostrar los datos de la tabla min 23.10 parte 13
  datosListaVentas = new MatTableDataSource(this.dataInicio);

  //Para la páginacion (! que puede ser vacio)
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  //Inyectar las dependencias min 23.59 parte 13
  constructor(
    //Construccion de formularios
    private fb: FormBuilder,
    //Mostrar ventanas de dialogos
    private dialog: MatDialog,
    //Utilizar los servicos
    private _ventaService: VentaService,
    //Mostrar alertas
    private _utilidadService: UtilidadService
  ) {
    //Agregar campos del formulario min 25.02 parte 13
    this.formularioBusqueda = this.fb.group({
      //Si este campo se mantiene en fecha se búscara por fecha
      //SI cambia a por numero se búscara por número
      buscarPor: ['numero'],
      numeroVenta: ['0053'],
      fechaInicio: [''],
      fechaFin: [''],
    });

    //Evento para detectar cuando el formulario o buscar por cambia min 26.14 parte 13
    //Cada véz que detecte el cambio se van a limpiar los campos
    this.formularioBusqueda
      .get('buscarPor')
      ?.valueChanges.subscribe((value) => {
        this.formularioBusqueda.patchValue({
          numeroVenta: '',
          fechaInicio: '',
          fechaFin: '',
        });
      });
  }

  ngOnInit(): void {}

  //Método que permite aplicar los filtros a la tabla cuando se esta realizando una búsqueda min 28.16 parte 13
  //Recibe un evento
  aplicarFiltroTabla(event: Event) {
    //Obtiene el valor del filtro desde de un imput de tipo HTML
    const filterValue = (event.target as HTMLInputElement).value;
    //Aplica los filtros solo a la fuente de datos de las ventas
    //Se usa trim(para eliminar espacios al inicio y fin) además todo el texto sera en minúsculas
    this.datosListaVentas.filter = filterValue.trim().toLocaleLowerCase();
    // this.datosListaVentas.paginator = this.paginacionTabla;
  }

  //Crear el evento del componente AfterViewInit para la páginacion min 28.08 parte 13
  ngAfterViewInit(): void {
    //Accedemos a la fuente de datos con el método paginator y se le asigna
    //se crea una nueva instancia que va a contener el valor de la páginacion
    this.datosListaVentas.paginator = this.paginacionTabla;
  }

  //Método que enviara el filtro elegido para buscar venta si es fecha o numero min 28.50 parte 13
  public buscarVentas() {
    // let _buscarPor: string = '';
    //Var que contienen el rango de fechas
    let _fechaInicio: string = '';
    let _fechaFin: string = '';

    let _numero: string = '';

    //Validar cuando sea por rango de fechas y cuando sea por nombre min 29.28 parte 13
    if (this.formularioBusqueda.value.buscarPor === 'fecha') {
      // _buscarPor = this.formularioBusqueda.value.buscarPor;

      //Si se selecciono por fecha asignamos el valor a las variables
      //Utilizando moment para convertir a fecha con formato min 30.13 parte 13
      //Primero se obtiene el valor luego se encapsula con moment
      _fechaInicio = moment(this.formularioBusqueda.value.fechaInicio).format(
        'DD/MM/YYYY'
      );
      _fechaFin = moment(this.formularioBusqueda.value.fechaFin).format(
        'DD/MM/YYYY'
      );

      //Validar si las fechas recibidas son válidas min 30.59 parte 13
      //Si fecha inicio o fecha fin son invalidas
      if (_fechaInicio === 'Invalid date' || _fechaFin === 'Invalid date') {
        //Mostrará una alerta para que verifique las fechas si estan completas o correctas min 31.46 parte 13
        this._utilidadService.mostrarAlerta(
          'Debe ingresar ambas fechas',
          'Error!'
        );
        //Luego se retornara el msj
        return;
      }
    } else if (this.formularioBusqueda.value.buscarPor === 'numero') {
      // _buscarPor = this.formularioBusqueda.value.buscarPor;
      _numero = this.formularioBusqueda.value.numeroVenta;

      if (_numero === '' || _numero.length === 0 || _numero === null) {
        this._utilidadService.mostrarAlerta(
          'Debe ingresar un número de Documento',
          'Error!'
        );
        return;
      }
    }

    //Ya no agregamos o validamos si es numero
    //Ejecutar servicio para obtener el historial min 32.40 parte 13
    this._ventaService
      .Historial(
        //Enviamos los parametros que este recibe (4 argumentos)
        this.formularioBusqueda.value.buscarPor,
        // this.formularioBusqueda.value.numeroVenta,
        // _buscarPor,
        _numero,
        _fechaInicio,
        _fechaFin
      )
      .subscribe({
        //Validamos la respuesta hacia la api en caso de ser exitoso min 33.22 parte 13
        next: (data) => {
          //Si la respuesta es exitosa se envia el valor
          if (data.status) {
            if (data.value == 0) {
              this._utilidadService.mostrarAlerta(
                'No se encontraron datos por el rango especificado',
                'Opss!'
              );
              return;
            }

            // this.datosListaVentas.data;

            //AQUI ESTABA EL ERROR QUE EVITAVA QUE LA PAGINACION SE MOSTRARÁ
            //TAMBIEN NO SE PODÍA REALIZAR LA BUSQUEDA POR NUMERO
            //TAMPOCO BÚSQUEDA POR FILTRO
            this.datosListaVentas.data = data.value;

            console.log(
              'el valor de numero es: ' + _numero + ' luego de cargar la tabla '
            );
          }
          //En caso de error
          else {
            this._utilidadService.mostrarAlerta(
              'No se encontraron datos',
              'Opss!'
            );
          }
        },

        //Al finalizar completar se volveran a mostrar los valores
        // complete: () => {
        //   this.datosListaVentas.paginator = this.paginacionTabla;
        // },
        //Por si existe algun error en la api
        error: (e) => {},
      });
  }

  //Método para poder ver el detalle de una venta min 34.51 parte 13
  verDetalleVenta(_venta: Venta) {
    //Los detalles de la venta se van a poder visualizar en un modal
    //Configuraremos las caracteristicas de este
    this.dialog.open(ModalDetalleVentaComponent, {
      //De donde recibe los datos
      data: _venta,
      //Si se puede cerrar haciendo click fuera de este
      disableClose: true,
      //Tamaño de ancho
      width: '700px',
    });
  }
}
