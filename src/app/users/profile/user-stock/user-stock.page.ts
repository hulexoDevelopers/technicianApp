import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';
import { StorageService } from './../../../shared/services/storage.servicet';
import { Storage } from '@ionic/storage-angular';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-user-stock',
  templateUrl: './user-stock.page.html',
  styleUrls: ['./user-stock.page.scss'],
})
export class UserStockPage implements OnInit {
  private _storage: Storage | null = null;
  userAuth;

  allOrders;
  dataLoad: boolean = false;
  defaultImage = '../../../../assets/img/meal-placeholder.jpg';
  constructor(
    public data: DataService,
    private orderService: orderService,
    private StorageService: StorageService,
    private loadingCtrl: LoadingController,
    private router: Router,
    private alertCtrl: AlertController,
    private storage: Storage,
  ) {

  }

  async ngOnInit() {

    this.userAuth = this.data.UserAuthData;
    this.getUserOrders(this.userAuth._id);
  }

  ionViewWillEnter() {
  }

  //get all orders
  getAllCustomerOrders(userId) {
    let id = userId;
    this.orderService.getAllCustomerOrders(id).subscribe(res => {
      this.allOrders = res.data;
      this.dataLoad = true;
    })
  }

  plans = [];
  companies = [];
  isOrders: boolean = false;


  getUserOrders(userId) {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1);
    let id = userId;

    this.orderService.getAllCustomerOrdersWithDetails(id).subscribe(res => {
      this.allOrders = res.data.reverse();

      for (let j = 0; j < this.allOrders.length; j++) {
        if (this.allOrders[j].schedule.length > 0) {
          let max2 = this.allOrders[j].schedule;
          let res2 = new Date(Math.max.apply(null, max2.map(function (e) {
            return new Date(e.start);
          })));
          if (tomorrow > new Date(res2)) {
            this.allOrders[j].validPause = false
          } else {
            this.allOrders[j].validPause = true;
          }
        }
      }
      for (let i = 0; i < this.allOrders.length; i++) {
        this.plans.push(JSON.parse(this.allOrders[i].planId))
        this.companies.push(JSON.parse(this.allOrders[i].companyId))
      }
      this.isOrders = true;
    })


  }


  minDate = new Date();
  maxDate;;
  continueDate;
  pauseOrderData;
  leftMeals = [];
  prevMeals = [];

  isPauseRequest: boolean = false;

  activeIndex = -1
  pauseRequest(order, i) {
    this.activeIndex = i
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate() + 3);
    this.pauseOrderData = order;
    let schedule = this.pauseOrderData.schedule;
    // let leftDates = [];
    // let prevMeals = [];
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    today.setDate(today.getDate() + 1);
    for (let i = 0; i < schedule.length; i++) {
      let mealDate = new Date(schedule[i].start);
      if (mealDate > today) {
        this.leftMeals.push(schedule[i])
      } else {
        this.prevMeals.push(schedule[i])
      }
    }
    this.isPauseRequest = true;
  }



  isRun: boolean = false;


  pauseOrder(ev) {
    this.isPauseRequest = false;
    if (this.isRun == true) {
      return;
    }
    this.isRun = true;
    this.continueDate = ev.target.value
    let order = this.pauseOrderData;
    let newSchedule = this.data.getPlanDays(this.leftMeals.length, this.continueDate)
    let data = [...this.prevMeals, ...newSchedule];
    order.schedule = data;
    order.continueOrderDate = this.continueDate;
    this.orderService.pauseOrder(order._id, order).subscribe(res => {
      this.isRun = false;
      if (!res.success) {
        this.responseAlert('Error', '', 'Something wrong', false)
        // this.alert.responseAlert(res.message, 'error')
      } else {
        this.responseAlert('Success', '', 'Order Pause Request is sent', false)
      }
      // window.location.reload();
      // this.data.onRefresh();
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
            location.reload();
          }
        }
      }]
    }).then(data => {
      data.present()
    });
  }

}
