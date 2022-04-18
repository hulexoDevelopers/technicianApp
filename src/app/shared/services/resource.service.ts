import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpParams, HttpClient } from "@angular/common/http";
import { catchError, map, timeoutWith } from "rxjs/operators";
import { Observable, throwError, observable } from "rxjs";
import { ApiService } from '../../core/services/index';
import { Subject } from "rxjs";


@Injectable({ providedIn: 'root' })
export class resourceService {

    public allCompanies: any;
    public allBatteryBrands: any;
    public allVehicleBrands: any;
    public allBatteries: any;
    public allVehicles: any;
    public allTyres: any;
    public alloils: any;

    constructor(private _api: ApiService,
        private router: Router,
        private http: HttpClient,
    ) {
        this.loadData();
    }



    //get all companies 
    getAllCompanies() {
        return this._api.get(`${"company/all"}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }

    //get all battery brands 
    getAllBatteryBrands() {
        return this._api.get(`${"batteryCompany/all"}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }



    //get all tyres list
    getAllTyresList() {
        return this._api.get(`${"tyre/all"}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }


    //get all oils list
    getAllOilsList() {
        return this._api.get(`${"oil/all"}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }



    //get all vehicle brands
    getAllVehicleBrands() {
        return this._api.get(`${"carBrand/all"}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }

    //get batteries
    getAllBatteries() {
        return this._api.get(`${"battery/all"}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }

    //get all vehicles
    getAllVehicles() {
        return this._api.get(`${"vehicle/all"}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => Observable.throw(error))
            );
    }





    loadData() {
        this.getAllBatteryBrands().subscribe(res => {
            this.allBatteryBrands = res.data;
            this.getAllBatteries().subscribe(res => {
                this.allBatteries = res.data;
                this.allBatteries = res.data.filter(o1 => this.allBatteryBrands.some(o2 => o1.companyId === o2._id));
            })
        });
        this.getAllVehicleBrands().subscribe(res => {
            this.allVehicleBrands = res.data;
        });

        this.getAllVehicles().subscribe(res => {
            this.allVehicles = res.data;
        })
        this.getAllCompanies().subscribe(res => {
            this.allCompanies = res.data;
        })
        this.getAllTyresList().subscribe(res => {
            this.allTyres = res.data;
        })
        this.getAllOilsList().subscribe(res => {
            this.alloils = res.data;
        })
    }


    getBatteryBrandNameById(id: string) {
        let btryBrand = this.allBatteryBrands.find(data => data._id == id)
        if (btryBrand) {
            return btryBrand.title
        } else {
            return '--'
        }

    }




    getBatteryNameById(id: string) {
        let btry = this.allBatteries.find(data => data._id == id)
        if (btry) {
            return btry.title
        } else {
            return '--'
        }

    }


    getTyreNameById(id: string) {
        let tyre = this.allTyres.find(data => data._id == id)
        if (tyre) {
            return tyre.title
        } else {
            return '--'
        }

    }


    getOilNameById(id: string) {
        let oil = this.alloils.find(data => data._id == id)
        if (oil) {
            return oil.title
        } else {
            return '--'
        }

    }


    //get vehicle company name
    getVehicleCompanyName(id: string) {
        let compnay = this.allVehicleBrands.find(data => data._id == id)
        if (compnay) {
            return compnay.title;
        } else {
            return '--'
        }

    }


    //get all vehicles of  brands
    getAllBrandVehicles(id: string) {
        let vehicles = this.allVehicles.filter(data => data.brandId == id);
        if (vehicles.length > 1) {
            return vehicles;
        } else {
            return []
        }

    }

}

