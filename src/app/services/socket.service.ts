import { Injectable } from '@angular/core';
import { Socket, SocketIoConfig } from 'ngx-socket-io'

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket = null;

  constructor() { }

  connect(token: string, username: string) {
    const config: SocketIoConfig = {
<<<<<<< HEAD
      url: '/notify',
      options: {
        extraHeaders: {
          Authorization: token
        }
      }
=======
      url: 'http://localhost:80/notify'
      // url: window.location.host + '/notify'
>>>>>>> 71a102e277ff722c8049787a55e104ed33521fdd
    };
    this.socket = new Socket(config);

    this.socket.emit('username', username);

    this.socket.on('message', msg => {
      console.log(msg)
    });
  }
}
