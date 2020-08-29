import { Injectable } from '@angular/core';
import { Socket, SocketIoConfig } from 'ngx-socket-io'

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket = null;

  constructor() { }

  connect(username: string) {
    const config: SocketIoConfig = {
      url: 'http://localhost:3003/notify'
      // url: window.location.host + '/notify'
    };
    this.socket = new Socket(config);

    this.socket.emit('username', username);

    this.socket.on('message', msg => {
      console.log(msg)
    });
  }
}
