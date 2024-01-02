export interface Reporte {
  //Agregando las propiedades min 25.12 parte 7
  //Deben coincidir con las propiedades que retorna la api (mayúsculas y minúsculas)
  fechaRegistro: string;
  numeroDocumento: string;
  producto: string;
  cantidad: number;
  precio: string;
  total: string;
  tipoPago: string;
  totalVenta: string;
}
