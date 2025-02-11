import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable, of, Subject, switchMap} from 'rxjs';
import {Product} from '../common/Interfaces';
import {environment} from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private readonly http: HttpClient = inject (HttpClient);
  private palabra : Subject<string> = new Subject<string>();


  private productSearched$ : Observable<Product[]> = this.palabra.pipe(switchMap(res=>{
    return this.http.get<Product[]>(environment.urlBase).pipe(
      map(products => products.filter(product=> product.title.toLowerCase().includes(res.toLowerCase())))
    ).pipe(
      catchError(()=>of([]))
    );
  }))

  search(name:string){
    this.palabra.next(name);
  }

  start():Observable<Product[]>{
    return this.productSearched$;
  }
}
