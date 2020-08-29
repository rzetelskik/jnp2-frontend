import { Injectable } from '@angular/core';
import { Socket, SocketIoConfig } from 'ngx-socket-io'

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket = null;

  constructor() { }

  connect(token: string, username: string) {
    const config: SocketIoConfig = {
      url: '/notify',
      options: {
        transportOptions: {
          polling: {
            extraHeaders: {
              'Authorization': token
            }
          }
        }
      }
    };

    this.socket = new Socket(config);

    this.socket.emit('username', username);

    this.socket.on('message', msg => {
      console.log(msg)
    });
  }
}