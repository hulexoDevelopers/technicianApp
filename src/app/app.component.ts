import { Component } from '@angular/core';
import { StorageService } from './shared/services/storage.servicet';
import { dataStorageService } from './shared/services/data.storage';
import { DataService } from './shared/services/data.service';
import { Storage } from '@ionic/storage-angular';
import jwt_decode from 'jwt-decode';
import { ViewChildren, QueryList } from '@angular/core';

import { Platform, IonRouterOutlet, ToastController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
// import { Platform } from 'ionic-angular';
// import { Platform } from '@ionic/angular';
import { capStorageService } from './shared/services/cap.storage';
import { AutoLogoutService } from './shared/services/autoLogout.service';
import { SocService } from './shared/services/socket.service';
import { updateLocationService } from './shared/services/trackLocation.service';
import { autoLocationService } from './shared/services/autoLocation.service';
import { userService } from './shared/services/user.service';
import { utilityService } from './shared/services/utility.service';

import { ELocalNotificationTriggerUnit, LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';
import { ApiService } from './core/services/api.service';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  loggedIn = false;
  //code for exit app
  // set up hardware back button event.
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;

  updateJobData
  //code for exit app
  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;
  private _storage: Storage | null = null;
  constructor(
    private DataService: DataService,
    private cap: capStorageService,
    private userService: userService,
    // private diagnostic: Diagnostic,
    // private autoLogout: AutoLogoutService,
    // private userService: userService,
    private SocService: SocService,
    public platform: Platform,
    // private storage: Storage,
    private toastController: ToastController,
    private ApiService: ApiService,
    // private updateLocationService: updateLocationService,
    // private autoLocationService: autoLocationService,
    private LocalNotifications: LocalNotifications,
    private utilitService: utilityService,
    private geolocation: Geolocation,
    private alertCtrl: AlertController,
    private router: Router
  ) {

    this.initializeApp(); //initialize app for local notifications
    this.backButtonEvent(); // Initialize BackButton Eevent.
    this.saveSharedDataFromStorage() //if page refresh save default data;
  }

  ionViewWillEnter() {
    this.initializeApp(); //initialize app for local notifications
    this.backButtonEvent(); // Initialize BackButton Eevent.
    this.saveSharedDataFromStorage() //if page refresh save default data;
  }


  // remove this function
  ngAfterViewInit() { }


  //initialize app for local notifications
  initializeApp() {
    this.platform.ready().then(() => {
      this.LocalNotifications.on('click').subscribe(res => {
        let msg = res.data ? res.data.myData : '';
        this.showAlert(res.title, res.text, msg)
      });

      this.LocalNotifications.on('trigger').subscribe(res => {
        let msg = res.data ? res.data.myData : '';
        this.showAlert(res.title, res.text, msg)
      })
      // this.statusBar.styleLightContent();
      // this.splash.hide()
    });
  }





  public loadScript(url) {
    let node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(node);
  }


  async ngOnInit() {
    this.loadScript("https://unpkg.com/tesseract.js@2.1.5/dist/tesseract.min.js");
    

    // cordova.plugins.diagnostic.isLocationEnabled(function (enabled) {
    // alert("Location is " + (enabled ? "enabled" : "disabled"));
    // }, function (error) {
    //   alert("The following error occurred: " + error);
    // });
    this.saveSharedDataFromStorage()

    //socet service for locaiton update job
    this.SocService.on('updateJobs').subscribe(data => {
      this.updateJobData = data;
      //send notification if login
      this.cap.getKey('authTokk').then(data => {
        if (data) {
          this.DataService.userToken = data;
          this.DataService.UserAuthData = this.DataService.getDecodedAccessToken(data);
          if (this.DataService.UserAuthData._id == this.updateJobData.technicianId) {
            this.scheduleNotfications('Order Assigned', `Order no ${this.updateJobData.inquiryId}  Assigned to you`, this.updateJobData.inquiryId)
          }

        }
      })
    })


    setInterval(function () {
      this.platform.ready().then(() => {
        if (!this.DataService.userToken) {
          return;
        }
        this.geolocation.getCurrentPosition().then((resp) => {
          resp.coords.latitude;
          resp.coords.longitude;

          this.lat = resp.coords.latitude;
          this.lng = resp.coords.longitude;
          this.lastLat = resp.coords.latitude;
          this.lastLong = resp.coords.longitude;
          if (this.lat, this.lng) {
            let address = {
              lat: this.lat,
              long: this.lng
            }
            if (this.userData.data.length > 0) {
              this.userData.data[0] = address;
            } else {
              this.userData.data = [];
              this.userData.data.push(address)
            }
          }
          this.userService.updateUser(this.userData._id, this.userData).subscribe(res => {
            if (res.success) {
              console.log('user data is updated' + this.lat + this.lng)
              // this.getMyLocation();
              // this.dismiss(true)
            }
          })
        }).catch((error) => {
          console.log('Error getting location', error);
        });


      })
    }, 20000);



  }


  // active hardware back button
  backButtonEvent() {
    this.platform.backButton.subscribe(async () => {

      this.routerOutlets.forEach(async (outlet: IonRouterOutlet) => {
        if (outlet && outlet.canGoBack()) {
          outlet.pop();

        }

        if (this.router.url != '/dashboard') {
          this.DataService.goBack();
        }

        if (this.router.url === '/dashboard') {
          if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
            // this.platform.exitApp(); // Exit from app
            navigator['app'].exitApp(); // work in ionic 4
          } else {
            const toast = await this.toastController.create({
              message: 'Press back again to exit App.',
              duration: 2000,
              position: 'middle'
            });
            toast.present();
            this.lastTimeBackPress = new Date().getTime();
          }
        }
      });
    });
  }



  saveSharedDataFromStorage() {
    this.cap.getKey('authTokk').then(data => {
      if (data) {
        this.DataService.userToken = data;
        this.DataService.UserAuthData = this.DataService.getDecodedAccessToken(data);
        this.DataService.isAuthenticated = true;
        this.ApiService.token = data; //save token in api service
        this.getUserById();
        // this.utilitService.getUserById().then(data => [

        // ])
        let userData = {
          userId: this.DataService.UserAuthData._id,
          role: this.DataService.UserAuthData.role
        }
        this.SocService.emit('addUser', userData);

        //function for get user and update his data
        // this.autoLocationService.getUserByIdAndUpdateLocation(this.DataService.UserAuthData._id)
      }

    })
  }



  //show alert 
  private showAlert(header, subheader, message: string) {
    this.alertCtrl
      .create({
        header: header,
        subHeader: subheader,
        message: message,
        buttons: [
          {
            text: 'Okay',
            handler: () => {
              this.router.navigate(["/orders/order-detail", this.updateJobData.inquiryId]);
            }
          },
        ]
      })
      .then(alertEl => alertEl.present());
  }

  //location new notification
  scheduleNotfications(title: string, text: string, orderId: string) {
    this.LocalNotifications.schedule({
      id: this.DataService.getRandomNumber(),
      title: title,
      text: text,
      data: { mydata: orderId },
      trigger: { in: 5, unit: ELocalNotificationTriggerUnit.SECOND },
      foreground: true
    })
  }



  //get and update location repeat
  getMyUpdateLocation() {
    console.log('i m calling location')
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log('resp ' + resp.coords.latitude)
      resp.coords.latitude
      resp.coords.longitude
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }


  userData;
  isActive;
  lastLat;
  lastLong;
  isUser
  getUserByIdAndUpdateLocation(id) {
    let token = this.DataService.userToken;
    this.userService.getUserByid(id, token).subscribe(res => {
      if (res.success) {
        this.userData = res.data;
        this.isActive = res.data.activeStatus;
        // this.DataService.loggedUser = res.data;
        if (this.userData.data.length > 0) {
          if (this.userData.data[0].lat) {
            this.lastLat = this.userData.data[0].lat;
            this.lastLong = this.userData.data[0].long;
          }
        }
        this.isUser = true;


      } else {
        // this.data.goBack();
      }
    })
  }


  //logout function move this functin to data service
  logout() {
    this.cap.removeName('authTokk');
    this.utilitService.logoutUser().then(data => {
      if (data) {
        this.router.navigate(['/login'], { replaceUrl: true });
      }
    })

    this.router.navigate(['/login'], { replaceUrl: true });

  }

  user;
  isLoggedin = false;
  //get user  by id 
  getUserById() {
    let id = this.DataService.UserAuthData._id;
    let token = this.DataService.userToken;
    this.userService.getUserByid(id, token).subscribe(res => {
      if (res.success) {
        this.user = res.data;
        this.isLoggedin = true;
      } else {
        this.user = ''
        this.isLoggedin = false;
        // this.data.goBack();
      }
    })
  }
}
