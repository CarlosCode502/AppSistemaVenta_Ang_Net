import { Injectable } from '@angular/core';

//Agragando los recursos min 40.20 parte 7
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
export class MenuService {

  //Recibe un string con la url de enviroment (api) min 40.31 parte 7
  //Se le concatena el nombre del archivo actual
  private UrlApi:string = environment.endpoint + "Menu/";

  //Inyectar la dependencia de HttpClient para poder crear las solicitudes min 40.35 p7
  constructor(private http:HttpClient) { }

  //Método que va retornar la lista de usuarios segun el id min 40.38 parte 7
  Lista(idUsuario: number):Observable<ResponseAPI>{
    //Retorna una respuesta de la ejecución del método obtener el listado
    //Signo (?)idUsuario ya ques es valor esperado
    //Se personalizo la url para que reciba y se le manda el id usuario
    return this.http.get<ResponseAPI>(`${this.UrlApi}Lista?idUsuario=${idUsuario}`)
  }
}
