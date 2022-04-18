import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserOrdersPage } from './user-orders.page';

const routes: Routes = [
  {
    path: '',
    component: UserOrdersPage
  },
  {
    path: 'order-detail/:id',
    loadChildren: () => import('./order-detail/order-detail.module').then( m => m.OrderDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserOrdersPageRoutingModule {}
