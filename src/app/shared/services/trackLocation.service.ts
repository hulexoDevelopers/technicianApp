import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DataService } from './data.service';
// import { DataService } from './../../services/data.service';
import { userService } from './user.service';

import { NgZone } from '@angular/core';
import { Capacitor } from "@capacitor/core";
import { LocationService } from './location.service';
// const { Geolocation, Toast } = Plugins;
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { ToastController } from '@ionic/angular';
import { SocService } from './socket.service';
import jwt_decode from 'jwt-decode';
@Injectable({
    providedIn: 'root'
})
export class updateLocationService {


    lat;
    lng;
    watchId;
    userData;
    constructor(public storage: Storage,
        private data: DataService,
        private modalCtrl: ModalController,
        private userService: userService,
        public ngZone: NgZone, private locationService: LocationService,
        private geolocation: Geolocation,
        private nativeGeocoder: NativeGeocoder,
        public toastController: ToastController,
        private SocService: SocService) {

    }



    //get user  by id 
    getAndUpdateUserLocation(id) {
        let token = this.data.userToken;
        this.userService.getUserByid(id, token).subscribe(res => {
            if (res.success) {
                // this.userData = res.data;
                this.getMyLocation();
            } else {
                // this.data.goBack();
            }
        })
    }
    // set a key/value
    async getMyLocation() {
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
                const toast = await this.toastController.create({
                    message: 'User denied location permission.',
                    duration: 2000
                });
                toast.present();
                // await Toast.show({
                //   text: 'User denied location permission'
                // })
            }
        }
    }

    async postGPSPermission(canUseGPS: boolean) {
        if (canUseGPS) { this.uploadAppLocation(); }
        else {
            const toast = await this.toastController.create({
                message: 'Please turn on GPS to get locatio.',
                duration: 2000
            });
            toast.present();
            // await Toast.show({
            //   text: 'Please turn on GPS to get location'
            // })
        }
    }

    async watchPosition() {
        try {
            let watch = this.geolocation.watchPosition();
            watch.subscribe((data: any) => {

                this.ngZone.run(() => {
                    // if (err) { console.log('err', err); return; }
                    this.lat = data.coords.latitude;
                    this.lng = data.coords.longitude;


                    if (this.lat, this.lng) {
                        this.getCurrentAddress(this.lat, this.lng);
                    }
                    this.clearWatch();
                })
            });
        }
        catch (err) { console.log('err', err) }
    }



    async uploadAppLocation() {
        try {
            let watch = this.geolocation.getCurrentPosition();
            watch.then((data: any) => {

                this.ngZone.run(() => {
                    // if (err) { console.log('err', err); return; }
                    this.lat = data.coords.latitude;
                    this.lng = data.coords.longitude;
                    if (this.lat, this.lng) {
                        let address = {
                            lat: this.lat,
                            long: this.lng
                        }
                        this.userData.data.push(address)
                        this.updateMyLocation();

                    }

                    // if (this.lat, this.lng) {
                    //     this.getCurrentAddress(this.lat, this.lng);
                    // }
                    this.clearWatch();
                })
            });
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
                console.log('user data going to live my location' + JSON.stringify(this.userData))
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
                console.log('res location is updated' + res)
            }
        })
    }
}