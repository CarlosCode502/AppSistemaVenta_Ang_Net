export interface Sesion {
  //Agregando las propiedades min 21.41 parte 7
  //Guardar los datos del usuario de quien se ha logeado
  //Deben coincidir con las propiedades que retorna la api (mayúsculas y minúsculas)
  idUsuario: number;
  nombreCompleto: string;
  correo: string;
  rolDescripcion: string;
}
