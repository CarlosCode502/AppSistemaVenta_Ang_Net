import { Injectable } from '@angular/core';

//Agragando los recursos min 46.56 parte 7
//Para poder utilizar las solicitudes de la api rest (httpget y httppost) Recurso de httpclient
import{HttpClient} from "@angular/common/http";
//Observables (permiten recibir las respuestas de las apis)
import { Observable } from 'rxjs';
//Importar las variables de entorno (contiene la url de la api back)
import { environment } from 'src/environments/environment';
//Permite recibir la respuesta de las solicitudes http
import { ResponseAPI } from '../Interfaces/response-api';
//Agregar la interfaz para venta
import { Venta } from '../Interfaces/venta';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  //Recibe un string con la url de enviroment (api) min 47.42 parte 7
  //Se le concatena el nombre del archivo actual
  private UrlApi:string = environment.endpoint + "Venta/";

  //Inyectar la dependencia de HttpClient para poder crear las solicitudes min 47.42 p7
  constructor(private http:HttpClient) { }

  //Método que permite registrar una venta min 48.13 parte 7
  //Recibe la estructura de una venta
  Registrar(request:Venta):Observable<ResponseAPI>{
    //Retorna una solicitud post de respuesta a la url del método registrar mandandole un (request)
    return this.http.post<ResponseAPI>(`${this.UrlApi}Registrar`,request)
  }

  //Método que permite buscar en el historial segun un filtro min 50.49 parte 7
  //Recibe varios parametros o filtros
  Historial(buscarPor:string,numeroVenta:string,fechaInicio:string,fechaFin:string):Observable<ResponseAPI>{
    //Retorna una respuesta a la solicitud según alguno de sus parametros que recibe
    return this.http.get<ResponseAPI>(`
      ${this.UrlApi}Historial?buscarPor=${buscarPor}&numeroVenta=
      ${numeroVenta}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`)
  }

  //Método que permite generar un reporte segun un filtro de fechas min 51.15 parte 7
  //Recibe como parametros unas fechas
  Reporte(fechaInicio:string,fechaFin:string):Observable<ResponseAPI>{
    //Retorna una respuesta a la solicitud segun un rango de fechas
    return this.http.get<ResponseAPI>(`
      ${this.UrlApi}Historial?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`)
  }
}
