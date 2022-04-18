import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpParams, HttpClient } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { Observable, throwError, observable } from "rxjs";
import { ApiService } from '../../core/services/index';
import { Subject } from "rxjs";
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class tyreStockService {

    constructor(private _api: ApiService,
        private router: Router,
        private http: HttpClient,
    ) { }



    //get stock by user assign
    getStockByUserAssign(data) {
        let httpParams = new HttpParams();
        httpParams = httpParams.append('tyreId', data.tyreId);
        httpParams = httpParams.append('stockId', data.stockId);
        httpParams = httpParams.append('techId', data.techId);
        return this._api.get(`${"tyreStock/byTechAssign?" + httpParams}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }


    //get tech stock detail
    getTechStockDetail(data) {
        let httpParams = new HttpParams();
        httpParams = httpParams.append('tyreId', data.tyreId);
        httpParams = httpParams.append('techId', data.techId);
        return this._api.get(`${"tyreStock/techTotalAssign?" + httpParams}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }


    getTechTyreStockDetail(data) {
        let httpParams = new HttpParams();
        httpParams = httpParams.append('tyreId', data.tyreId);
        httpParams = httpParams.append('techId', data.techId);
        return this._api.get(`${"tyreStock/byTechTyreDetaiL?" + httpParams}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }


    //get battery stock detail
    getTyreStockDetails(data) {
        let httpParams = new HttpParams();
        httpParams = httpParams.append('tyreId', data.tyreId);
        // httpParams = httpParams.append('techId', data.techId);
        return this._api.get(`${"tyreStock/byTyreIdTech?" + httpParams}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }







    //update battery stock by id
    updateTyreStock(id: string, data: any) {
        return this._api.put(`${"tyreStock/" + id}`, data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }





}

