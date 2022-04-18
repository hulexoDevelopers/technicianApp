import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderDetailPageRoutingModule } from './order-detail-routing.module';

import { OrderDetailPage } from './order-detail.page';
import { trackCustomerComponent } from 'src/app/shared/modals/trackCustomer/trackCustomer.component';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';   // agm-direction
import { voidOrderComponent } from 'src/app/shared/modals/voidOrder/voidOrder.component';
import { otherBatteryComponent } from 'src/app/shared/modals/otherBattery/otherBattery.component';
import { confirmOrderComponent } from 'src/app/shared/modals/confirmOrder/confirmOrder.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AgmCoreModule.forRoot({
      // apiKey: 'AIzaSyDFhkX2pBymZ1cOIsWCPkE6F7hZ9ycF4Ds',
      apiKey: 'AIzaSyA2Xs1XgrxpKiilv6LxjOEi128JhkHB-do',
      libraries: ['places']
    }),
    AgmDirectionModule,
    IonicModule,
    OrderDetailPageRoutingModule
  ],
  declarations: [OrderDetailPage,trackCustomerComponent,voidOrderComponent,otherBatteryComponent,confirmOrderComponent],
  entryComponents:[trackCustomerComponent,voidOrderComponent,otherBatteryComponent,confirmOrderComponent]
})
export class OrderDetailPageModule {}
