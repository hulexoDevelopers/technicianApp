import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpParams, HttpClient } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { Observable, throwError, observable } from "rxjs";
import { ApiService } from '../../core/services/index';
import { Subject } from "rxjs";
import { environment } from '../../../environments/environment';
// import { UserInfoService } from '../../shared/auth/userInfoService';

@Injectable({ providedIn: 'root' })
export class inquiryService {

    constructor(private _api: ApiService,
        private router: Router,
        private http: HttpClient,
    ) { }



    //get enquiry by enquiry id
    getEnquiryById(id: string) {
        return this._api.get(`${"inquiry/" + id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }

    //update enquiry
    updateEnquiry(id: string, data: any) {
        return this._api.put(`${"inquiry/" + id}`, data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }





}

