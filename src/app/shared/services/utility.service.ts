import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpParams, HttpClient } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { Observable, throwError, observable } from "rxjs";
import { ApiService } from '../../core/services/index';
import { Subject } from "rxjs";
import { environment } from '../../../environments/environment';
// import { UserInfoService } from '../../shared/auth/userInfoService';
import { userService } from './user.service';
import { DataService } from './data.service';
import { capStorageService } from './cap.storage';
import { autoLocationService } from './autoLocation.service';

@Injectable({ providedIn: 'root' })
export class utilityService {



    constructor(private _api: ApiService,
        private router: Router,
        private http: HttpClient,
        private userService: userService,
        private DataService: DataService,
        private cap: capStorageService,
        private autoLocationService: autoLocationService,
    ) { }


    getUserById() {
        let promise = new Promise((resolve, reject) => {
            let token = this.DataService.userToken;
            let userId = this.DataService.UserAuthData._id;
            this.userService.getUserByid(userId, token)
                .toPromise()
                .then(
                    res => { // Success
                        this.DataService.loginUser = res.data;
                        resolve(res.data);
                    },
                    msg => { // Error
                        reject(false);
                    }
                );
        });
        return promise;
    }



    //update user active status
    updateUserStatus(status: boolean) {
        if (status == true) {
            this.autoLocationService.getMyLocation()
        } else {
            // console.log('No need to check loation and if location please unsbscribe location')
        }

        let promise = new Promise((resolve, reject) => {
            this.DataService.loginUser.activeStatus = status;
            this.userService.updateUser(this.DataService.UserAuthData._id, this.DataService.loginUser)
                .toPromise()
                .then(
                    res => { // Success
                        this.getUserById()
                        resolve(true);
                    },
                    msg => { // Error
                        reject(false);
                    }
                );
        });
        return promise;
        this.DataService.loginUser.activeStatus = status;
        this.userService.updateUser(this.DataService.UserAuthData._id, this.DataService.loginUser).subscribe(res => {
            if (res.success) {
                this.getUserById();
                return true;
                // this.getMyLocation();
                // this.dismiss(true)
            } else {
                return false;
            }
        })
    }


    //logout user
    logoutUser() {
        let promise = new Promise((resolve, reject) => {
            this.DataService.loginUser.activeStatus = false;
            this.userService.updateUser(this.DataService.UserAuthData._id, this.DataService.loginUser)
                .toPromise()
                .then(
                    res => { // Success
                        this.DataService.loginUser = {};
                        this._api.token = null; //remove token in api service
                        this.DataService.userToken = null; //remove user token in shared service
                        this.DataService.UserAuthData = null //remove auth data in shared service
                        this.DataService.isAuthenticated = false; //logged user status in auth service
                        this.cap.removeName('authTokk');
                        resolve(res);
                    },
                    msg => { // Error
                        reject(msg);
                    }
                );
        });
        return promise;

    }


}

