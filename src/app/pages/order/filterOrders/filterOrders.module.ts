import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { filterOrdersPageRoutingModule } from './filterOrders-routing.module';
import { filterOrdersPage } from './filterOrders.page';

@NgModule({
  imports: [

  CommonModule,
    FormsModule,
    IonicModule,
    filterOrdersPageRoutingModule
  ],
  declarations: [filterOrdersPage]
})
export class filterOrdersPageModule {}
