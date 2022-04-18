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
  selector: 'app-voidOrder',
  templateUrl: './voidOrder.component.html',
  styleUrls: ['./voidOrder.component.scss'],
})
export class voidOrderComponent implements OnInit {
  @Input()
  value: any;

  jobDetail;
  orderDetail;

  reason;
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
    this.jobDetail = value;
    this.orderDetail = value.detail[0]
    // console.log('value' + this.value)
  }


  //get job detail 
  //get inquiry detail
  getJobDetail(id) {
    this.jobService.getjobWithDetailById(id).subscribe(res => {
      if (res.success) {
        this.jobDetail = res.data[0];
        this.orderDetail = res.data[0].detail[0];



      }
    })
  }



  jobAction() {
    this.jobDetail.status = 'rejected';
    this.jobDetail.remarks = this.reason;
    this.jobService.updateJob(this.jobDetail._id, this.jobDetail).subscribe(res => {
      if (res.success) {
        this.updateInquiry();
      }
    })
  }


  updateInquiry() {
    if (this.jobDetail.status == 'rejected') {
      this.orderDetail.inquiryStatus = 'Open';
      this.orderDetail.orderStatus = 'rejected';
      this.inquiryService.updateEnquiry(this.orderDetail._id, this.orderDetail).subscribe(res => {
        // console.log('res' + JSON.stringify(res))
        let data = {
          inquiryId: this.jobDetail.inquiryId
        }
        this.SocService.emit('updateJob', data);
        this.SocService.emit('rejectJobNotification', data)
        this.dismiss(true);
      })
    }
  }


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
