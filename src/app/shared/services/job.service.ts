import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpParams, HttpClient } from "@angular/common/http";
import { catchError, map, retry, tap } from "rxjs/operators";
import { Observable, throwError, observable } from "rxjs";
import { ApiService } from '../../core/services/index';
import { Subject } from "rxjs";
import { environment } from '../../../environments/environment';
// import { UserInfoService } from '../auth/userInfoService';

@Injectable({ providedIn: 'root' })
export class jobService {

    constructor(private _api: ApiService,
        private router: Router,
        private http: HttpClient,
    ) { }


    
    private readonly postAction$ = new Subject();

    getPosts(id): Observable<[]> {
        return this._api.get(`${"job/bytechId/" + id}`)
            .pipe(
                retry(1),
                // map((res: any) => res),
                catchError((error: any) => Observable.throw(error)),
                tap(() => this.postAction$.next())
            );
        // return this.http.post<Posts[]>(this.myAppUrl + this.myApiPostsUrl, this.authService.getLoggedUserFromSessionStorage())
        //     .pipe(
        //         retry(1),
        //         catchError(this.errorHandler),
        //         tap(() => this.postAction$.next())
        //     );
    }

    //get my jobs
    getMyJobs(id) {
        return this._api.get(`${"job/bytechId/" + id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }

    //get job by id
    getjobById(id: string) {
        return this._api.get(`${"job/" + id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }


    //get job by id
    getjobWithDetailById(id: string) {
        return this._api.get(`${"job/getJobWithDetail/" + id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }


    //update job 
    updateJob(id: string, data: any) {
        return this._api.put(`${"job/" + id}`, data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }

    //delete battery
    deleteJob(id: string) {
        return this._api.put(`${"job/delete/" + id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }
}

