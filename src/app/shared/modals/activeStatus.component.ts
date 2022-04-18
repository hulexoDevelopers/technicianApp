import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DataService } from '../services/data.service';
// import { DataService } from './../../services/data.service';
import { userService } from './../services/user.service';

import { NgZone } from '@angular/core';
import { Capacitor } from "@capacitor/core";
import { LocationService } from '../services/location.service';
// const { Geolocation, Toast } = Plugins;
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { ToastController } from '@ionic/angular';
import { SocService } from './../services/socket.service';
import { utilityService } from './../services/utility.service';
@Component({
  selector: 'app-activeStatus',
  templateUrl: './activeStatus.component.html',
  styleUrls: ['./activeStatus.component.scss'],
})
export class activeStatusComponent implements OnInit {

  userData;
  isUser: boolean = false;
  isActive: boolean = true;
  isLoad: boolean = false;

  lat;
  lng;
  watchId;

  lastLat: any = '0';
  lastLong: any = '0';
  constructor(
    private data: DataService,
    private modalCtrl: ModalController,
    private userService: userService,
    public ngZone: NgZone, private locationService: LocationService,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    public toastController: ToastController,
    private SocService: SocService,
    private utilityService: utilityService,
  ) {

  }

  ngOnInit() {
    this.userData = this.data.loginUser;
    this.isActive = this.data.loginUser.activeStatus;
    this.isLoad = true;

    // this.getUserById(this.data.UserAuthData._id);
    // this.utilityService.getUserById().then(data => {

    // })
  }


  distance;
  //get user  by id 
  getUserById(id) {
    let token = this.data.userToken;
    this.userService.getUserByid(id, token).subscribe(res => {
      if (res.success) {
        this.userData = res.data;
        this.isActive = res.data.activeStatus
        this.isUser = true;
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


  changeStatus(value) {
    this.isActive = value;
    this.utilityService.updateUserStatus(value).then(data => {
      this.dismiss(true);
    })

    // this.userData.activeStatus = value;
    // // this.updateUser();
    // // this.getMyLocation();
  }

  updateUser() {
    this.userService.updateUser(this.userData._id, this.userData).subscribe(res => {
      if (res.success) {
        // console.log('update user res' + JSON.stringify(res))
        // this.getMyLocation();
        // this.dismiss(true)
      }
    })
  }

  saveAddressDetail() {
    // let data = {
    //   address: this.address,
    //   street: this.street,
    //   notes: this.notes

    // }

    // this.dismiss(true, data)
  }



  dismiss(value: boolean = false, data: any = {}) {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      'dismissed': true,
      'isChange': value,
      info: data
    });
  }







}
