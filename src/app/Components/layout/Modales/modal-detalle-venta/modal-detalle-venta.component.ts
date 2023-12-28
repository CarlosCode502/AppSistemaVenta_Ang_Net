//Creado en min 01.28 parte 13

//Vamos a inyectar el componente (Inject) este componente permite recibir desde otro
//componente otro recurso que estemos pasando min 02.05 parte 13
import { Component, Inject } from '@angular/core';

//Para obtener datos a través de los modales (ref de dialogos y data de dialogos) min 02.37 parte 13
//Para trabajar con los datos que vamos a recibir
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
//Para IVenta
import { Venta } from 'src/app/Interfaces/venta';
//Para IDetalleVenta
import { DetalleVenta } from 'src/app/Interfaces/detalle-venta';

@Component({
  selector: 'app-modal-detalle-venta',
  templateUrl: './modal-detalle-venta.component.html',
  styleUrls: ['./modal-detalle-venta.component.css'],
})
export class ModalDetalleVentaComponent {
  //Creando las variables que representan las propiedades I venta min 03.12 parte 13
  fechaRegistro: string = '';
  numeroDocumento: string = '';
  tipoPago: string = '';
  totalTexto: string = '';
  detalleVenta: DetalleVenta[] = [];

  //Columnas que va a contener la tabla min 04.23 parte 13
  columnasTabla: string[] = ['producto', 'cantidad', 'precio', 'total'];

  //Inyectando las dependecias para poder acceder a los datos min 04.58 parte 13
  constructor(
    //Inyectar el componente para poder recibir los datos
    //Aquí recibimos los datos de la venta
    @Inject(MAT_DIALOG_DATA) public _venta: Venta
  ) {
    //Relacionando los campos de esta clase con los de otra min 05.51 parte 13 aprox

    //! Para indicar que puede ser nulo
    this.fechaRegistro = _venta.fechaRegistro!;
    this.numeroDocumento = _venta.numeroDocumento!;
    this.tipoPago = _venta.tipoPago;
    this.totalTexto = _venta.totalTexto;
    this.detalleVenta = _venta.tblDetalleVenta;
  }
}
