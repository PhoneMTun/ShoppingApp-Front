import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../app/auth/login/login.component';
import { RegisterComponent } from '../app/auth/register/register.component';
import { HomepageComponent } from './homepage/homepage.component';
import { OrderViewComponent } from './order-view/order-view.component';
import { ProductViewComponent } from './product-view/product-view.component';
import { ProductPageComponent } from './product-page/product-page.component';
import { OrderPageComponent } from './order-page/order-page.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { RoleGuard } from './guards/role.guard';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, 
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'homepage', component: HomepageComponent },
  { path: 'order/:id/:userId', component: OrderViewComponent, canActivate: [RoleGuard] },
  { path: 'product/:id', component: ProductViewComponent },
  { path: 'products', component: ProductPageComponent },
  { path: 'orders', component: OrderPageComponent },
  { path: 'confirmation', component: ConfirmationComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
