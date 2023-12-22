//Se debe añadir una referencia para evitar el error min 24.37 parte 7
import { DetalleVenta } from './detalle-venta';

export interface Venta {
  //Agregando las propiedades min 24.11 parte 7
  //Deben coincidir con las propiedades que retorna la api (mayúsculas y minúsculas)
  idVenta?: number;
  numeroDocumento?: string;
  tipoPago: string;
  totalTexto: string;
  fechaRegistro?: string;
  tblDetalleVenta: DetalleVenta[]; //Array hace ref a detalle-venta.ts
}
