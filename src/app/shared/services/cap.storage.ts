import { Injectable } from '@angular/core';

// import { Storage } from '@ionic/storage-angular';
import jwt_decode from 'jwt-decode';
import { DataService } from './data.service';
import { Storage } from '@capacitor/storage';

@Injectable({
    providedIn: 'root'
})
export class capStorageService {
    // private _storage: Storage | null = null;

    constructor() {

    }

    setKey = async (key, value) => {
        await Storage.set({
            key: key,
            value: value,
        });
    };

    getKey = async (key) => {
        const { value } = await Storage.get({ key: key });
        return value
        // alert(`Hello ${value}!`);
    };



    setName = async (key, value) => {
        await Storage.set({
            key: key,
            value: value,
        });
    };

    checkName = async (key) => {
        const { value } = await Storage.get({ key: key });

        alert(`Hello ${value}!`);
    };

    removeName = async (key) => {
        await Storage.remove({ key: key });
    };


    getDecodedAccessToken(token: string): any {
        try {
            return jwt_decode(token);
        }
        catch (Error) {
            return null;
        }
    }


}
