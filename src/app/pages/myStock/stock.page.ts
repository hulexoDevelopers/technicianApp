import { Component, OnInit } from '@angular/core';
import { userService } from './../../shared/services/user.service';
import { DataService } from 'src/app/shared/services/data.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { jobService } from './../../shared/services/job.service';
import { Subject } from 'rxjs';
import { SocService } from './../../shared/services/socket.service';
import { geoLocationService } from './../../shared/services/geoLocation.service';
import { batteryStockService } from './../../shared/services/batteryStock.service';
import { tyreStockService } from './../../shared/services/tyreStock.service';
import { oilStockService } from './../../shared/services/oilStock.service';
import { resourceService } from './../../shared/services/resource.service';


@Component({
  selector: 'app-my-stock',
  templateUrl: './stock.page.html',
  styleUrls: ['./stock.page.scss'],
})
export class StockPage implements OnInit {

  userData;
  isActive;
  isLoad: boolean = false;
  allJobs;

  jobs;

  stockDetail;
  batteryStock;
  tyreStock;
  oilStock;
  stockType = 'battery';
  constructor(
    private userService: userService,
    public data: DataService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private jobService: jobService,
    private SocService: SocService,
    private geoLocationService: geoLocationService,
    public loadingController: LoadingController,
    private batteryStockService: batteryStockService,
    private tyreStockService: tyreStockService,
    private OilStockService: oilStockService,
    public resourceService:resourceService,
    private router: Router,
  ) { }

  ngOnInit() {

  }





  ionViewWillEnter() {
    this.getTechStockDetail(this.data.UserAuthData._id);
    this.getTechTyreStockDetail(this.data.UserAuthData._id);
    this.getTechOilStockDetail(this.data.UserAuthData._id);
  }

  ionViewWillLeave() {
    this.isLoad = false;
  }

  


  //get tech stock detail
  getTechStockDetail(techId: string) {
    let data = {
      techId: techId
    }
    this.batteryStockService.getTechStockDetail(data).subscribe(res => {
      this.batteryStock = res.data;
    })
  }


  //tyre stock 
  //get tech tyre stock detail
  getTechTyreStockDetail(techId: string) {
    let data = {
      techId: techId
    }
    this.tyreStockService.getTechStockDetail(data).subscribe(res => {
      this.tyreStock = res.data;
    })
  }





  //oil stock 
  //get tech oil stock detail
  getTechOilStockDetail(techId: string) {
    let data = {
      techId: techId
    }
    this.OilStockService.getTechStockDetail(data).subscribe(res => {
      this.oilStock = res.data;
    })
  }



}
