import { Component, OnInit } from '@angular/core';
import { Notify } from '../../models/notify'
import { AuthService } from '../../services/auth.service';
import { SocketService } from '../../services/socket.service'

declare var $: any;

@Component({
  selector: 'app-notify-toast',
  templateUrl: './notify-toast.component.html',
  styleUrls: ['./notify-toast.component.scss']
})
export class NotifyToastComponent implements OnInit {
  notifies: Notify[] = [];
  counter: number = 0;

  constructor(private authService: AuthService, private socketService: SocketService) { }

  ngOnInit(): void {
    if(this.authService.loggedIn()) {
      this.socketService.connect(this.authService.getToken(), this.authService.getUsername(), this);
    }
  }

  public addNotification(msg) {
    const msgObj = JSON.parse(msg);

    const notify = new Notify();

    if(msgObj.resource == 'project') {
      notify.id = this.counter;
      notify.url = `/project/${msgObj.payload.id}`;
      notify.description = `You have been assigned to project '${msgObj.payload.name}'`;
    }
    else if(msgObj.resource == 'task') {
      notify.id = this.counter;
      notify.url = `/project/${msgObj.payload.project_id}/task/${msgObj.payload.id}`;
      notify.description = `You have been assigned to task '${msgObj.payload.name}'`;
    }

    this.counter++;
    this.notifies.push(notify);
  }

  close(id: number) {
    for(let i = 0; i < this.notifies.length; i++) {
      if(this.notifies[i].id == id) {
        this.notifies.splice(i, 1);
      }
    }
  }
}
