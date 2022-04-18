import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserOrdersPageRoutingModule } from './user-orders-routing.module';

import { UserOrdersPage } from './user-orders.page';
import { LazyLoadImageModule } from 'ng-lazyload-image';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LazyLoadImageModule,
    IonicModule,
    UserOrdersPageRoutingModule
  ],
  declarations: [UserOrdersPage]
})
export class UserOrdersPageModule {}
