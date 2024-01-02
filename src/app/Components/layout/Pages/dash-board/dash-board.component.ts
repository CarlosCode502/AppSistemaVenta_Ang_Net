import { Component, OnInit } from '@angular/core';

//Agregando e importando los recursos necesarios min 00.27 parte 15
//Para poder trabajar con gráficos y registrar (solo gráficos de barras)
import { Chart, registerables } from 'chart.js';

//Servicio de dashboard
import { DashBoardService } from 'src/app/Services/dash-board.service';

//Para poder registrar todos los gráficos que vamos a utilizar min 01.08 parte 15
Chart.register(...registerables);

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css'],
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
            label: '# de Ventas',
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
          console.log(arrayData);

          //La fecha se mostrará en el label y el total de ventas sobre la barra
          //Como el resultado se muestra junto será necesarío separarlo min 12.48 parte 15
          //Variables temporales que contendrán (uno para fecha y otro para total ventas)
          const labelTemp = arrayData.map((value) => value.fecha);
          const dataTemp = arrayData.map((value) => value.total);

          //Para poder visualizar los datos obtenidos ya separados
          console.log(labelTemp, '\n', dataTemp);

          //Enviamos la data y texto al gráfico que son los valores que reciben min 13.16 parte 15
          this.mostrarGrafico(labelTemp, dataTemp);
        }
      },
      error: (e) => {},
    });
  }
}
