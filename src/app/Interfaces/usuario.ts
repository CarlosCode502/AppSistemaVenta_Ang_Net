export interface Usuario {
  //Agregando las propiedades min 18.54 parte 7
  //Deben coincidir con las propiedades que retorna la api (mayúsculas y minúsculas)
  idUsuario: number;
  nombreCompleto: string;
  correo: string;
  idRol: number;
  rolDescripcion: string;
  clave: string;
  esActivo: number;
}
