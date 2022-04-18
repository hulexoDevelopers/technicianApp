import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DataService } from './../../../../shared/services/data.service';
import { orderService } from './../../../../shared/services/order.service';
import { userService } from './../../../../shared/services/user.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
})
export class OrderDetailPage implements OnInit {

  orderId;
  orderData;
  companyData;
  planData;

  isOrders:boolean = false;
  constructor(
    public data: DataService,
    private orderService: orderService,
    private userService: userService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.getParamsId();
    this.getUserById();
  }



  user;
  //get user by id
  getUserById() {
    let id = this.data.UserAuthData._id;
    this.userService.getUserByid(id).subscribe(res => {
      this.user = res.data;
    })
  }

  //get params id
  getParamsId() {
    this.route.params.subscribe((params: Params) => {
      if (params) {
        this.orderId = params.id;
        if (!this.orderId) {
          this.data.goBack();
          return;
        } else {
          this.getOrderDetail(this.orderId);
        }
      }
    });
  }


  //get order detail
  getOrderDetail(orderId) {
    // let id = this.data.decryptData(orderId);
    let id = this.orderId;
    this.orderService.getOrderDetail(id).subscribe(res => {
      this.orderData = res.data;
      this.companyData = JSON.parse(res.data.companyId);
      this.planData = JSON.parse(res.data.planId);
    })
  }

}
