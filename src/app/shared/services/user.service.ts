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
export class userService {

  constructor(private _api: ApiService,
    private router: Router,
    private http: HttpClient,
    // private userService: UserInfoService
  ) { }


  //add new user
  registerNewUser(data) {
    return this._api.post(`${"users/register"}`, data)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => Observable.throw(error))
      );
  }



  //add new
  loginUser(data) {
    return this._api.post(`${"users/login"}`, data)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => Observable.throw(error))
      );
  }


  //get user by uuid
  getUserByid(id, token: string = '') {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('access_token', token)
    return this._api.get(`${"users/byId/" + id + "?" + httpParams}`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => Observable.throw(error))
      )
  }



  //change password
  changePassword(data) {
    return this._api.post(`${"users/changePassword"}`, data)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => Observable.throw(error))
      )
  }

  //update user
  updateUser(id, data) {
    return this._api.put(`${"users/update/" + id}`, data)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => Observable.throw(error))
      )
  }

  //update user location
  updateUserLocation(id, data) {
    return this._api.put(`${"users/updateLocation/" + id}`, data)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => error)
      )
  }

  //update technician active status
  updateActiveStatus(id, data) {
    return this._api.put(`${"users/updateActiveStatus/" + id}`, data)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => Observable.throw(error))
      )
  }


  //forget password
  forgetPassword(data) {
    return this._api.post(`${"users/forgetPassword"}`, data)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => Observable.throw(error))
      )
  }


}

