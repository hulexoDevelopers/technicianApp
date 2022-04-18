import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SocService {
  private socket = io.connect('http://157.245.216.126:4000');
  constructor() {
    //   this.socket=io('http://localhost:3300');
  }
  emit(event: string, data: any) {
    this.socket.emit(event, data);
  }
  on(event: string) {
    return Observable.create(observer => {
      this.socket.on(event, data => {
        observer.next(data);
      });
    })
  }
}