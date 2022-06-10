//httpConfig.interceptor.ts
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { DataService } from './../services/data.service';
import { Router } from '@angular/router';
import { capStorageService } from './../services/cap.storage';
import { utilityService } from './../services/utility.service';
declare var window;
@Injectable({
    providedIn: 'root'
})
export class HttpConfigInterceptor implements HttpInterceptor {
    loaderToShow: any;
    constructor(
        private DataService: DataService,
        private router: Router,
        private cap: capStorageService,
        // private utilitService: utilityService,
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.DataService.userToken;

        if (token) {
            // If we have a token, we set it to the header
            request = request.clone({
                setHeaders: { Authorization: `${token}` }
            });
        }

        return next.handle(request).pipe(
            catchError((err) => {
                if (err instanceof HttpErrorResponse) {
                    if (err.status === 401) {
                        this.cap.removeName('authTokk').then(data => {
                            this.router.navigate(['/login'], { replaceUrl: true });
                            window.app.backgroundGeolocation.stop()
                        })


                        this.router.navigate(['/login'], { replaceUrl: true });

                        // this.router.navigateByUrl('/login')
                        // redirect user to the logout page
                    }
                }
                return throwError(err);
            })
        )
    }
}