import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import jwt_decode from 'jwt-decode';
@Injectable({
    providedIn: 'root'
})
export class dataStorageService {
    constructor(public storage: Storage) {  }
    // set a key/value
    async set(key: string, value: any): Promise<any> {
        try {
            const result = await this.storage.set(key, value);
            return true;
        } catch (reason) {

            return false;
        }
    }
    // to get a key/value pair
    async get(key: string): Promise<any> {
        try {
            const result = await this.storage.get(key);
            if (result != null) {
                return result;
            }
            return null;
        } catch (reason) {
            return null;
        }
    }
    // set a key/value object
    async setObject(key: string, object: Object) {
        try {
            const result = await this.storage.set(key, JSON.stringify(object));
            return true;
        } catch (reason) {
            return false;
        }
    }
    // get a key/value object
    async getObject(key: string): Promise<any> {
        try {
            const result = await this.storage.get(key);
            if (result != null) {
                return JSON.parse(result);
            }
            return null;
        } catch (reason) {

            return null;
        }
    }
    // remove a single key value:
    remove(key: string) {
        this.storage.remove(key);
    }
    //  delete all data from your application:
    clear() {
        this.storage.clear();
    }


    getDecodedAccessToken(token: string): any {
        try {
            return jwt_decode(token);
        }
        catch (Error) {
            return null;
        }
    }


    public saveToken(data: any) {
        let user = this.getDecodedAccessToken(data);
        this.storeAuthData(user._id, user.email, user.exp, user.role)
    }

    private storeAuthData(
        userId: string,
        email: string,
        tokenExpirationDate: string,
        role: string
    ) {
        const expirationTime = new Date(
            new Date().getTime() + +tokenExpirationDate * 1000
        );
        let data = {
            userId: userId,
            email: email,
            tokenExpirationDate: expirationTime,
            role: role
        }
        this.setObject('wa@Auth', data);
    }
}