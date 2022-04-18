import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoreModule } from './../../core/core.module';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from './../../shared/shared.module';
import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';
import { activeStatusComponent } from 'src/app/shared/modals/activeStatus.component';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder/ngx';
@NgModule({
  imports: [


    CommonModule,
    FormsModule,
    CoreModule,
    SharedModule,
    IonicModule,
    DashboardPageRoutingModule
  ],
  providers: [NativeGeocoder,Geolocation,LocationAccuracy,AndroidPermissions],
  declarations: [DashboardPage,activeStatusComponent]
})
export class DashboardPageModule { }
