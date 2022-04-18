import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpParams, HttpClient } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { Observable, throwError, observable } from "rxjs";
import { ApiService } from '../../core/services/index';
import { Subject } from "rxjs";
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class batteryService {

    constructor(private _api: ApiService,
        private router: Router,
        private http: HttpClient,
    ) { }



    //get battery by id
    getBatteryById(id: string) {
        return this._api.get(`${"battery/detail/" + id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }


    //get multiple batteries by ids
    getMultiplebatteriesByIds(ids) {
        let httpParams = new HttpParams();
        httpParams = httpParams.append('ids', ids)
        return this._api.get(`${"battery/multiple/detail?" + httpParams}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }


    //update battery stock
    updateBatteryStock(batteryId: string, stockId: string) {
        // let httpParams = new HttpParams();
        // httpParams = httpParams.append('batteryId', batteryId);
        // httpParams = httpParams.append('stockId', stockId);
        return this._api.put(`${"battery/upateBatteryStock/" + batteryId + '/' + stockId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }

}

