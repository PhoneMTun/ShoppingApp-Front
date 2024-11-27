import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/auth.interceptor';
import { HomepageComponent } from './homepage/homepage.component';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { TopItemsComponent } from './homepage/top-items/top-items.component';
import { OrderViewComponent } from './order-view/order-view.component';
import { ProductViewComponent } from './product-view/product-view.component';
import { ProductPageComponent } from './product-page/product-page.component';
import { CommonModule } from '@angular/common';
import { AddToCartComponent } from './product-page/add-to-cart/add-to-cart.component';
import { WatchlistComponent } from './product-page/watchlist/watchlist.component';
import { TotalSoldItemsComponent } from './homepage/total-sold-items/total-sold-items.component';
import { ProductFormComponent } from './product-page/product-form/product-form.component';
import { OrderPageComponent } from './order-page/order-page.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomepageComponent,
    SidebarComponent,
    TopItemsComponent,
    OrderViewComponent,
    ProductViewComponent,
    ProductPageComponent,
    AddToCartComponent,
    WatchlistComponent,
    TotalSoldItemsComponent,
    ProductFormComponent,
    OrderPageComponent,
    ConfirmationComponent,
    UnauthorizedComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    CommonModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
