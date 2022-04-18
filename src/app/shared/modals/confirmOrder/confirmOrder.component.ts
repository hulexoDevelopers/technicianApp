import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DataService } from '../../services/data.service';
// import { DataService } from './../../services/data.service';
import { userService } from './../../services/user.service';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { NgZone } from '@angular/core';
import { Capacitor } from "@capacitor/core";
import { LocationService } from '../../services/location.service';
// const { Geolocation, Toast } = Plugins;
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { ToastController } from '@ionic/angular';
import { SocService } from './../../services/socket.service';
import { autoLocationService } from './../../services/autoLocation.service';
import { Subject } from 'rxjs';
import { ILatLng } from '../../directives/location.directive';
import { jobService } from './../../services/job.service';
import { inquiryService } from './../../services/inquiry,service';
@Component({
  selector: 'app-confirmOrder',
  templateUrl: './confirmOrder.component.html',
  styleUrls: ['./confirmOrder.component.scss'],
})
export class confirmOrderComponent implements OnInit {
  @Input()
  value: any;

  jobDetail;
  orderDetail;

  reason;

  orignalPrice = 0;
  tax = 5;
  subTotal = 0;
  taxAmount = 0;
  total = 0;
  constructor(
    private data: DataService,
    private modalCtrl: ModalController,
    private userService: userService,
    public toastController: ToastController,
    private inquiryService: inquiryService,
    private SocService: SocService,
    private jobService: jobService
  ) {

  }



  ngOnInit() {
    let value = JSON.parse(this.value);
    this.orignalPrice = value;
    // this.subTotal = value;
    this.subTotal = Math.ceil(this.orignalPrice / 1.05);
    // this.taxAmount = 5 / 100 * this.subTotal
    this.taxAmount = this.orignalPrice - this.subTotal;

    this.total = this.subTotal + this.taxAmount;
  }


  calculatePrice() {

  }




  dismiss(value: boolean = false, data: any = {}) {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      'dismissed': true,
      'isConfirm': value,
    });
  }







}
