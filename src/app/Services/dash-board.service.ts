import { Injectable } from '@angular/core';

//Agragando los recursos min 52.06 parte 7
//Para poder utilizar las solicitudes de la api rest (httpget y httppost) Recurso de httpclient
import{HttpClient} from "@angular/common/http";
//Observables (permiten recibir las respuestas de las apis)
import { Observable } from 'rxjs';
//Importar las variables de entorno (contiene la url de la api back)
import { environment } from 'src/environments/environment';
//Permite recibir la respuesta de las solicitudes http
import { ResponseAPI } from '../Interfaces/response-api';

@Injectable({
  providedIn: 'root'
})
export class DashBoardService {

  //Recibe un string con la url de enviroment (api) min 52.48 parte 7
  //Se le concatena el nombre del archivo actual
  private UrlApi:string = environment.endpoint + "DashBoard/";

  //Inyectar la dependencia de HttpClient para poder crear las solicitudes min 52.48 p7
  constructor(private http:HttpClient) { }

  //Método que va retornar un resumes min 53.26 parte 7
  Resumen():Observable<ResponseAPI>{
    //Retorna una respuesta de la ejecución del método obtener el resumen
    return this.http.get<ResponseAPI>(`${this.UrlApi}Resumen`)
  }

}
