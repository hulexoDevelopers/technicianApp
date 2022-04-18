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
import { batteryStockService } from './../../services/batteryStock.service';
import { batteryService } from './../../services/battery.service';
@Component({
  selector: 'app-otherBattery',
  templateUrl: './otherBattery.component.html',
})
export class otherBatteryComponent implements OnInit {
  @Input()
  value: any;
  inquiryId: string;
  technicianId: string;

  allBatteries = [];
  constructor(
    private data: DataService,
    private modalCtrl: ModalController,
    private userService: userService,
    public toastController: ToastController,
    private inquiryService: inquiryService,
    private batteryStockService: batteryStockService,
    private batteryService: batteryService,
    private SocService: SocService,

    private jobService: jobService
  ) {

  }



  ngOnInit() {
    this.inquiryId = this.value;
    // console.log('inq ' + this.inquiryId)
    this.getInquiryById(this.inquiryId);
    this.getTechStockDetail(this.data.UserAuthData._id);
  }


  techStock;
  batteries;

  battery;
  //get tech stock detail
  getTechStockDetail(techId: string) {
    let data = {
      techId: techId
    }
    this.batteryStockService.getTechStockDetail(data).subscribe(res => {
      this.techStock = res.data;
      let allAssignIds = this.techStock.map(x => x._id);
      this.getMultipleBatteriesList(allAssignIds);
    })
  }


  inquiryData;
  //get inquiry by id
  getInquiryById(id) {
    this.inquiryService.getEnquiryById(id).subscribe(res => {
      this.inquiryData = res.data;
    })
  }


  getMultipleBatteriesList(ids) {
    let allIds = JSON.stringify(ids)
    this.batteryService.getMultiplebatteriesByIds(allIds).subscribe(res => {
      this.batteries = res.data;
    })
  }


  updateBattery() {
    if (this.battery) {
      let btryId = this.battery._id
      this.inquiryData.serviceDetail[0].battery = btryId;
      this.inquiryService.updateEnquiry(this.inquiryData._id, this.inquiryData).subscribe(res => {
        // console.log('res' + JSON.stringify(res))
        this.dismiss(true);
      })
    }
  }

  // updateInquiry() {
  //   if (this.jobDetail.status == 'rejected') {
  //     this.orderDetail.inquiryStatus = 'Open';
  //     this.orderDetail.orderStatus = 'rejected';
  //     this.inquiryService.updateEnquiry(this.orderDetail._id, this.orderDetail).subscribe(res => {
  //       // console.log('res' + JSON.stringify(res))
  //       let data = {
  //         inquiryId: this.jobDetail.inquiryId
  //       }
  //       this.SocService.emit('updateJob', data)
  //       this.dismiss(true);
  //     })
  //   }
  // }


  dismiss(value: boolean = false, data: any = {}) {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      'dismissed': true,
      'isChange': value,
      info: data
    });
  }







}
