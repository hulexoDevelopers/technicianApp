import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { StorageService } from './../services/storage.servicet';

import { Storage } from '@ionic/storage-angular';
import { dataStorageService } from './../services/data.storage';
import { DataService } from './../services/data.service';
@Injectable()

export class authGuard implements CanActivate {
    private _storage: Storage | null = null;
    userAuth;

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
        const storage = await this.storage.create();
        this._storage = storage;


        this.dataStorageService.get('userToken').then(data => {
            this.userToken = data;
        })

        this.dataStorageService.get('planId').then(data => {
            if (data) {
                this.DataService.planId = data
            }
        })
    }

    checkIfLogin() {

        this.StorageService.getAuthData().then(data => {

        })
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
        if (this.userAuth) {
            let user = this.userAuth
            if (user._id && user.role == "technician") {
                let exp = user.tokenExpirationDate

                if (exp && exp <= Date.now() / 1000) {

                    this.router.navigate(['/login']);
                    return false;
                } else {
                    return true; //True if the token has not the expiration time field
                }
            } else {
                this.router.navigate(['/login']);
                return false;
            }
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }
}






