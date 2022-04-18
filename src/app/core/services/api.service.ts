import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { dataStorageService } from './../../shared/services/data.storage';
import { StorageService } from './../../shared/services/storage.servicet';
import { DataService } from 'src/app/shared/services/data.service';
import { Storage } from '@ionic/storage-angular';
import { capStorageService } from './../../shared/services/cap.storage';
@Injectable()
export class ApiService {

    isAuth: boolean = false;
    token: string;
    // private _storage: Storage | null = null;



    constructor(private http: HttpClient,
        private cap: capStorageService,
        private route: Router, private st: Storage, private dataStorageService: dataStorageService, private storageService: StorageService, private DataService: DataService) {

    }



    private setHeaders(): HttpHeaders {

        if (!this.token) {
            this.cap.getKey('authTokk').then(data => {
                this.token = data;

              
            })
        }

        const headersConfig = {
            "Content-Type": "application/json",
            Accept: "application/json",

        };
        // if (!this.token) {
        //     this.token = this.DataService.userToken
        // }
        let token = this.token
        if (token !== "" && token != null)
            headersConfig["Authorization"] = token;
        headersConfig["key"] = 'data123';
        return new HttpHeaders(headersConfig);
    }

    private formatErrors(error: any) {
        return throwError(error.error);
    }

    get(path: string, httpParams: HttpParams = new HttpParams()): Observable<any> {
        return this.http
            .get(`${environment.api_url}${path}`, {
                headers: this.setHeaders(),
                params: httpParams
            })
            .pipe(catchError(this.formatErrors));
    }

    put(path: string, body: Object = {}): Observable<any> {
        return this.http
            .put(`${environment.api_url}${path}`, JSON.stringify(body), {
                headers: this.setHeaders()
            })
            .pipe(catchError(this.formatErrors));
    }

    post(path: string, body: Object = {}): Observable<any> {
        return this.http
            .post(`${environment.api_url}${path}`, JSON.stringify(body), {
                headers: this.setHeaders()
            })
            .pipe(catchError(this.formatErrors));
    }

    // login(path: string, body: any): Observable<any> {
    //     return this.http
    //         .post(`${environment.login_url}${path}`, body)
    //         .pipe(catchError(this.formatErrors));
    // }

    delete(path): Observable<any> {
        return this.http
            .delete(`${environment.api_url}${path}`, { headers: this.setHeaders() })
            .pipe(catchError(this.formatErrors));
    }

}
