import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { StorageService } from './../services/storage.servicet';

import { Storage } from '@ionic/storage-angular';
import { dataStorageService } from './../services/data.storage';
import { DataService } from './../services/data.service';
@Injectable()

export class checkoutGuard implements CanActivate {
    private _storage: Storage | null = null;
    userAuth;
    planId

    public userToken;
    constructor(
        private router: Router,
        private StorageService: StorageService,
        private storage: Storage,
        private dataStorageService: dataStorageService,
        private DataService: DataService
    ) {
        this.init()

    }

    async init() {
        const storage = await this.storage.create().then(data => {
            this.dataStorageService.get('userToken').then(data => {
                this.userToken = data;
            })
            this.dataStorageService.get('planId').then(data => {
                if (data) {
                    this.planId = data;
                    this.DataService.planId = data
                }
            })
        })
        // this._storage = storage;





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
        // this.storage.create().then(data => {
        //     this.storage.get('wa@Auth').then(data => {
        //         this.userAuth = JSON.parse(data)
        //     });

        //     this.storage.get('planId').then(data => {
        //         if (data) {
        //             this.planId = data;
        //             this.DataService.planId = data
        //         }
        //     });
        //     // this._storage = storage;

        // });

        this.userAuth = this.DataService.UserAuthData;
        this.planId = this.DataService.planId;
        if (!this.userAuth && !this.planId) {
            this.userAuth = this.DataService.UserAuthData
            this.planId = this.DataService.planId
        }
        if (this.userAuth && this.planId) {
            let user = this.userAuth
            if (user._id && user.role == "customer") {
                let exp = user.tokenExpirationDate
                if (exp && exp <= Date.now() / 1000) {
                    this.router.navigate(['/login']);
                    return false;
                } else {
                    return true; //True if the token has not the expiration time field
                }
            } else {
                this.router.navigate(['/tab/providers']);
                return false;
            }
        } else {
            this.router.navigate(['/tab/providers']);
            return false;
        }
    }
}






