 import { HttpClient } from '@angular/common/http';
    import { Injectable } from '@angular/core';
    declare const Pusher: any;
    @Injectable()
    export class PusherServiceProvider {

    channel;
    
    constructor(public http: HttpClient) {
    var pusher = new Pusher('9204807fa6f8a781ddbc', {
    cluster: 'ap2',
    encrypted: true,
    });
    this.channel = pusher.subscribe('vote-channel');
    }
    public init(){
      return this.channel;
      }
    }