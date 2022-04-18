import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { LoadingController } from '@ionic/angular';
import { Router, RoutesRecognized } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';
import jwt_decode from 'jwt-decode';
import { capStorageService } from './cap.storage';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public UserAuthData: any;
  public isAuthenticated: boolean = false;
  public userToken: string;
  public planId: string;
  public loginUser: any;

  selectedTab = '';

  currentUrl;
  previousUrl;


  loggedUser;

  public months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  public expYears = ['21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40']
  constructor(
    private location: Location,
    public loadingController: LoadingController,
    private router: Router,
    private cap: capStorageService,
  ) {
    this.currentUrl = this.router.url;
    this.previousUrl = null;

    this.router.events
      .pipe(filter((event: any) => event instanceof RoutesRecognized), pairwise())
      .subscribe((events: RoutesRecognized[]) => {
        if (events[0].urlAfterRedirects) {
          this.previousUrl = events[0].urlAfterRedirects;
        }
        if (events[1].urlAfterRedirects) {
          this.currentUrl = events[1].urlAfterRedirects;

        }


      });
  }


  public getPreviousUrl() {
    if (this.previousUrl == null) {
      this.router.navigateByUrl('/login')
    } else {
      this.router.navigateByUrl(this.previousUrl)
    }
    // return this.previousUrl;
  }


  getAllStates() {
    let states = ['Abu Dhabi', 'Ajman', 'Dubai', 'Ras Al Khaimah', 'Sharjah', 'Umm Al Quwain'];
    return states;
  }


  //get random number for bill
  getRandomNumber() {
    let billNo = 0;
    let num = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    return num

  }


  goBack() {
    this.location.back();
  }



  async serverLoading() {

    const loading = await this.loadingController.create({
      // spinner: ,
      // duration: 5000,
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    setTimeout(() => {
      // this.loadingController.dismiss();
      this.loadingController.getTop().then(v => v ? this.loadingController.dismiss() : null);
    }, 10000);
    return await loading.present();

  }

  async stopLoading() {
    // this.loadingController.dismiss();
    this.checkAndCloseLoader();

    // sometimes there's delay in finding the loader. so check if the loader is closed after one second. if not closed proceed to close again
    setTimeout(() => this.checkAndCloseLoader(), 1000);
  }


  async checkAndCloseLoader() {
    // Use getTop function to find the loader and dismiss only if loader is present.
    const loader = await this.loadingController.getTop();
    // if loader present then dismiss
    if (loader !== undefined) {
      await this.loadingController.dismiss();
    }
  }




  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    }
    catch (Error) {
      return null;
    }
  }




  generateRandomString(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  year;
  month;
  date;
  withoutTime(eventDate) {
    let date = new Date(eventDate);
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;
    this.date = date.getDate();
    if (this.date < 10) {
      this.date = '0' + this.date;
    }
    if (this.month < 10) {
      this.month = '0' + this.month;
    }
    let datee = this.year + '-' + this.month + '-' + this.date
    return datee
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




}