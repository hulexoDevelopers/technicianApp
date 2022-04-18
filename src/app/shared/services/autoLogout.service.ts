import { Router } from '@angular/router';
// import { AuthService } from './auth.service';
import { Injectable, NgZone } from '@angular/core';
import { capStorageService } from './cap.storage';
import { DataService } from 'src/app/shared/services/data.service';

const MINUTES_UNITL_AUTO_LOGOUT = 5 // in Minutes
const CHECK_INTERVALL = 50000 // in ms
const STORE_KEY = 'lastAction';
import jwt_decode from 'jwt-decode';
@Injectable({
    providedIn: 'root'
})
export class AutoLogoutService {

    constructor(
        private cap: capStorageService,
        private router: Router,
        private data: DataService,
        private ngZone: NgZone
    ) {
        this.check();
        this.initListener();
        this.initInterval();
    }

    get lastAction() {
        return this.cap.getKey('authTokk')
    }
    set lastAction(value) {
        this.cap.setKey(STORE_KEY, value);
    }

    initListener() {
        this.ngZone.runOutsideAngular(() => {
            document.body.addEventListener('click', () => this.reset());
        });
    }

    initInterval() {
        this.ngZone.runOutsideAngular(() => {
            setInterval(() => {
                this.check();
            }, CHECK_INTERVALL);
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

    reset() {
        // this.lastAction = Date.now();
    }

    check() {
        let token;
        let exp;
        this.cap.getKey('authTokk').then(data => {
            let userToekn = this.getDecodedAccessToken(data);
            if (userToekn) {
                token = userToekn;
            }
            if (userToekn && userToekn.exp) {
                exp = userToekn.exp;
            }




            // const now = Date.now();
            // const timeleft = this.lastAction + MINUTES_UNITL_AUTO_LOGOUT * 60 * 1000;
            // const diff = timeleft - now;
            // const isTimeout = diff < 0;

            this.ngZone.run(() => {

                // let exp = this.data.UserAuthData.exp

                if (exp && exp <= Date.now() / 1000) {
            
                    this.cap.removeName('authTokk');
                    this.cap.removeName('planId');
                    this.data.UserAuthData = '';
                    this.data.userToken = '';
                    this.logout();
                    // this.router.navigate(['/tab/home']);
                }
                // if (isTimeout && this.data.userToken) {
          
                //     this.cap.removeName('authTokk');
                //     this.data.UserAuthData = '';
                //     this.data.userToken = '';
                //     this.router.navigate(['/login']);
                // }
            });
        })
    }


    logout() {
        this.cap.removeName('authTokk');
        this.cap.removeName('planId')
        this.data.UserAuthData = '';
        this.data.userToken = '';
        // this.userData = {};
        // this.totalOrders = 0;
        // this.storage.clear();
        // this.StorageService.logout();
        this.router.navigate(['/login'], { replaceUrl: true });
        window.location.reload();
        // this.router.navigate(['/login'])
    }
}