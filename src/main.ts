import { Component, OnInit, NgModule, Injectable, Input, Output, EventEmitter } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { RouterModule, Routes, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';



///////////////////////////////////////// assets /////////////////////////////////////////////////////////

///////////// src/assets/products.ts /////////////
const products = [
  {
    id: 1,
    name: 'Phone XL',
    price: 799,
    description: 'A large phone with one of the best screens'
  },
  {
    id: 2,
    name: 'Phone Mini',
    price: 699,
    description: 'A great phone with one of the best cameras'
  },
  {
    id: 3,
    name: 'Phone Standard',
    price: 299,
    description: ''
  }
];
//////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////






///////////////////////////////////////// services ///////////////////////////////////////////////////////

///////////// src/app/shopping/cart.service.ts /////////////
@Injectable({
  providedIn: 'root'
})
class CartService {
  private _items: any[] = [];
  
  public get items(): any[] {
    return this._items;
  }
  
  public addToCart(product: object ): void {
    this._items.push(product);
  }
  
  public clearCar(): any[] {
    this._items = []
    return this._items;
  }
  
  getShippingPrices(): any {
    return this.http.get('/assets/shipping.json');
  }
  
  constructor(
    private http: HttpClient
    ) { }
  }
////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////







///////////////////////////////////////// shopping module ////////////////////////////////////////////////
  
///////////// src/app/shopping/product-list.component.ts /////////////
  @Component({
    selector: 'app-product-list',
    template: `<h2>Products</h2>

<div *ngFor="let product of products">
  <h3>
    <a
    [title]="product.name + ' details'"
    [routerLink]="['/products', product.id]">
    {{ product.name }}
  </a>
</h3>
<p *ngIf="product.description">
  Description: {{ product.description }}
</p>
<button (click)="share()">
  Share
</button>
<app-product-alerts
[productChild]="product"
(toNotify)="onNotify()"
>
</app-product-alerts>
</div>`
})
class ProductListComponent {
  products = products;
  
  share() {
    window.alert("The product has been shared!");
  }
  
  onNotify() {
    window.alert("You will be notified when the product goes on sale");
  }
  
}
//////////////////////////////////////////////////////////////////////

///////////// src/app/shopping/product-alerts.component.ts /////////////
@Component({
  selector: 'app-product-alerts',
  template: `<p *ngIf="productChild.price > 700">
    <button (click)="toNotify.emit()">
      Notify Me
    </button>
  </p>`
})
class ProductAlertsComponent {
  @Input() productChild: any;
  @Output() toNotify = new EventEmitter();
  
  constructor() { }
  
}
////////////////////////////////////////////////////////////////////////

///////////// src/app/shopping/product-details.component.ts /////////////
@Component({
  selector: 'app-product-details',
  template: `<h2>Product Details</h2>

<div *ngIf="product">
  <h3>{{ product.name }}</h3>
  <h4>{{ product.price | currency }}</h4>
  <p>{{ product.description }}</p>
  <button (click)="addToCart(product)">Add to Cart</button>
  
</div>`
})
class ProductDetailsComponent implements OnInit {
  product: any;
  
  constructor(
    private route: ActivatedRoute,
    private cartService: CartService
    ) { }
    
    addToCart(product: any) {
      this.cartService.addToCart(product);
      window.alert('Your product has been added to the cart!');
    }
    
    ngOnInit(): void {
      // First get the product id from the current route.
      const routeParams = this.route.snapshot.paramMap;
      const productIdFromRoute = Number(routeParams.get('productId'));
      
      // Find the product that correspond with the id provided in route.
      this.product = products.find(product => product.id === productIdFromRoute);
    }
    
  }
/////////////////////////////////////////////////////////////////////////
  
///////////// src/app/shopping/cart.component.ts /////////////
@Component({
  selector: 'app-cart',
  template: `<h3>Cart</h3>

<p>
  <a routerLink="/shipping">Shipping Prices</a>
</p>

<div class="cart-item" *ngFor="let item of items">
  <a [routerLink]="['/products', item.id]">
    <span>{{ item.name }}</span>
  </a>
  <span>{{ item.price | currency }}</span>
</div>`
})
class CartComponent{
  items: any[] = this.cartService.items;
  
  constructor(
    private cartService: CartService
    ) { }
    
  }
//////////////////////////////////////////////////////////////
    
///////////// src/app/shopping/shipping.component.ts /////////////
@Component({
  selector: 'app-shipping',
  template: `<h3>Shipping Prices</h3>

<div class="shipping-item" *ngFor="let shipping of shippingCosts | async">
  <span>{{ shipping.type }}</span>
  <span>{{ shipping.price | currency }}</span>
</div>`
})
class ShippingComponent {
  shippingCosts: any = this.cartService.getShippingPrices();
  
constructor(
  private cartService: CartService
  ) { }
  
}
//////////////////////////////////////////////////////////////////
  
///////////// src/app/shopping/shopping.module.ts /////////////
@NgModule({
  declarations: [
    ProductListComponent,
    ProductAlertsComponent,
    ProductDetailsComponent,
    CartComponent,
    ShippingComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forRoot([
      { path: "", component: ProductListComponent },
      { path: "products/:productId", component: ProductDetailsComponent },
      { path: "cart", component: CartComponent },
      { path: "shipping", component: ShippingComponent }
    ]),
  ]
})
class ShoppingModule { }
///////////////////////////////////////////////////////////////
  
//////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  
  
  
  
  
  
///////////////////////////////////////// app-routing module /////////////////////////////////////////////
  
///////////// src/app/app-routing.module.ts /////////////
const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
class AppRoutingModule { }
/////////////////////////////////////////////////////////
  
//////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  
  
  
  
  
  
///////////////////////////////////////// app module /////////////////////////////////////////////////////
  
///////////// src/app/top-bar.component.ts /////////////
@Component({
  selector: 'app-top-bar',
  template: `<a [routerLink]="['/']">
  <h1>My Store</h1>
</a>

<a class="button fancy-button" routerLink="/cart"><i class="material-icons">shopping_cart</i>Checkout</a>`
})
class TopBarComponent { }
////////////////////////////////////////////////////////

///////////// src/app/app.component.ts /////////////
@Component({
  selector: 'app-root',
  template: `<app-top-bar></app-top-bar>

<div class="container">
  <router-outlet></router-outlet>
</div>`
})
class AppComponent { }
////////////////////////////////////////////////////

///////////// src/app/app.module.ts /////////////
@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ShoppingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
class AppModule { }
/////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////






///////////////////////////////////////// src/main.ts ////////////////////////////////////////////////////

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

//////////////////////////////////////////////////////////////////////////////////////////////////////////