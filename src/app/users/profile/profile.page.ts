import { Component, OnInit } from '@angular/core';
import { StorageService } from './../../shared/services/storage.servicet';
import { Router } from '@angular/router';
import { Stripe } from '@ionic-native/stripe/ngx';
import { dataStorageService } from './../../shared/services/data.storage';
import { userService } from './../../shared/services/user.service';
import { orderService } from './../../shared/services/order.service';
import { reviewService } from './../../shared/services/review.service';
import { DataService } from './../../shared/services/data.service';
import { Storage } from '@ionic/storage-angular';
import { capStorageService } from './../../shared/services/cap.storage';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  userData;
  userAuth;
  totalOrders = 0
  isLoad: boolean = false;
  constructor(
    private StorageService: StorageService,
    private dataStorageService: dataStorageService,
    private userService: userService,
    private orderService: orderService,
    private reviewService: reviewService,
    private router: Router,
    public stripe: Stripe,
    public data: DataService,
    private cap: capStorageService,
    private storage: Storage
  ) {

    this.userAuth = this.data.UserAuthData;
  }

  async ngOnInit() {

  }


  async ionViewWillEnter() {
    this.getUserById(this.data.UserAuthData._id);
    this.getAllCustomerOrders(this.data.UserAuthData._id);


  }




  //get user  by id 
  getUserById(id) {
    let token = this.data.userToken;
    this.userService.getUserByid(id, token).subscribe(res => {
      if (res.success) {
        this.userData = res.data;
        this.isLoad = true;
      } else {
        // this.data.goBack();
      }
    })
  }

  //get all orders
  getAllCustomerOrders(id) {
    // let id = this.userAuth._id;

    this.orderService.getAllCustomerOrders(id).subscribe(res => {
      this.totalOrders = res.data.length;
    })
  }


  logout() {
    this.cap.removeName('authTokk');
    this.data.UserAuthData = '';
    this.data.userToken = '';
    // this.userData = {};
    // this.totalOrders = 0;
    // this.storage.clear();
    // this.StorageService.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
    // this.router.navigate(['/login'])
  }

}
