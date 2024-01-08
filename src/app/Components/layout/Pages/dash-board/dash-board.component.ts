import { Component, OnInit } from '@angular/core';

//Agregando e importando los recursos necesarios min 00.27 parte 15
//Para poder trabajar con gráficos y registrar (solo gráficos de barras)
import { Chart, registerables } from 'chart.js';

//Servicio de dashboard
import { DashBoardService } from 'src/app/Services/dash-board.service';

//Para poder registrar todos los gráficos que vamos a utilizar min 01.08 parte 15
Chart.register(...registerables);

//#-- Esto nos va a permitir trabajar con formatos de fechas min 16.38 parte 13
import { MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
//#-- Para las fechas
import * as moment from 'moment';

//#-- Configurando el formato de fecha que se va a utilizar min 17.42 parte 13
export const MY_DATA_FORMATS = {
  //Parseo de fecha de entrada 'Dia/Mes/Año'
  parse: {
    dateinput: 'DD/MM/YYYY',
  },
  //Como vamos a recibir las fechas 'Dia/Mes/Año'
  // display: {
  //   dateinput: 'DD/MM/YYYY',
  //   //Como se va a mostrar en el calendario min 19.04 parte 13
  //   monthYearLabel: 'MMMM YYYY',
  // },
};

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css'],
  //#-- Agregamos a este componente un proveedor para servicio de fecha min 19.26 parte 13
  providers: [
    {
      provide: MAT_DATE_FORMATS,
      useValue: MY_DATA_FORMATS,
    },
  ],
})
export class DashBoardComponent implements OnInit {
  //Creando variables (contendrán los totales de la última semana) min 01.38 parte 15

  //Contiene la cantidad de ingresos
  totalIngresos: string = '0';
  //Contiene el número de ventas registradas
  totalVentas: string = '0';
  //Contiene la cantidad de productos existentes
  totalProductos: string = '0';

  //Inyectando las dependencias a utilizar min 02.20 parte 15
  constructor(
    //únicamente el dashboardservice
    private _dashboardService: DashBoardService
  ) {}

  //Método para poder mostrar la información en el gráfico min 02.45 parte 15
  //Necesita etiquetas y datos (labels y data)
  //Los labels son las etiquetas que contienen el nombre del dato representado
  //Los datos es la cantidad que se va a representar
  mostrarGrafico(labelGrafico: any[], dataGrafico: any[]) {
    //Declarando variavbles del método min 04.35 parte 15
    //Contiene una nueva instancia del grafico (nombre de la etiqueta en html)
    const chartBarras = new Chart('chartBarras', {
      //Todo lo necesario para completarlo
      type: 'bar',
      data: {
        //Labaels y Gráficos min 05.52 parte 15
        labels: labelGrafico,
        datasets: [
          {
            //Titulo de la etiqueta
            label: '# Total de ventas por día',
            //Fuente de datos o data
            data: dataGrafico,
            //Color de fondo (algo transparente o opaco)
            backgroundColor: ['rgba(54, 162, 235, 0.2)'],
            //Color de borde
            borderColor: ['rgba(54, 162, 235, 1)'],
            //Ancho de borde
            borderWidth: 1,
          },
        ],
      },
      //Opciones que va a tener este gráfico min 07.37 parte 15
      options: {
        //Si desamos mantenenr el aspecto del radio(en false ya que la app es responsiva y que se adapte)
        maintainAspectRatio: false,
        //Que es responsiva
        responsive: true,
        //De donde se visualiza la escala en eje Y
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  //Se ejecuta cuando un componente entra en foco o se visualiza min 08.39 parte 15
  ngOnInit(): void {
    //Ejecutamos el servicio para obtener toda la información o resumen
    this._dashboardService.Resumen().subscribe({
      //Validamos la op
      next: (data) => {
        //Validamos el status
        if (data.status) {
          //Asignamos los valores obtenidos a las varibles de (min 01.38 parte 15)
          this.totalIngresos = data.value.totalIngresos;
          this.totalVentas = data.value.totalVentas;
          this.totalProductos = data.value.totalProductos;

          //Obtener la información para mostrarla en el grafico min 10.00 parte 15
          //Obtendrá las ventas de la última semana
          const arrayData: any[] = data.value.ventasUltimaSemana;
          //Poder ver el resultado dentro de arrayData
          //OJO HAY DIFERENCIA

          //El resultado se muestra -> (El contenido del array es:
          // [object Object],[object Object],[object Object],[object Object],[object Object])
          // console.log('El contenido del array es: \n' + arrayData);

          //El resultado que se muestra -> (Es el esperado)
          //Array(5) [ {…}, {…}, {…}, {…}, {…} ]
          // console.log(arrayData);

          //#-- NO DESCOMENTAR ABAJO
          //La fecha se mostrará en el label y el total de ventas sobre la barra
          //Como el resultado se muestra junto será necesarío separarlo min 12.48 parte 15
          //Variables temporales que contendrán (uno para fecha y otro para total ventas)
          // let labelTemp = arrayData.map((value) => {
          //   return value.fecha;
          // });

          // let _fecha: Date = new Date();

          // arrayData.forEach((value) => {
          //   // console.log(value.fecha);
          //   // _fecha = moment(value.fecha).format('DD/MM/YYYY');
          //   // console.log(value.fecha);
          //   _fecha = value.fecha;
          //   console.log(_fecha);
          // });

          // console.log(_fecha);
          // let fechaDia;

          //Var que contienen el rango de fechas
          // let _fechaInicio: string = '';
          // let _fechaFin: string = '';

          //Si se selecciono por fecha asignamos el valor a las variables
          //Utilizando moment para convertir a fecha con formato min 30.13 parte 13
          //Primero se obtiene el valor luego se encapsula con moment
          // _fechaInicio = moment(
          //   this.formularioBusqueda.value.fechaInicio
          // ).format('DD/MM/YYYY');
          // _fechaFin = moment(this.formularioBusqueda.value.fechaFin).format(
          //   'DD/MM/YYYY'
          // );

          // const labelTemp2 = arrayData.map((value) => value.fecha);
          // console.log(labelTemp2);

          // let IPOfecha = new Date();
          // IPOfecha.setTime(Date.parse('Aug 9, 1995'));

          //nuevo arreglo de fechas
          // let formatFecha: [] = [];

          // const diasSemana: any[] = [
          //   { value: '1', descripcion: 'Lunes' },
          //   { value: '2', descripcion: 'Martes' },
          //   { value: '3', descripcion: 'Miércoles' },
          //   { value: '4', descripcion: 'Jueves' },
          //   { value: '5', descripcion: 'Viernes' },
          //   { value: '6', descripcion: 'Sábado' },
          //   { value: '7', descripcion: 'Domingo' },
          // ];
          //#-- NO DESCOMENTAR ARRIBA

          //#-- DESCOMENTAR UNA VEZ ABAJO PARA OBTENER EL DIA SEGUN LA FECHA
          // //#-- Arreglo que contiene los dias de la semana 07/01/2024 17.27 pm
          // const diasSemana: string[] = [
          //   'Lunes',
          //   'Martes',
          //   'Miércoles',
          //   'Jueves',
          //   'Viernes',
          //   'Sábado',
          //   'Domingo',
          // ];

          // //#-- Arreglo vacío al que asignamos un valor 07/01/2024
          // let fechaTemp: number[] = [];

          // //#-- Permite obtener el día de la semana según una fecha especifica 07/01/2024
          // //#-- Hace una iteración por cada elemento que contenga este arreglo (por fecha)
          // arrayData.forEach((value) => {
          //   //#-- Cada item lo separa cuando encuentra un /
          //   //#-- Lo guarda como dia, mes, año
          //   const [day, month, year] = value.fecha.split('/');
          //   //#-- (-1 para que el mes 10 no sea 010 hasta 12)
          //   const dateS = new Date(year, month - 1, day);
          //   // console.log(dateS.getDay());

          //   //#-- Agrega un elemento al final del arreglo
          //   fechaTemp.push(dateS.getDay());
          // });

          // //#-- Muestra el contenido del arreglo
          // console.log(fechaTemp);

          // //#-- Arreglo vacío que contendrá los dias según se vayan agregando
          // let mostrarDias: string[] = [];

          // //#-- Hace iteraciones dep la cantidad de elementos de fechaTemp
          // for (let index = 0; index < fechaTemp.length; index++) {
          //   //Contiene el elemento actual de la iteración
          //   const element = fechaTemp[index];

          //   //Estructura de selección múltiple
          //   //Válida coincide element con algunno de los casos
          //   switch (element) {
          //     case 1:
          //       mostrarDias.push('Lunes');
          //       break;

          //     case 2:
          //       mostrarDias.push('Martes');
          //       break;

          //     case 3:
          //       mostrarDias.push('Miércoles');
          //       break;

          //     case 4:
          //       mostrarDias.push('Jueves');
          //       break;

          //     case 5:
          //       mostrarDias.push('Viernes');
          //       break;

          //     case 6:
          //       mostrarDias.push('Sábado');
          //       break;

          //     case 7:
          //       mostrarDias.push('Domingo');
          //       break;

          //     //Si no coincide se mostrara por defecto esto
          //     default:
          //       console.log(element);
          //       break;
          //   }
          // }

          // //#-- Muestra el contenido del arreglo
          // console.log(mostrarDias);
          //#-- DESCOMENTAR UNA VEZ ARRIBA PARA OBTENER EL DIA SEGUN LA FECHA

          // const dias = mostrarDias.map((value) => value);
          const labelTemp = arrayData.map((value) => value.fecha);
          const dataTemp = arrayData.map((value) => value.total);

          //Enviamos la data y texto al gráfico que son los valores que reciben min 13.16 parte 15
          //Para mostrar en fechas
          this.mostrarGrafico(labelTemp, dataTemp);
          //#-- Para mostrar en días
          // this.mostrarGrafico(mostrarDias, dataTemp);
        }
      },
      error: (e) => {},
    });
  }
}
