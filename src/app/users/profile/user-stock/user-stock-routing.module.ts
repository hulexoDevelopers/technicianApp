import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserStockPage } from './user-stock.page';

const routes: Routes = [
  {
    path: '',
    component: UserStockPage
  },
  {
    path: 'order-detail/:id',
    loadChildren: () => import('./user-stock.module').then( m => m.UserStockPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserStockPageRoutingModule {}
