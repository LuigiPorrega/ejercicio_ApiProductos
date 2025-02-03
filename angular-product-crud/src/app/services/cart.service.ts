import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Product} from '../common/Interfaces';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  carrito: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);
  cantidadCarrito: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  precioCarrito: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  //funciones:
  addToCart(product:Product){
    var carritoAux = this.carrito.value;
    var precioCarrito = this.precioCarrito.value;
    carritoAux.push(product);
    this.carrito.next(carritoAux);
    this.cantidadCarrito.next(carritoAux.length);
    precioCarrito += product.price; //el price es el precio presente en la interface
    this.precioCarrito.next(precioCarrito);
  }

  removeFromCart(product: Product) {
    const carritoAux = this.carrito.value;
    const index = carritoAux.findIndex(item => item.id === product.id);

    if (index !== -1) {
      carritoAux.splice(index, 1);
      this.carrito.next(carritoAux);
      this.cantidadCarrito.next(carritoAux.length);

      const precioCarrito = this.precioCarrito.value - product.price;
      this.precioCarrito.next(precioCarrito);
    }
  }


  constructor() { }
}
