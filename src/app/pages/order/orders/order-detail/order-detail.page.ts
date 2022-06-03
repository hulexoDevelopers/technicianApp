import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataService } from './../../../../shared/services/data.service';
import { jobService } from './../../../../shared/services/job.service';
import { userService } from './../../../../shared/services/user.service';
import { vehicleService } from './../../../../shared/services/vehicle.service';
import { batteryService } from './../../../../shared/services/battery.service';
import { ModalController } from '@ionic/angular';
import { trackCustomerComponent } from 'src/app/shared/modals/trackCustomer/trackCustomer.component';
import { inquiryService } from './../../../../shared/services/inquiry,service';
import { voidOrderComponent } from './../../../../shared/modals/voidOrder/voidOrder.component';
import { otherBatteryComponent } from './../../../../shared/modals/otherBattery/otherBattery.component';
import { batteryStockService } from './../../../../shared/services/batteryStock.service';
import { SocService } from './../../../../shared/services/socket.service';
import { confirmOrderComponent } from 'src/app/shared/modals/confirmOrder/confirmOrder.component';
import { tyreService } from './../../../../shared/services/tyre.service';
import { tyreStockService } from './../../../../shared/services/tyreStock.service';
import { oilService } from './../../../../shared/services/oil.service';
import { oilStockService } from './../../../../shared/services/oilStock.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
})
export class OrderDetailPage implements OnInit {
  isDisabled: boolean = false;

  jobId: string;
  jobDetail;
  orderDetail;
  isVehicle: boolean = false;
  vehicle;

  isBattery: boolean = false;
  battery;

  isTyre: boolean = false;
  tyre;
  isNewTyre: boolean = true;

  isOil: boolean = false;
  oil;
  isNewOil: boolean = true;

  price: number;
  paymentType: string = 'card';
  paymentTypes = ['card', 'cash'];
  paymentCard;
  isNewBattery: boolean = true;
  scrapbattery: boolean;
  orignalPrice: number;

  unamePattern = "[a-zA-Z0-9 ]+";
  constructor(
    public data: DataService,
    private jobService: jobService,
    private userService: userService,
    private vehicleService: vehicleService,
    private batteryService: batteryService,
    private tyreService: tyreService,
    private oilService: oilService,
    private oilStockService: oilStockService,
    private tyreStockService: tyreStockService,
    private modalCtrl: ModalController,
    private batteryStockService: batteryStockService,
    private route: ActivatedRoute,
    private router: Router,
    private SocService: SocService,
    private inquiryService: inquiryService
  ) { }

  ngOnInit() {
    this.getParamsId();


  }


  //get params id
  getParamsId() {
    this.route.params.subscribe((params: Params) => {
      if (params) {
        this.jobId = params.id;
        if (!this.jobId) {
          this.data.goBack();
          return;
        } else {
          this.getUserById(this.data.UserAuthData._id);
          this.getJobDetail(this.jobId);
        }
      }
    });
  }


  jobData;
  //get inquiry detail
  getJobDetail(id) {
    this.jobService.getjobWithDetailById(id).subscribe(res => {
      if (res.success) {
        this.jobData = res.data[0];
        this.jobDetail = res.data[0];
        this.orderDetail = res.data[0].detail[0];
        if (this.orderDetail.vehicleDetail.length > 0) {
          this.getVehicleDetail(this.orderDetail.vehicleDetail[0])
        }
        if (this.orderDetail.serviceDetail.length > 0 && this.orderDetail.serviceDetail[0].serviceType == 'Battery Change' && this.orderDetail.serviceDetail[0].isBattery == true) {
          this.getBatteryDetail(this.orderDetail.serviceDetail[0].battery);
          this.getBatteryAvaialbeAssignStock(this.orderDetail.serviceDetail[0].battery);
        }
        if (this.orderDetail.serviceDetail.length > 0 && this.orderDetail.serviceDetail[0].serviceType == 'Tyre Change' && this.orderDetail.serviceDetail[0].isTyre == true) {
          this.getTyreDetail(this.orderDetail.serviceDetail[0].tyre);
        }
        if (this.orderDetail.serviceDetail.length > 0 && this.orderDetail.serviceDetail[0].serviceType == 'Oil Change' && this.orderDetail.serviceDetail[0].isOil == true) {
          this.getOilDetail(this.orderDetail.serviceDetail[0].oil);
        }
        if (this.orderDetail.serviceDetail[0].priceQuoted > 0) {
          this.price = this.orderDetail.serviceDetail[0].priceQuoted;
          // let vat = Number(this.price) * 0.05;
          // this.price = Math.ceil(this.price / 1.05);
        }
      }
    })
  }


  //get vehicle detail
  getVehicleDetail(id) {
    this.vehicleService.getVehicleDetailById(id).subscribe(res => {
      if (res.success) {
        this.vehicle = res.data[0];
        this.isVehicle = true;
      }
    })
  }


  //get battery detail
  getBatteryDetail(id) {
    this.batteryService.getBatteryById(id).subscribe(res => {
      if (res.success) {
        this.battery = res.data[0];
        this.getTechnicianStockDetail(this.battery._id)
        this.isBattery = true;
      }
    })
  }

  availableBatteryStock
  isBatteryStock: boolean = false;
  //get battery available assign stock
  getBatteryAvaialbeAssignStock(id: string) {
    this.batteryStockService.getBatteryAvaialbeAssignStock(id).subscribe(res => {
      if (res.success) {
        this.availableBatteryStock = res.data;
        this.isBatteryStock = true;

      }
    })
  }

  getTechTotalStock(id) {
    let availableStock = 0;
    let stock = this.availableBatteryStock.filter((data: any) => data.techId == id);
    if (stock.length > 0) {
      for (let i = 0; i < stock.length; i++) {
        availableStock += stock[i].totalAssign - stock[i].totalSale;
      }
    }
    return availableStock;
  }

  //get tyre detail
  getTyreDetail(id) {
    this.tyreService.getTyreById(id).subscribe(res => {
      if (res.success) {
        this.tyre = res.data[0];
        this.getTechnicianTyreStockDetail(this.tyre._id)
        this.isTyre = true;
      }
    })
  }

  //get oil detail
  getOilDetail(id) {
    this.oilService.getOilById(id).subscribe(res => {
      if (res.success) {
        this.oil = res.data[0];
        this.getTechnicianOilStockDetail(this.oil._id)
        this.isOil = true;
      }
    })
  }


  tyreStock;
  //get technician tyre stock detail
  getTechnicianTyreStockDetail(tyreId: string) {
    let data = {
      tyreId: tyreId,
      techId: this.data.UserAuthData._id
    }
    this.tyreStockService.getTechTyreStockDetail(data).subscribe(res => {
      this.tyreStock = res.data[0];
    })
  }


  oilStock;
  //get technician tyre stock detail
  getTechnicianOilStockDetail(oilId: string) {
    let data = {
      oilId: oilId,
      techId: this.data.UserAuthData._id
    }
    this.oilStockService.getTechOilStockDetail(data).subscribe(res => {
      console.log('res' + JSON.stringify(res))
      this.oilStock = res.data[0];
    })
  }

  batteryStock;
  //get technician stock detail
  getTechnicianStockDetail(batteryId: string) {
    let data = {
      batteryId: batteryId,
      techId: this.data.UserAuthData._id
    }
    this.batteryStockService.getTechBatteryStockDetail(data).subscribe(res => {

      this.batteryStock = res.data[0];
    })
  }

  async startCustomerTracking() {
    // window.location.href = `https://www.google.com/maps/dir/?api=1&destination=${this.orderDetail.address[0].lat},${this.orderDetail.address[0].long}&travelmode=driving`

    // return;
    const modal = await this.modalCtrl.create({
      component: trackCustomerComponent,
      componentProps: { value: JSON.stringify(this.orderDetail.address) }
    });
    modal.onDidDismiss()
      .then((data) => {
        if (data) {
          // this.getUserById(this.data.UserAuthData._id);
        }
        // const filters = data['data']; // Here's your selected user!
        // if (filters.isChange == true) {
        //   // this.customAddress = filters.info
        //   // this.isCustom = true;
        // } else {

        // }

      });
    return await modal.present();
  }


  async markOrderVoid() {
    const modal = await this.modalCtrl.create({
      component: voidOrderComponent,
      componentProps: { value: JSON.stringify(this.jobData) }
    });
    modal.onDidDismiss()
      .then((data) => {
        if (data) {

        }
        const filters = data['data']; // Here's your selected user!
        if (filters.isChange == true) {
          this.data.goBack();
          // this.data.goBack();
          // this.customAddress = filters.info
          // this.isCustom = true;
        } else {

        }

      });
    return await modal.present();
  }


  //activate jobs
  activateJob() {
    this.jobDetail.status = 'active';
    this.jobService.updateJob(this.jobId, this.jobDetail).subscribe(res => {
      if (res.success) {
        let notifData = {
          inquiryId: this.orderDetail.inquiryId,
          customerId: this.orderDetail.customerId,
          technicianId: this.userData._id,
          technicianName: this.userData.firstName + ' ' + this.userData.lastName,
          title: 'Order Assigned'
        }
        this.orderDetail.orderStatus = 'Assigned';
        this.inquiryService.updateEnquiry(this.orderDetail._id, this.orderDetail).subscribe(res => {
          this.SocService.emit('activateJob', notifData);
        })


        // this.updateInquiry();
      }
    })
  }

  jobAction(value: string) {
    this.jobDetail.status = value;
    if (value == 'completed') {
      this.jobDetail.payment = this.price;
      this.jobDetail.paymentType = this.paymentType
    }

    this.jobService.updateJob(this.jobId, this.jobDetail).subscribe(res => {
      if (res.success) {
        this.updateInquiry();
      }
    })
  }


  updateInquiry() {
    if (this.jobDetail.status == 'rejected') {
      this.orderDetail.inquiryStatus = 'Open';
      this.orderDetail.orderStatus = 'rejected';
    }
    if (this.jobDetail.status == 'completed') {
      this.orderDetail.orderStatus = 'completed';
    }
    this.inquiryService.updateEnquiry(this.orderDetail._id, this.orderDetail).subscribe(res => {
      this.router.navigateByUrl('/orders')
    })

  }


  completeJob() {
    this.isDisabled = true;
    this.jobDetail.status = 'completed';


    this.jobDetail.payment = this.price;
    // this.jobDetail.payment = this.price * 1.05;
    this.jobDetail.paymentType = this.paymentType;
    if (this.paymentType == 'card') {
      this.jobDetail.paymentCard = this.paymentCard;
    } else {
      this.jobDetail.paymentCard = ''
    }

    if (this.scrapbattery) {
      this.jobDetail.isScrape = true;
      let data = {
        type: 'warranty clame',
        imageUrl: ''
      }
      this.jobDetail.scrapeDetail = data;
    }
    this.jobService.updateJob(this.jobId, this.jobDetail).subscribe(res => {
      if (res.success) {
        this.SocService.emit('updateJob', {})
        this.updateInquiry();
        if (this.isNewBattery == true && this.orderDetail.serviceDetail[0].serviceType == 'Battery Change') {
          this.updateBatteryStock();
        } else if (this.isNewTyre == true && this.orderDetail.serviceDetail[0].serviceType == 'Tyre Change') {
          this.updateTyreStock();
        } else if (this.isNewOil == true && this.orderDetail.serviceDetail[0].serviceType == 'Oil Change') {
          this.updateOilStock();
        }

      }
    })
  }


  async confirmJobRequest() {
    const modal = await this.modalCtrl.create({
      component: confirmOrderComponent,
      componentProps: { value: this.price }
    });
    modal.onDidDismiss()
      .then((data) => {
        if (data) {
        }
        const filters = data['data']; // Here's your selected user!
        if (filters.isConfirm == true) {
          this.completeJob();
        }

      });
    return await modal.present();
  }


  async otherbattery() {
    const modal = await this.modalCtrl.create({
      component: otherBatteryComponent,
      componentProps: { value: this.orderDetail._id }
    });
    modal.onDidDismiss()
      .then((data) => {
        if (data) {
        }
        const filters = data['data']; // Here's your selected user!
        if (filters.isChange == true) {
          this.getJobDetail(this.jobId);

        } else {

        }

      });
    return await modal.present();
  }


  updateBatteryStock() {

    this.batteryStock.totalSale += 1;
    this.batteryStockService.updateBatteryStock(this.batteryStock._id, this.batteryStock).subscribe(res => {

    })

    this.batteryService.updateBatteryStock(this.batteryStock.batteryId, this.batteryStock.stockId).subscribe(res => {
      console.log('res' + JSON.stringify(res))
    })
  }

  //update tyre stock
  updateTyreStock() {

    this.tyreStock.totalSale += 1;
    this.tyreStockService.updateTyreStock(this.tyreStock._id, this.tyreStock).subscribe(res => {

    })

    this.tyreService.updateTyreStock(this.tyreStock.tyreId, this.tyreStock.stockId).subscribe(res => {
      console.log('res' + JSON.stringify(res))
    })
  }


  //update tyre stock
  updateOilStock() {

    this.oilStock.totalSale += 1;
    this.oilStockService.updateOilStock(this.oilStock._id, this.oilStock).subscribe(res => {

    })

    this.oilService.updateOilStock(this.oilStock.oilId, this.oilStock.stockId).subscribe(res => {
      console.log('res' + JSON.stringify(res))
    })
  }

  userData
  //get user  by id 
  getUserById(id) {
    let token = this.data.userToken;
    this.userService.getUserByid(id, token).subscribe(res => {
      if (res.success) {
        this.userData = res.data;
      }
    })
  }
}
