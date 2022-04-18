import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpParams, HttpClient } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { Observable, throwError, observable } from "rxjs";
import { ApiService } from '../../core/services/index';
import { Subject } from "rxjs";
import { environment } from '../../../environments/environment';


@Injectable({ providedIn: 'root' })
export class oilService {

    constructor(private _api: ApiService,
        private router: Router,
        private http: HttpClient) { }


    //get oil by id
    getOilById(id: string) {
        return this._api.get(`${"oil/detail/" + id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }


    //get multiple oil by ids
    getMultipleoilByIds(ids) {
        let httpParams = new HttpParams();
        httpParams = httpParams.append('ids', ids)
        return this._api.get(`${"oil/multiple/detail?" + httpParams}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }


    //update oil stock
    updateOilStock(tyreId: string, stockId: string) {
        // let httpParams = new HttpParams();
        // httpParams = httpParams.append('batteryId', batteryId);
        // httpParams = httpParams.append('stockId', stockId);
        return this._api.put(`${"oil/upateOilStock/" + tyreId + '/' + stockId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }


}

