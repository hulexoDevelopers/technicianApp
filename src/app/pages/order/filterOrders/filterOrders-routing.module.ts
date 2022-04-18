import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { filterOrdersPage } from './filterOrders.page';

const routes: Routes = [
  {
    path: '',
    component: filterOrdersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class filterOrdersPageRoutingModule {}
