import { Injectable } from '@angular/core';

//Agragando los recursos min 29.21 parte 7
//Para poder utilizar las solicitudes de la api rest (httpget y httppost) Recurso de httpclient
import{HttpClient} from "@angular/common/http";
//Observables (permiten recibir las respuestas de las apis)
import { Observable } from 'rxjs';
//Importar las variables de entorno (contiene la url de la api back)
import { environment } from 'src/environments/environment';
//Permite recibir la respuesta de las solicitudes http
import { ResponseAPI } from '../Interfaces/response-api';
//Para poder recibir las credenciales
import { Login } from '../Interfaces/login';
//Para recibir el usuario
import { Usuario } from '../Interfaces/usuario';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  //Variable para poder armar la url de la api min 31.20 parte 7
  //Obtiene la url de enviroment concatenada con el archivo actual (luego el método)
  private UrlApi:string = environment.endpoint + "Usuario/";

  //Inyectar la dependencia de HttpClient para poder crear las solicitudes min 32.31 p7
  constructor(private http:HttpClient) { }

  //Método para iniciarSesion (recibe un login y devuelve un observable) de responses
  IniciarSesion(request:Login):Observable<ResponseAPI>{
    //Retorna la respuesta de response (url que va a ejecutar)
    //Ejecuta el método que valida las credenciales del usuario
    return this.http.post<ResponseAPI>(`${this.UrlApi}IniciarSesion`,request)
  }

  //Método que va retornar la lista de usuarios min 35.03 parte 7
  Lista():Observable<ResponseAPI>{
    //Retorna una respuesta de la ejecución del método obtener el listado
    return this.http.get<ResponseAPI>(`${this.UrlApi}Lista`)
  }

  //Método que permite guardar un usuario min 35.50 parte 7
  //Recibe un usuario
  Guardar(request:Usuario):Observable<ResponseAPI>{
    //Retorna una solicitud post de respuesta a la url del método guardar mandandole un usuario(request)
    return this.http.post<ResponseAPI>(`${this.UrlApi}Guardar`,request)
  }

  //Método que permite editar un usuario min 35.50 parte 7
  //Recibe un usuario
  Editar(request:Usuario):Observable<ResponseAPI>{
    //Retorna una solicitud put de respuesta a la url del método editar mandandole un usuario(request)
    return this.http.put<ResponseAPI>(`${this.UrlApi}Editar`,request)
  }

  //Método que permite eliminar un usuario recibe el id min 37.42 parte 7
  Eliminar(id:number):Observable<ResponseAPI>{
    //Retorna una solicitud delete de respuesta a la url que recibe un id(request)
    return this.http.delete<ResponseAPI>(`${this.UrlApi}Eliminar/${id}`)
  }
}
