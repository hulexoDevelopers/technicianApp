import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';
import jwt_decode from 'jwt-decode';

@Injectable({
    providedIn: 'root'
})
export class authStorageService {
    private _storage: Storage | null = null;

    constructor(private storage: Storage) {
        // this.init();
        this._storage = storage;
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



    public setDataKey(key: string, value: any) {
        this._storage?.set(key, value);
    }

    public async getDataKey(key: string) {
        await this._storage.get(key)
    }
}
