import {Component, inject, Input, OnInit} from '@angular/core';
import {ProductService} from "../../services/product.service";
import {Router} from "@angular/router";
import {Product} from "../../common/Interfaces";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {FormValidators} from "../../validators/formValidators";
import {faCartShopping} from "@fortawesome/free-solid-svg-icons/faCartShopping";
import {faEdit} from "@fortawesome/free-regular-svg-icons/faEdit";
import {CurrencyPipe, DecimalPipe, NgClass} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {NgbToast} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-product-edit',
  imports: [
    CurrencyPipe,
    DecimalPipe,
    FaIconComponent,
    NgbToast,
    NgClass,
    FormsModule,
    ReactiveFormsModule
  ],
  standalone: true,
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.css'
})
export class ProductEditComponent implements OnInit {
  //recojo el id (dentro parentesis igual que lo que puse en la ruta)
  @Input('id') id!: number;
  //llamo al servicio para listar los productos
  private readonly productService: ProductService = inject(ProductService);
  //llamo al servicio router para moverme entre paginas
  private readonly router: Router = inject(Router);
  //creo un array para guardar los productos
  product!: Product;
  //creo una booleana para controlar la carga de los elementos en el html
  cargado = false;
  //creo una booleana para controlar si quiero editar o añadir
  editar = false;

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

  //FORMULARIO REACTIVO
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  formProduct : FormGroup = this.formBuilder.group({
    id:[0],
    title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    price: [0, [Validators.required]],
    //utilizo las Validaciones personalizadas en description:
    description: ['', [ FormValidators.notOnlyWhiteSpace, FormValidators.forbiddenName(/xxx|sex|drug/i)]],
    category: ['', [Validators.required, Validators.minLength(2)]],
    image: ['', [Validators.required, FormValidators.allowedData(/.jpg$|.png$|.jpeg$/)]], //todo minusculo
    //rating es un array dentro de mi interface
    rating: this.formBuilder.group({
      rate: [0, [Validators.min(1), Validators.max(30)]],   //para los numeros
      count: [0, [Validators.max(30)]],
    })
  });

/*
 * GETTERS PARA UTILIZARLOS EN EL DOM (html)
 */
  get title() : any{
    return this.formProduct.get('title');
  };
  get price() : any{
    return this.formProduct.get('price');
  };
  get description() : any{
    return this.formProduct.get('description');
  };
  get category() : any{
    return this.formProduct.get('category');
  };
  get image() : any{
    return this.formProduct.get('image');
  };
  get rate(): any {
    return this.formProduct.get('rating.rate');
  };
  get count(): any {
    return this.formProduct.get('rating.count');
  };

  ngOnInit() {
    this.loadProducts();
  }


  private loadProducts() {
    if(this.id){
      //editar producto
      this.editar = true;
      this.productService.getProducto(this.id).subscribe({
        next: value => {
          this.formProduct.setValue(value);
          this.cargado = true;
          console.log(value);
        },
        complete: () => {
          this.showToast('Product loaded', 'bg-success text-light', 1500);
        },
        error: error => {
          this.showToast(error.message, 'bg-danger text-light',2000);
        },
    });
  }else{
      //añadir producto
      this.editar = false;
      this.formProduct.reset();
      this.product = this.formProduct.getRawValue();
    }
    this.cargado = true;
  }

  protected readonly faCartShopping = faCartShopping;
  protected readonly faEdit = faEdit;

  onSubmit() {
    //con este if hago saltar las validacione que no cumplen
    if(this.formProduct.invalid){
      this.formProduct.markAllAsTouched();
      return;
    }
    //si estoy editando recojo el id del formulario en una constante
    if(this.editar){
      const id = this.formProduct.get('id')?.value;
    } if(this.id){
      //ESTOY EDITANDO
      this.productService.updateProduct
      (this.formProduct.get('id')?.value, this.formProduct.getRawValue()).subscribe({
        next: value =>{
          this.showToast(value.title + ' actualizado', 'bg-success text-light',1500);
        },
        complete: ()=>{
          setTimeout(()=>{
            this.router.navigateByUrl('/product-list');
          }, 1000);
        },
        error: error => {
          this.showToast(error.message, 'bg-danger text-light',2000);
        }
      });
    }else{
      //ESTOY AÑADIENDO
      this.productService.addProduct(this.formProduct.getRawValue()).subscribe({
        next: value => {
          this.showToast(value.title + ' añadido', 'bg-success text-light',1500);
        },
        complete: ()=> {
          setTimeout(() => {
            this.router.navigateByUrl('/product-list');
          }, 1000);
        },
        error: error => {
          this.showToast(error.message, 'bg-danger text-light',2000);
        }
      });
    }
    this.showToast('Formulario enviado' , 'bg-success text-light',1500);
  }
}
