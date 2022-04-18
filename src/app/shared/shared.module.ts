import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CoreModule } from '../core/core.module';

import { LazyLoadImageModule } from 'ng-lazyload-image';
// import { activeStatusComponent } from './modals/activeStatus.component';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
const sharedComponents = [
  // AddReviewComponent
  // ProviderMealsComponent,
  // NewAddressComponent
  // HeaderComponent,
  // innerHeaderComponent,
  // mealProvidersComponent,
  // searchBarComponent,
  // innerSearchBarComponent,
  // testimonialComponent,
  // // SidebarComponent,
  // // rightSidebarComponent,
  // FooterComponent,

];

@NgModule({
  imports: [
    LazyLoadImageModule,
    CommonModule,
    // NgxPaginationModule,
    // CarouselModule ,
    RouterModule,
    CoreModule,




  ],
  declarations: [sharedComponents],
  exports: sharedComponents,
  providers: [NativeGeocoder,Geolocation,LocationAccuracy],
  entryComponents: []
})
export class SharedModule { }
