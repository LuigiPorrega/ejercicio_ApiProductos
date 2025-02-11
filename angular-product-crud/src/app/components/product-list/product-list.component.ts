import {Component, inject} from '@angular/core';
import {ProductService} from "../../services/product.service";
import {Product} from "../../common/Interfaces";
import {NgbToast} from "@ng-bootstrap/ng-bootstrap";
import {CurrencyPipe, DecimalPipe, NgClass} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faEdit} from "@fortawesome/free-regular-svg-icons/faEdit";
import {faCartShopping} from "@fortawesome/free-solid-svg-icons/faCartShopping";
import {RouterLink} from "@angular/router";
import {CartService} from "../../services/cart.service";
import {faTrashCan} from "@fortawesome/free-regular-svg-icons";
import {SearchService} from '../../services/search.service';
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons/faMagnifyingGlass';

@Component({
  selector: 'app-product-list',
  imports: [
    NgbToast,
    CurrencyPipe,
    FaIconComponent,
    NgClass,
    DecimalPipe,
    RouterLink
  ],
  standalone: true,
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  // llamo al servicio del Search
  private readonly searchService: SearchService = inject (SearchService);

  //llamo al servicio del carrito "cart"
  private readonly cartService: CartService = inject(CartService);
  //llamo al servicio de productos
  private readonly productService: ProductService = inject(ProductService);
  //creo una array para guardar los productos
  products: Product[] = [];
  //controlo la carga de los productos antes de mostrarlos
  cargado = false;

  //creo un Toast
  toast = {
    body: '',
    color: 'bg-success',
    duration: 1500,
  }
  //creo una variable para controlarlo
  toastShow = false;


  //creo una función para llamarlo
  private showToast(message: string, color: string, duration: number) {
    this.toast.body = message;
    this.toast.color = color;
    this.toastShow = true;
    setTimeout(() => {
      this.toastShow = false;
    }, duration);
  }

  constructor() {
    this.loadProducts();
    this.loadSearch();
  }

  private loadProducts() {
    this.productService.getProductos().subscribe({
      next: value => {
        this.products = value;
        this.cargado = true;
      },
      complete: () => {
        this.showToast('Products loaded', 'bg-success text-light', 1500);
      },
      error: error => {
        this.showToast(error.message, 'bg-danger text-light', 2000);
      },
    });
  }

  protected readonly faEdit = faEdit;
  protected readonly faCartShopping = faCartShopping;

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    this.showToast(product.title + 'add to cart!', 'bg-success text-light',2000);
  }

  protected readonly faTrashCan = faTrashCan;

  deleteProduct(product: Product) {
    this.productService.deleteProduct(product.id).subscribe({
      next: value => {
        this.showToast(value.title+ ' deleted!', 'bg-success text-light',1500);
        console.log(value); //necesito saber la repuesta de la Api para completar el servicio
        this.loadProducts(); //recargo la pagina después de haberlo borrado
      },
      error: error => {
        this.showToast(error.message, 'bg-danger text-light',1500);
      }
    });
  }

  private loadSearch() {
    this.searchService.start().subscribe({
      next: value => {
        this.products = value;
      },
      error : error =>{
        this.showToast(error.message, 'bg-danger text-light',2000);
      }
    });
  }

  buscar(event: any) {
    this.searchService.search(event.target.value);

  }

  protected readonly faMagnifyingGlass = faMagnifyingGlass;
}
