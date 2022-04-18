import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { StorageService } from './../services/storage.servicet';

import { Storage } from '@ionic/storage-angular';
import { dataStorageService } from './../services/data.storage';
import { DataService } from './../services/data.service';
@Injectable()

export class generalGuard implements CanActivate {

    userAuth;

    public userToken;
    constructor(
        private router: Router,
        private StorageService: StorageService,
        private storage: Storage,
        private dataStorageService: dataStorageService,
        private DataService: DataService
    ) {
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
        
        if (this.userAuth) {
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
                this.router.navigate(['/login']);
                return false;
            }
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }
}






