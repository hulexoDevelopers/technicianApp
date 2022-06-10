import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { HttpConfigInterceptor } from "./shared/auth/auth-interceptor";





export const interceptorProviders = 
   [
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },

];