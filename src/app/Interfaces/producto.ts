export interface Producto {
  //Agregando las propiedades min 22.56 parte 7
  //Deben coincidir con las propiedades que retorna la api (mayúsculas y minúsculas)
  idProducto: number;
  nombreProducto: string;
  idCategoria: number;
  descripcionCategoria: string;
  stock: number;
  precio: string;
  esActivo: number;
}
