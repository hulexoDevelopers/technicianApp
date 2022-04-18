import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';
import jwt_decode from 'jwt-decode';
import { DataService } from './data.service';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private _storage: Storage | null = null;

    constructor(private storage: Storage, private DataService: DataService) {
        this.init();
    }


    getDecodedAccessToken(token: string): any {
        try {
            return jwt_decode(token);
        }
        catch (Error) {
            return null;
        }
    }

    async init() {
        // If using, define drivers here: await this.storage.defineDriver(/*...*/);
        const storage = await this.storage.create();
        this._storage = storage;
    }

    // Create and expose methods that users of this service can
    // call, for example:
    public set(key: string, value: any) {
        this._storage?.set(key, value);
    }

    public async getAuthData() {
        await this._storage.get('wajAuth')
    }
    userAuth;
    public async get(key: string) {
        // const result: any
        await this._storage.get(key).then(data => {
            if (data) {
                this.userAuth = data
            }

        });
        return this.userAuth


    }

    userAuthData;
    public async getUserAuthData() {
        // const result: any
        await this._storage.get('wajAuth').then(data => {
            this.userAuthData = JSON.parse(data)
        });
        return this.userAuthData


    }


    public saveToken(data: any) {
        let user = this.getDecodedAccessToken(data);
        this.storeAuthData(user._id, user.email, user.exp, user.role, data);
    }

    private storeAuthData(
        userId: string,
        email: string,
        tokenExpirationDate: string,
        role: string,
        token: string
    ) {
        const expirationTime = tokenExpirationDate
        const data = JSON.stringify({
            userId: userId,
            email: email,
            tokenExpirationDate: expirationTime,
            role: role,
            token: token
        });
        this.set('wajAuth', data)
    }

    async logout() {
        await this._storage.remove('wajAuth');

        await this._storage.remove('wa@Auth');
        await this._storage.remove('userToken');
        await this._storage.remove('planId');
        this.DataService.UserAuthData = {};
        this.DataService.isAuthenticated = false;
        this.DataService.userToken = '';
        // window.location.reload();

    }


    async getLoginUser() {

        await this._storage.get('wajAuth').then(data => {
            this.userAuth = JSON.parse(data)
            return this.userAuth
        });
    }


    public setDataKey(key: string, value: any) {
        this._storage?.set(key, value);
    }

    public async getDataKey(key: string) {
        await this._storage.get(key)
    }
}
