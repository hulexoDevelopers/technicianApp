import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { StorageService } from './../services/storage.servicet';

import { Storage } from '@ionic/storage-angular';
import { dataStorageService } from './../services/data.storage';
import { DataService } from './../services/data.service';
import { AlertController } from '@ionic/angular';
@Injectable()

export class gCheckoutGuard implements CanActivate {

    userAuth;
    planId
    public userToken;
    public alertPresented: any;
    constructor(
        private router: Router,
        private StorageService: StorageService,
        private storage: Storage,
        private alertCtrl: AlertController,
        private dataStorageService: dataStorageService,
        private DataService: DataService
    ) {
        this.alertPresented = false
        // this.init()

    }



    getDecodedAccessToken(token: string): any {
        try {
            return jwt_decode(token);
        }
        catch (Error) {
            return null;
        }
    }

    async canActivate() {

        this.userAuth = this.DataService.UserAuthData;
        this.planId = this.DataService.planId;
        if (this.userAuth) {
            let user = this.userAuth
            if (user._id && user.role == "customer" && this.planId) {
                let exp = user.tokenExpirationDate

                if (exp && exp <= Date.now() / 1000) {
                    this.showAlert('Please login to proceed your order')
                    this.router.navigate(['/login']);
                    return false;
                } else {
                    return true; //True if the token has not the expiration time field
                }
            } else {
                this.router.navigate(['/tab/providers']);
                // this.showAlert();
                this.showAlert('Please select meal plan')
                return false;
            }
        } else {
            this.showAlert('Please login to proceed your order')
            this.router.navigate(['/tab/providers']);
            return false;
        }
    }



    private showAlert(message:string) {
        if (!this.alertPresented) {
            this.alertPresented = true;

            this.alertCtrl
                .create({
                    header: 'Error',
                    message: message,
                    // buttons: ['Okay']
                    buttons: [
                        {
                            text: 'Okay',
                            handler: () => {
                                this.alertPresented = false;
                            }
                        }
                    ]
                })
                .then(alertEl => alertEl.present());

        }
    }




}



