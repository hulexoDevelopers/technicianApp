import { Component, OnInit } from '@angular/core';
import { userService } from './../../../shared/services/user.service';
import { DataService } from 'src/app/shared/services/data.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { jobService } from './../../../shared/services/job.service';
import { Subject } from 'rxjs';
import { SocService } from './../../../shared/services/socket.service';
import { geoLocationService } from './../../../shared/services/geoLocation.service';


@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

  userData;
  isActive;
  isLoad: boolean = false;
  allJobs;

  jobs;

  constructor(
    private userService: userService,
    public data: DataService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private jobService: jobService,
    private SocService: SocService,
    private geoLocationService: geoLocationService,
    public loadingController: LoadingController,
    private router: Router,
  ) { }

  ngOnInit() {

  }


  myChange(ev) {
    if (this.isActive == true) {
      console.log('getting value' + this.isActive)
      this.geoLocationService.getUserByIdAndUpdateLocation(this.data.UserAuthData._id);
    }
    this.updateUserActiveStatus(this.isActive)
    // do stuffs
  }



  //update user active status
  updateUserActiveStatus(status) {
    this.presentLoading();
    let data = {
      status: status
    }
    this.userService.updateActiveStatus(this.userData._id, data).subscribe(res => {
      console.log('res' + JSON.stringify(res));
      this.checkAndCloseLoader();
      if (res.success) {
        this.isActive = status
        // this.getCurrentCoordinates();

      }
    })
  }


  ionViewWillEnter() {
    this.getUserById(this.data.UserAuthData._id);
    this.getUserJobs();
    this.SocService.on('updateJobs').subscribe(data => {
      this.getUserJobs(); //in future we replace with actual data 
    })
  }

  ionViewWillLeave() {
    this.isLoad = false;
  }


  //get user  by id 
  getUserById(id) {
    let token = this.data.userToken;
    this.userService.getUserByid(id, token).subscribe(res => {
      if (res.success) {
        this.userData = res.data;
        if (this.userData.activeStatus == true) {
          this.isActive = true;
        } else {
          this.isActive = false;
        }
        setTimeout(() => {
          this.isLoad = true;
        }, 3000);

      } else {
        // this.data.goBack();
      }
    })
  }


  posts$

  //get user jobs
  getUserJobs() {
    let id = this.data.UserAuthData._id;
    this.jobService.getMyJobs(id).subscribe(res => {
      if (res.data.length > 0) {
        this.allJobs = res.data.reverse();
        this.jobs = res.data;
      } else {
        this.allJobs = [];
      }
    })
  }


  filterJobs(value: string) {
    if (value == 'all') {
      this.allJobs = this.jobs;
      return;
    }
    let jobs = [...this.jobs];
    this.allJobs = jobs.filter(data => data.status == value);
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 10000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }


  async checkAndCloseLoader() {
    // Use getTop function to find the loader and dismiss only if loader is present.
    const loader = await this.loadingController.getTop();
    // if loader present then dismiss
    if (loader !== undefined) {
      await this.loadingController.dismiss();
    }
  }



}
