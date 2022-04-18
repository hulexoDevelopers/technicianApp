import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpParams, HttpClient } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { Observable, throwError, observable } from "rxjs";
import { ApiService } from '../../core/services/index';
import { Subject } from "rxjs";
import { environment } from '../../../environments/environment';


@Injectable({ providedIn: 'root' })
export class stripeService {

    constructor(private _api: ApiService,
        private router: Router,
        private http: HttpClient
    ) { }


    //create card token
    createCardToken(data) {
        return this._api.post(`${"stripe/create-token"}`, data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }



    //create paymet intent
    createPaymentIntent(data) {
        return this._api.post(`${"stripe/payment-intent"}`, data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }


}

