import { Component, ContentChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoadingController, AlertController, IonInput } from '@ionic/angular';
import { Observable } from 'rxjs';

import { AuthService, AuthResponseData } from './auth.service';
import { loginModel } from './../models/login';
import { userService } from './../../shared/services/user.service';
import { StorageService } from './../../shared/services/storage.servicet';
import { dataStorageService } from './../../shared/services/data.storage';
import { DataService } from 'src/app/shared/services/data.service';
import { authStorageService } from './../../shared/services/authStorage.service';
import { userAuthService } from 'src/app/shared/services/auth.service';
import { Storage } from '@ionic/storage-angular';
import jwt_decode from 'jwt-decode'
import { capStorageService } from './../../shared/services/cap.storage';
import { ApiService } from './../../core/services/api.service';
import { SocService } from './../../shared/services/socket.service';
import { autoLocationService } from './../../shared/services/autoLocation.service';
import { utilityService } from './../../shared/services/utility.service';
import { geoLocationService } from './../../shared/services/geoLocation.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  private _storage: Storage | null = null;
  isLoading = false;
  isLogin = true;
  user = new loginModel()

  authData;
  isAuthenticated: boolean = false;

  isTextFieldType: boolean;
  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: userService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private StorageService: StorageService,
    private dataStorageService: dataStorageService,
    private authStorageService: authStorageService,
    private userAuthService: userAuthService,
    private autoLocationService: autoLocationService,
    private utilService: utilityService,
    private geoLocationService: geoLocationService,
    private SocService: SocService,
    private ApiService: ApiService,
    private cap: capStorageService,
    public data: DataService,
    private storage: Storage
  ) {
    this.init();
    // this.checkIfLogin();

  }


  togglePassword(ele, eye) {
    if (ele.type === 'password') {
      ele.type = 'text';
      eye.name = 'eye-off-outline'
    }
    else {
      ele.type = 'password';
      eye.name = 'eye-outline'
    }
  }

  togglePasswordFieldType() {
    this.isTextFieldType = !this.isTextFieldType;
  }

  //check if already login
  checkIfLogin() {
    this.cap.getKey('authTokk').then(data => {
      this.authData = data
      if (this.authData) {
        this.loadStorageDataInService(data); //load storage data in shared service
        // this.router.navigateByUrl('/dashboard')
      }
    })
  }

  ngOnInit() {
    // this.checkIfLogin();
  }

  async ionViewWillEnter() {
    // this.checkIfLogin();
  }



  disabled: boolean = false;
  onLogin() {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Please Wait...' })
      .then(loadingEl => {
        loadingEl.present();
        this.userService.loginUser(this.user).subscribe(res => {
          loadingEl.dismiss();
          if (!res.success) {
            this.disabled = false;
            this.responseAlert('Error', '', res.message, false)
          } else {
            let tokenData = this.data.getDecodedAccessToken(res.token);
            if (tokenData.role === 'technician') {
              this.cap.setName('authTokk', res.token);
              this.cap.getKey('authTokk').then(data => {
                this.loadStorageDataInService(data); //load storage data in shared service
              })
            } else {
              this.disabled = false;
              this.responseAlert('Error', '', res.message, false)
            }
          }

        })
        setTimeout(() => {
          loadingEl.dismiss(); //auto dismiss after 10s if no response from api
        }, 10000);
      })

  }


  //response alert
  responseAlert(header: string, subHeader: string, message: string, success: boolean) {
    this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: [{
        text: 'Okay',
        handler: () => {
          if (success == true) {
            this.router.navigate(['/login'])
          }
        }
      }]
    }).then(data => {
      data.present()
    });
  }


  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create().then(data => {
    });
  }



  async loadStorageDataInService(data) {
    this.ApiService.token = data; //save token in api service
    this.data.userToken = data; //save user token in shared service
    this.data.UserAuthData = this.getDecodedAccessToken(data); //save auth data in shared service
    this.data.isAuthenticated = true; //logged user status in auth service
    //add user in socket service
    let userData = {
      userId: this.data.UserAuthData._id,
      role: this.data.UserAuthData.role
    }
    this.SocService.emit('addUser', userData);
    this.getUserById();
    //check if user allow location permission
    this.geoLocationService.getUserByIdAndUpdateLocation(this.data.UserAuthData._id);
    this.router.navigate(['/dashboard'])
    // this.utilService.getUserById().then(data => {
    //   if (data) {

    //   }
    // })




  }


  //get user by id

  //get user  by id 
  getUserById() {
    let id = this.data.UserAuthData._id;
    let token = this.data.userToken;
    this.userService.getUserByid(id, token).subscribe(res => {
      if (res.success) {
        this.user = res.data;
        this.data.userLogData = res.data;
      } else {
      }
    })
  }
  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    }
    catch (Error) {
      return null;
    }
  }



}
