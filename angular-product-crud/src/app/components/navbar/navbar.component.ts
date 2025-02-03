import {Component, inject} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  //llamo al servicio del cart
  private readonly cartService: CartService = inject (CartService);
  //creo la funcion cantidadCarrito y la inicializo a 0
  cantidadCarrito : number = 0;

  constructor() {
    this.cartService.cantidadCarrito.subscribe({
      next: value => {
        this.cantidadCarrito = value;
      },
      error: err => {
        console.error(err); //puedo crear el Toast y utilizarlo
      }
    });
  }
}
