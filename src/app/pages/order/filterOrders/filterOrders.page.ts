import { Component, OnInit } from '@angular/core';
import { userService } from './../../../shared/services/user.service';
import { DataService } from 'src/app/shared/services/data.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { jobService } from './../../../shared/services/job.service';
import { Subject } from 'rxjs';
import { SocService } from './../../../shared/services/socket.service';



@Component({
  selector: 'app-filterOrders',
  templateUrl: './filterOrders.page.html',
  styleUrls: ['./filterOrders.page.scss'],
})
export class filterOrdersPage implements OnInit {

  userData;
  isActive;
  isLoad: boolean = false;
  allJobs;

  jobs;

  filter;
  constructor(
    private userService: userService,
    public data: DataService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private jobService: jobService,
    private SocService: SocService,
    private route:ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getUserById(this.data.UserAuthData._id);
  }




  //get params id
  getParamsId() {
    this.route.params.subscribe((params: Params) => {
      if (params) {
        this.filter = params.id;
        if (!this.filter) {
          this.data.goBack();
          return;
        } else {
          this.getUserJobs();

        }
      }
    });
  }

  myChange(ev) {
    this.updateUserActiveStatus(this.isActive)
    // do stuffs
  }



  //update user active status
  updateUserActiveStatus(status) {
    let data = {
      status: status
    }
    this.userService.updateActiveStatus(this.userData._id, data).subscribe(res => {
      if (res.success) {
        this.isActive = status
        // this.getCurrentCoordinates();

      }
    })
  }


  ionViewWillEnter() {

    this.getParamsId();
    this.SocService.on('updateJobs').subscribe(data => {
      this.getUserJobs(); //in future we replace with actual data 
    })
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
        this.isLoad = true;
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
        this.filterJobs(this.filter)
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

}
