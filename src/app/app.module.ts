import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Stripe } from '@ionic-native/stripe/ngx';
import { resourceService } from './shared/services/resource.service';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { AgmCoreModule } from '@agm/core';
import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';
import { interceptorProviders } from './interceptor.module';

// import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    LazyLoadImageModule,
    SharedModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(),
    AgmCoreModule.forRoot({
      // apiKey: 'AIzaSyDFhkX2pBymZ1cOIsWCPkE6F7hZ9ycF4Ds',
      apiKey: 'AIzaSyA2Xs1XgrxpKiilv6LxjOEi128JhkHB-do',
      libraries: ['places']
    }),
    AppRoutingModule,

  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, Stripe,
    interceptorProviders,
    , {
    provide: APP_INITIALIZER,
    useFactory: resourceProviderFactory,
    deps: [resourceService],
    multi: true
  },
  // Diagnostic,
    LocationAccuracy,
    AndroidPermissions,
    LocalNotifications
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
export function resourceProviderFactory(provider: resourceService) {
  return () => provider.loadData();
}