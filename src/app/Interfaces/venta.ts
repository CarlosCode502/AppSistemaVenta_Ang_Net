//Se debe añadir una referencia para evitar el error min 24.37 parte 7
import { DetalleVenta } from "./detalle-venta"

export interface Venta {
    //Agregando las propiedades min 24.11 parte 7
    IdVenta: number,
    NumeroDocumento?: string,
    TipoPago: string,
    TotalTexto: string,
    FechaRegistro?: string,
    DetalleVenta: DetalleVenta[] //Array de tipo detalle venta
}
