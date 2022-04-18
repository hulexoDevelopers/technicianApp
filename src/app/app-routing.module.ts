import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './shared/auth/auth.guard';
const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./users/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'orders',
    loadChildren: () => import('./pages/order/orders/orders.module').then(m => m.OrdersPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'orders-filter/:id',
    loadChildren: () => import('./pages/order/filterOrders/filterOrders.module').then(m => m.filterOrdersPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'stock',
    loadChildren: () => import('./pages/myStock/stock.module').then(m => m.StockPageModule),
    canActivate: [authGuard]
  },


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
  providers: [authGuard],
})
export class AppRoutingModule { }
