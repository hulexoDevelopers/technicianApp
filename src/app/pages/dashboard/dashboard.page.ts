import { Component, OnInit } from '@angular/core';
import { userService } from './../../shared/services/user.service';
import { DataService } from 'src/app/shared/services/data.service';
import { Router } from '@angular/router';
import { AlertController, ModalController, LoadingController } from '@ionic/angular';
import { activeStatusComponent } from './../../shared/modals/activeStatus.component';
import { utilityService } from './../../shared/services/utility.service';
import { jobService } from './../../shared/services/job.service';
import { geoLocationService } from './../../shared/services/geoLocation.service';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationEvents, BackgroundGeolocationResponse } from '@awesome-cordova-plugins/background-geolocation/ngx';

declare var window;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  locations: any;

  config: BackgroundGeolocationConfig = {
    //Both
    desiredAccuracy: 20, // Desired Accuracy of the location updates (lower means more accurate but more battery consumption)
    distanceFilter: 5, // (Meters) How far you must move from the last point to trigger a location update
    debug: true, // <-- Enable to show visual indications when you receive a background location update
    interval: 9000, // (Milliseconds) Requested Interval in between location updates.
    // useActivityDetection: true, // Uses Activitiy detection to shut off gps when you are still (Greatly enhances Battery Life)

    //Android Only
    notificationTitle: 'BG Plugin', // customize the title of the notification
    notificationText: 'Tracking', //customize the text of the notification
    fastestInterval: 5000 // <-- (Milliseconds) Fastest interval your app / server can handle updates
  };
  latitude: any = 0; //latitude
  longitude: any = 0; //longitude


  wlatitude: any = 0; //latitude
  wlongitude: any = 0; //longitude

  userData;
  userAuth;
  isLoad: boolean = false;
  address: string;
  isActive: boolean;


  totalJobs = 0;
  totalPending = 0;
  totalCompleted = 0;
  totalRejected = 0;

  lat = 0;
  long = 0;
  constructor(
    private userService: userService,
    public data: DataService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private utilityService: utilityService,
    private geoLocationService: geoLocationService,
    private loadingController: LoadingController,
    private jobService: jobService,
    private backgroundGeolocation: BackgroundGeolocation,
    private router: Router,
  ) {
    this.userAuth = this.data.UserAuthData;
    this.locations = [];
    this.backgroundGeolocation.configure(this.config)
      .then(() => {

        this.backgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe((location: BackgroundGeolocationResponse) => {
          console.log('bg - loc dashboard', location);

          this.lat = location.latitude;
          this.long = location.longitude;
          let address = {
            lat: this.lat,
            long: this.long
          };
          if(this.userData){
            console.log('we have user data let update location from dashboard.ts')
            this.userData.data[0] = address;
            this.updateMyLocation();
          }
        
          // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
          // and the background-task may be completed.  You must do this regardless if your operations are successful or not.
          // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
          // this.backgroundGeolocation.finish(); // FOR IOS ONLY
        });

      });
  }


  updateMyLocation() {
    this.userService.updateUserLocation(this.userData._id, this.userData).subscribe(res => {
      console.log('res  ' + JSON.stringify(res))
      if (res.success) {
        console.log('user data is updated for dash.ts' + this.lat + this.long)
        // this.getMyLocation();
        // this.dismiss(true)
      }
    }, error => {
      console.log('err ' + error)
    })
  }


  options = {
    timeout: 10000,
    enableHighAccuracy: true,
    maximumAge: 3600
  };



  start() {
    console.log('bg start')
    // this.backgroundGeolocation.start();
    window.app.backgroundGeolocation.start()
  }
  stop() {

    console.log('bg stop')
    // this.backgroundGeolocation.stop();
    window.app.backgroundGeolocation.stop()
  }

  myChange(ev) {
    console.log('change method call')
    if (this.isActive == true) {
      
      this.geoLocationService.getUserByIdAndUpdateLocation(this.data.UserAuthData._id);
      this.start();
    } else {
      this.stop();
    }
    this.updateUserActiveStatus(this.isActive)
    // do stuffs
  }




  // }
  watchVehicle
  ngOnInit() {

    this.getAllJobs();
    this.utilityService.getUserById().then((data: any) => {
      this.isActive = data.activeStatus;
      this.userData = data;
      this.isLoad = true;
    })
  }


  //get all technician jobs lis
  getAllJobs() {
    this.jobService.getMyJobs(this.data.UserAuthData._id).subscribe(res => {
      this.totalJobs = res.data.length;
      this.totalPending = res.data.filter(data => data.status == 'pending').length;
      this.totalCompleted = res.data.filter(data => data.status == 'completed').length;
      this.totalRejected = res.data.filter(data => data.status == 'rejected').length;
    })
  }


  async ionViewWillEnter() {
    // this.getUserById(this.data.UserAuthData._id);
    this.getUserById(this.data.UserAuthData._id);
    this.getAllJobs();
    this.utilityService.getUserById().then((data: any) => {
      // this.isActive = data.activeStatus;
      this.userData = data;
      this.isLoad = true;
    })
  }

  //get user  by id 
  getUserById(id) {
    let token = this.data.userToken;
    this.userService.getUserByid(id, token).subscribe(res => {
      if (res.success) {
        this.userData = res.data;
        if (this.userData.activeStatus == true) {
          this.isActive = true;
        } else {
          this.isActive = false;
        }
        this.isLoad = true;
      } else {
        // this.data.goBack();
      }
    })
  }

  async activeStatusComp() {
    const modal = await this.modalCtrl.create({
      component: activeStatusComponent,
    });
    modal.onDidDismiss()
      .then((data) => {
        if (data) {
          this.utilityService.getUserById().then((data: any) => {
            this.isActive = data.activeStatus;
            this.isLoad = true;
          })
        }
        // const filters = data['data']; // Here's your selected user!
        // if (filters.isChange == true) {
        //   // this.customAddress = filters.info
        //   // this.isCustom = true;
        // } else {

        // }

      });
    return await modal.present();
  }






  //update user active status
  updateUserActiveStatus(status) {
    this.presentLoading();
    let data = {
      status: status
    }
    console.log('user id' + this.userData._id);
    console.log('data' + JSON.stringify(data));

    this.userService.updateActiveStatus(this.userData._id, data).subscribe(res => {
      this.checkAndCloseLoader();
      if (res.success) {
        this.isActive = status
        this.getCurrentCoordinates();

      }
    })
  }


  //my distance = 0.33539887019732967
  //subhan distance = 0.4211953038283229

  getDistance() {
    let lat1 = '31.714245671967138';
    let lon1 = '72.98962056751141';
    let lat2 = '31.7150671';
    let lon2 = '72.9862088';

    let distance = this.getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2);

    // console.log('distance' + distance);

  }


  // use geolocation to get user's device coordinates
  getCurrentCoordinates() {
    // this.geolocation.getCurrentPosition().then((resp) => {
    //   // console.log(resp)
    //   this.latitude = resp.coords.latitude;
    //   this.longitude = resp.coords.longitude;
    //   this.getAddress(this.latitude, this.longitude);


    //   // watch.subscribe((data) => {
    //   // console.log('watch data' + JSON.stringify(data))
    //   // data can be a set of coordinates, or an error (if an error occurred).

    //   // });
    // }).catch((error) => {
    //   // console.log('Error getting location', error);
    // });
  }
  // geocoder options
  // nativeGeocoderOptions: NativeGeocoderOptions = {
  //   useLocale: true,
  //   maxResults: 5
  // };
  // get address using coordinates
  // getAddress(lat, long) {
  //   this.nativeGeocoder.reverseGeocode(lat, long, this.nativeGeocoderOptions)
  //     .then((res: NativeGeocoderResult[]) => {
  //       this.address = this.pretifyAddress(res[0]);
  //     })
  //     .catch((error: any) => {
  //       alert('Error getting location' + JSON.stringify(error));
  //     });
  // }

  // address
  pretifyAddress(address) {
    let obj = [];
    let data = "";
    for (let key in address) {
      obj.push(address[key]);
    }
    obj.reverse();
    for (let val in obj) {
      if (obj[val].length)
        data += obj[val] + ', ';
    }
    return address.slice(0, -2);
  }


  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180)
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 10000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }


  async checkAndCloseLoader() {
    // Use getTop function to find the loader and dismiss only if loader is present.
    const loader = await this.loadingController.getTop();
    // if loader present then dismiss
    if (loader !== undefined) {
      await this.loadingController.dismiss();
    }
  }
}
