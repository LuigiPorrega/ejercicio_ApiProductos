import {Component, inject} from '@angular/core';
import {CartService} from "../../services/cart.service";
import {Product} from "../../common/Interfaces";
import {CurrencyPipe} from "@angular/common";

@Component({
  selector: 'app-product-cart',
  imports: [
    CurrencyPipe
  ],
  standalone: true,
  templateUrl: './product-cart.component.html',
  styleUrl: './product-cart.component.css'
})
export class ProductCartComponent {
  //llamo al servicio del carrito
  private readonly cartService: CartService = inject (CartService);
  //creo un array para almacenar los productos añadidos
  products: Product[] = [];
  //creo una variable para obtener el total del precio de los productos
  precioTotal: number = 0;

  constructor(){
    this.loadProductos();
    this.loadPrice()
  }

  private loadProductos() {
    this.cartService.carrito.subscribe({
      next: value => {
        this.products = value;
      },
      error: err => {
        console.error(err);
      }
    });
  }

  private loadPrice() {
    this.cartService.precioCarrito.subscribe({
      next: value => {
        this.precioTotal = value;
      },
      error: err => {
        console.error(err);
      }
    });
  }
}
