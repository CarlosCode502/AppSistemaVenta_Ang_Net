// Creado modal-producto.c.s.ts en min 01.15 parte 11

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProductoComponent } from './modal-producto.component';

describe('ModalProductoComponent', () => {
  let component: ModalProductoComponent;
  let fixture: ComponentFixture<ModalProductoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalProductoComponent],
    });
    fixture = TestBed.createComponent(ModalProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
