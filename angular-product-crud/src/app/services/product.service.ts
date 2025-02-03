import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Product} from '../common/Interfaces';
import {Observable} from 'rxjs';
import {environment} from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly http: HttpClient = inject (HttpClient);  //importo de angular core

  constructor() { }
  //función para listar todos los productos
  getProductos(): Observable<Product[]>{
    return this.http.get<Product[]>(environment.urlBase);
  }
  //función para visualizar un solo producto
  getProducto(id: number): Observable<Product>{
    return this.http.get<Product>(environment.urlBase + '/' + id);
  }
  //función para añadir un producto con post
  addProduct(product: Product): Observable<Product>{
    return this.http.post<Product>(environment.urlBase, product);
  }
  //función para modificar un producto con put o patch ( le paso el id y el producto)
  updateProduct(id: number, product: Product): Observable<Product>{
    return this.http.put<Product>(environment.urlBase + '/' + id, product);
  }
  //función para borrar un producto con delete
  deleteProduct(id: number): Observable<Product>{
    return this.http.delete<Product>(environment.urlBase + '/' + id);
  }
}

