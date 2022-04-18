import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/shared/services/data.service';
import { registerModel } from '../../models/register';
import { userService } from './../../../shared/services/user.service';
import { Storage } from '@ionic/storage-angular';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.page.html',
  styleUrls: ['./user-settings.page.scss'],
})
export class UserSettingsPage implements OnInit {
  userData;
  authData;
  user = new registerModel();
  isDataLoad: boolean = false;

  userAddress;
  allStates;
  state = null;

  constructor(
    private userService: userService,
    private router: Router,
    public data: DataService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private storage: Storage
  ) {
    this.allStates = this.data.getAllStates();
  }

  async ngOnInit() {
    this.authData = this.data.UserAuthData
  }


  async ionViewWillEnter() {
    this.authData = this.data.UserAuthData
    this.getAutStorageData();
    // await this.storage.create().then(data => {
    //   this.getAutStorageData();
    //   // this.loadStorageDataInService();
    // });

  }

  public async getAutStorageData() {
    this.getUserById(this.authData._id);


  }

  // //get user by id
  getUserById(id) {
    let token = this.data.userToken;
    this.userService.getUserByid(id, token).subscribe(res => {
      if (res.success && res.data.email) {
        this.userData = res.data;
        this.user = res.data;
        this.isDataLoad = true
      }
    })
  }


  updateProfile() {
    let id = this.userData._id;
    this.userService.updateUser(id, this.user).subscribe(res => {
      if (!res.success) {
        this.responseAlert('Error', '', res.message, false)
      } else {
        this.responseAlert('Success', '', res.message, true)
      }
      // this.getUserById(id);
    })
  }


  oldPassword;
  newPassword;
  updateUserPassword() {
    let data = {
      id: this.userData._id,
      password: this.oldPassword,
      newPassword: this.newPassword
    }
    this.userService.changePassword(data).subscribe(res => {
      if (!res.success) {
        this.responseAlert('Error', '', res.message, false)
      } else {
        this.responseAlert('Success', '', res.message, true)
      }
      // this.getUserById(this.userData._id);
    })
  }



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
            // this.router.navigate(['/login'])
          }
        }
      }]
    }).then(data => {
      data.present()
    });
  }
}
