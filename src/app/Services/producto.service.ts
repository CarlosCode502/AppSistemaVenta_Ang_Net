import { Injectable } from '@angular/core';

//Agragando los recursos min 44.10 parte 7
//Para poder utilizar las solicitudes de la api rest (httpget y httppost) Recurso de httpclient
import{HttpClient} from "@angular/common/http";
//Observables (permiten recibir las respuestas de las apis)
import { Observable } from 'rxjs';
//Importar las variables de entorno (contiene la url de la api back)
import { environment } from 'src/environments/environment';
//Permite recibir la respuesta de las solicitudes http
import { ResponseAPI } from '../Interfaces/response-api';
//Interfaz de producto ya que es necesario un CRUD
import { Producto } from '../Interfaces/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  //Recibe un string con la url de enviroment (api) min 44.53 parte 7
  //Se le concatena el nombre del archivo actual
  private UrlApi:string = environment.endpoint + "Producto/";

  //Inyectar la dependencia de HttpClient para poder crear las solicitudes min 44.53 p7
  constructor(private http:HttpClient) { }
  
  //Método que va retornar el listado de productos min 45.30 parte 7
  Lista():Observable<ResponseAPI>{
    //Retorna una respuesta de la ejecución del método obtener el listado
    return this.http.get<ResponseAPI>(`${this.UrlApi}Lista`)
  }

  //Método que permite guardar un producto min 46.05 parte 7
  //Recibe un producto
  Guardar(request:Producto):Observable<ResponseAPI>{
    //Retorna una solicitud post de respuesta a la url del método guardar mandandole un producto(request)
    return this.http.post<ResponseAPI>(`${this.UrlApi}Guardar`,request)
  }

  //Método que permite editar un prodcto min 46.05 parte 7
  //Recibe un producto
  Editar(request:Producto):Observable<ResponseAPI>{
    //Retorna una solicitud put de respuesta a la url del método editar mandandole un producto(request)
    return this.http.put<ResponseAPI>(`${this.UrlApi}Editar`,request)
  }

  //Método que permite eliminar un producto recibe el id min 46.05 parte 7
  Eliminar(id:number):Observable<ResponseAPI>{
    //Retorna una solicitud delete de respuesta a la url que recibe un id(request)
    return this.http.delete<ResponseAPI>(`${this.UrlApi}Eliminar/${id}`)
  }
}
