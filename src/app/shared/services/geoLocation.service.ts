import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { LoadingController } from '@ionic/angular';
import { Router, RoutesRecognized } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';
import jwt_decode from 'jwt-decode';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { userService } from './../services/user.service';

import { NgZone } from '@angular/core';
import { Capacitor } from "@capacitor/core";
import { LocationService } from '../services/location.service';
// const { Geolocation, Toast } = Plugins;
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { ToastController } from '@ionic/angular';
import { SocService } from './../services/socket.service';
import { Subject } from 'rxjs';
import { capStorageService } from './cap.storage';
import { utilityService } from './utility.service';
@Injectable({
    providedIn: 'root'
})
export class geoLocationService {

    public UserAuthData: any;
    public isAuthenticated: boolean = false;
    public userToken: string;
    private DataService: DataService;
    private cap: capStorageService;
    private utilityService: utilityService;
    public planId: string;

    selectedTab = '';

    currentUrl;
    previousUrl;

    userData;
    isUser: boolean = false;
    isActive: boolean = true;
    isLoad: boolean = false;

    lat;
    lng;
    watchId;

    lastLat: any = '0';
    lastLong: any = '0';


    private _userLocationDetails: Subject<any> = new Subject<any>();    // consider putting the actual type of the data you will receive
    public userLocationDetailsObs = this._userLocationDetails.asObservable();

    constructor(
        private location: Location,
        public loadingController: LoadingController,
        private router: Router,
        private data: DataService,
        private modalCtrl: ModalController,
        private userService: userService,
        public ngZone: NgZone, private locationService: LocationService,
        private geolocation: Geolocation,
        private nativeGeocoder: NativeGeocoder,
        public toastController: ToastController,
        private SocService: SocService,
    ) {
    }



    //get user  by id 
    getUserByIdAndUpdateLocation(id) {
        let token = this.data.userToken;
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
                this.getMyLocation();
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


    async getMyLocation() {
        const hasPermission = await this.locationService.checkGPSPermission();
        if (hasPermission) {
            if (Capacitor.isNative) {
                const canUseGPS = await this.locationService.askToTurnOnGPS();
                this.postGPSPermission(canUseGPS);
            }
            else {
                this.postGPSPermission(true);
            }
        }
        else {
            const permission = await this.locationService.requestGPSPermission();
            if (permission === 'CAN_REQUEST' || permission === 'GOT_PERMISSION') {
                if (Capacitor.isNative) {
                    const canUseGPS = await this.locationService.askToTurnOnGPS();
                    this.postGPSPermission(canUseGPS);
                }
                else { this.postGPSPermission(true); }
            }
            else {
                this.utilityService.logoutUser().then(async data => {
                    const toast = await this.toastController.create({
                        message: 'User denied location permission Please allow location access from your  setting.',
                        duration: 2000
                    });
                    this.updateUserActiveStatus(false);
                    // this.router.navigate(['/login'], { replaceUrl: true });
                    toast.present();
                })

            }
        }
    }




    async postGPSPermission(canUseGPS: boolean) {
        if (canUseGPS) {
            // this.uploadAppLocation();
            this.updateAppLocation();

        }
        else {
            const toast = await this.toastController.create({
                message: 'Please turn on your GPS.',
                duration: 2000
            });
            toast.present();
            this.updateUserActiveStatus(false);
            // this.router.navigate(['/login'], { replaceUrl: true });
            // await Toast.show({
            //   text: 'Please turn on GPS to get location'
            // })
        }
    }

    //update app location to server
    updateAppLocation() {
        this.geolocation.getCurrentPosition().then((resp) => {
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
                this.updateMyLocation() //upload location to server
                this.watchPosition() //watch app position
            }
            // resp.coords.latitude
            // resp.coords.longitude
        }).catch((error) => {
            console.log('Error getting location', error);
        });

    }


    //update user active status
    updateUserActiveStatus(status) {
        let data = {
            status: status
        }
        this.userService.updateActiveStatus(this.userData._id, data).subscribe(res => {
            if (res.success) {
                this.isActive = status
                // this.getCurrentCoordinates();

            }
        })
    }


    distance;
    async uploadAppLocation() {
        try {
            let watch = this.geolocation.getCurrentPosition();
            watch.then((data: any) => {

                this.ngZone.run(() => {
                    // if (err) { console.log('err', err); return; }
                    this.lat = data.coords.latitude;
                    this.lng = data.coords.longitude;
                    this.lastLat = data.coords.latitude;
                    this.lastLong = data.coords.longitude;
                    if (this.lat, this.lng) {
                        let address = {
                            lat: this.lat,
                            long: this.lng
                        }
                        if (this.userData.data.length > 0) {
                            this.userData.data[0] = address;
                        } else {
                            this.userData.data.push(address)
                        }

                        this.userData.data.push(address);
                        this.updateMyLocation();
                        // this.router.navigate(['/dashboard']);
                        this.watchPosition();
                    }
                    this.clearWatch();
                })
            });
        }
        catch (err) { console.log('err', err) }
    }




    //watch position

    async watchPosition() {
        try {
            let watch = this.geolocation.watchPosition();
            watch.subscribe((data: any) => {
                this.ngZone.run(async () => {

                    this.lat = data.coords.latitude;
                    this.lng = data.coords.longitude;

                    let distance = await this.data.getDistanceFromLatLonInKm(this.lat, this.lng, this.lastLat, this.lastLong);
                    this.distance = distance;
                    if (this.lat, this.lng) {
                        let address = {
                            lat: this.lat,
                            long: this.lng
                        };

                        let data11 = {
                            lat: this.lat,
                            long: this.lng,
                            randomNum: this.data.getRandomNumber(),
                            date: new Date(),
                            distance: this.distance
                        }

                        this._userLocationDetails.next(data11)



                        // 0.5 meter away

                        if (distance > 0.1) {
                            console.log('distance is greater than 0.1 p;ease update my location')
                            this.lastLat = data.coords.latitude;
                            this.lastLong = data.coords.longitude;
                            if (this.userData.data.length > 0) {
                                this.userData.data[0] = address;
                            } else {
                                this.userData.data.push(address)
                            }
                            this.userData.log.push(new Date())
                            this.updateMyLocation();

                        }
                    }
                    this.clearWatch();
                })
            });
            //   this.ngZone.run(() => {
            //     // if (err) { console.log('err', err); return; }
            //     this.lat = data.coords.latitude;
            //     this.lng = data.coords.longitude;

            //     // console.log('lat ' + this.lat);
            //     // console.log('long' + this.lng);

            //     if (this.lat, this.lng) {
            //       this.getCurrentAddress(this.lat, this.lng);
            //     }
            //     this.clearWatch();
            //   })
            // });
        }
        catch (err) { console.log('err', err) }
    }





    clearWatch() {
        if (this.watchId != null) {
            navigator.geolocation.clearWatch(this.watchId)
            // this.geolocation.clearWatch({ id: this.watchId });
        }
    }


    options: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5
    };

    getCurrentAddress(lat, long) {
        this.nativeGeocoder.reverseGeocode(lat, long, this.options)
            .then((result: NativeGeocoderResult[]) => {
                this.userData.data.address = result[0];
                this.updateMyLocation();
            })


            .catch((error: any) => console.log(error));

        this.nativeGeocoder.forwardGeocode('Berlin', this.options)
            .then((result: NativeGeocoderResult[]) => console.log('The coordinates are latitude=' + result[0].latitude + ' and longitude=' + result[0].longitude))
            .catch((error: any) => console.log(error));
    }




    updateMyLocation() {
        this.userService.updateUser(this.userData._id, this.userData).subscribe(res => {
            if (res.success) {
                console.log('user data is updated' + this.lat + this.lng)
                // this.getMyLocation();
                // this.dismiss(true)
            }
        })
    }



    //check user permission allow
    async checkpermissonAllow() {
        const hasPermission = await this.locationService.checkGPSPermission();
        if (hasPermission) {
            if (Capacitor.isNative) {
                const canUseGPS = await this.locationService.askToTurnOnGPS();
                this.postGPSPermission(canUseGPS);
            }
            else { this.postGPSPermission(true); }
        }
        else {
            const permission = await this.locationService.requestGPSPermission();
            if (permission === 'CAN_REQUEST' || permission === 'GOT_PERMISSION') {
                if (Capacitor.isNative) {
                    const canUseGPS = await this.locationService.askToTurnOnGPS();
                    this.postGPSPermission(canUseGPS);
                }
                else { this.postGPSPermission(true); }
            }
            else {
                this.cap.removeName('authTokk');
                this.DataService.UserAuthData = '';
                this.DataService.userToken = '';
                this.router.navigate(['/login'], { replaceUrl: true });
                const toast = await this.toastController.create({
                    message: 'User denied location permission.',
                    duration: 2000
                });
                toast.present();

            }
        }
    }

}