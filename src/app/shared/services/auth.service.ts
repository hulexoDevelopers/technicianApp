import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
// import { Plugins } from '@capacitor/core';
import { Storage } from '@ionic/storage-angular';
import jwt_decode from 'jwt-decode';
import { environment } from '../../../environments/environment';
import { User } from './user.model';
import { dataStorageService } from './data.storage';

export interface AuthResponseData {
    _id: string;
    email: string;
    userName: string;
    refreshToken: string;
    role: string;
    token: string;
    expiresIn: string;
    // registered?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class userAuthService implements OnDestroy {
    private _user = new BehaviorSubject<User>(null);
    private activeLogoutTimer: any;

    get userIsAuthenticated() {
        return this._user.asObservable().pipe(
            map(user => {
                if (user) {
                    return !!user.token;
                } else {
                    return false;
                }
            })
        );
    }

    get userId() {
        return this._user.asObservable().pipe(
            map(user => {
                if (user) {
                    return user.id;
                } else {
                    return null;
                }
            })
        );
    }

    get token() {
        return this._user.asObservable().pipe(
            map(user => {
                if (user) {
                    return user.token;
                } else {
                    return null;
                }
            })
        );
    }

    constructor(private http: HttpClient, private dataStorageService: dataStorageService) { }

    //   autoLogin() {
    //     return from(Plugins.Storage.get({ key: 'authData' })).pipe(
    //       map(storedData => {
    //         if (!storedData || !storedData.value) {
    //           return null;
    //         }
    //         const parsedData = JSON.parse(storedData.value) as {
    //           token: string;
    //           tokenExpirationDate: string;
    //           userId: string;
    //           email: string;
    //         };
    //         const expirationTime = new Date(parsedData.tokenExpirationDate);
    //         if (expirationTime <= new Date()) {
    //           return null;
    //         }
    //         const user = new User(
    //           parsedData.userId,
    //           parsedData.email,
    //           parsedData.token,
    //           expirationTime
    //         );
    //         return user;
    //       }),
    //       tap(user => {
    //         if (user) {
    //           this._user.next(user);
    //           this.autoLogout(user.tokenDuration);
    //         }
    //       }),
    //       map(user => {
    //         return !!user;
    //       })
    //     );
    //   }

    //   signup(email: string, password: string) {
    //     return this.http
    //       .post<AuthResponseData>(
    //         `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${
    //           environment.firebaseAPIKey
    //         }`,
    //         { email: email, password: password, returnSecureToken: true }
    //       )
    //       .pipe(tap(this.setUserData.bind(this)));
    //   }

    getDecodedAccessToken(token: string): any {
        try {
            return jwt_decode(token);
        }
        catch (Error) {
            return null;
        }
    }

    login(email: string, password: string) {
        return this.http
            .post<AuthResponseData>(
                `http://143.198.158.119:3000/api/users/login`,
                { email: email, password: password }
            )
            .pipe(tap(this.setUserData.bind(this)));
    }

    //   logout() {
    //     if (this.activeLogoutTimer) {
    //       clearTimeout(this.activeLogoutTimer);
    //     }
    //     this._user.next(null);
    //     Plugins.Storage.remove({ key: 'authData' });
    //   }

    ngOnDestroy() {
        if (this.activeLogoutTimer) {
            clearTimeout(this.activeLogoutTimer);
        }
    }

    //   private autoLogout(duration: number) {
    //     if (this.activeLogoutTimer) {
    //       clearTimeout(this.activeLogoutTimer);
    //     }
    //     this.activeLogoutTimer = setTimeout(() => {
    //       this.logout();
    //     }, duration);
    //   }

    private setUserData(data) {

        const userData = this.getDecodedAccessToken(data);

        const expirationTime = new Date(
            new Date().getTime() + +userData.expiresIn * 1000
        );
        const user = new User(
            userData._id,
            userData.email,
            userData.token,
            expirationTime
        );
        this._user.next(user);
        // this.autoLogout(user.tokenDuration);
        this.storeAuthData(
            userData._id,
            userData.token,
            expirationTime.toISOString(),
            userData.email
        );
    }

    private storeAuthData(
        userId: string,
        token: string,
        tokenExpirationDate: string,
        email: string
    ) {
        const data = JSON.stringify({
            userId: userId,
            token: token,
            tokenExpirationDate: tokenExpirationDate,
            email: email
        });
        // Plugins.Storage.set({ key: 'authData', value: data });
        this.dataStorageService.set('loginUser', data)
    }
}
