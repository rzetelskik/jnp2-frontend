import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LoginModel, RegistrationModel } from '../../models/user'
import { consoleTestResultHandler } from 'tslint/lib/test';
import { tap, catchError} from 'rxjs/operators'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

//TODO erros while login/register
export class NavbarComponent implements OnInit {
  username: string = null;
  loginModel: LoginModel = new LoginModel();
  registrationModel: RegistrationModel = new RegistrationModel();

  loginError: string = null;
  registerError: string = null;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.auth()?.subscribe(
      resp => {
        console.log(resp);
        console.log(resp.headers.get('Authenticated'));
        // this.authService.setUserId(resp.headers.get('Authenticated'))
        this.authService.authenticated = true;
        this.username = this.authService.getUsername();
      },
      error => {
        console.log(error);
        this.authService.logout();
        this.authService.authenticated = false;
      }
    );
  }

  login(event: Event) {
    event.preventDefault();

    this.authService.login(this.loginModel).subscribe(
      data => {
        this.authService.setToken(data.auth_token);
        this.authService.setUsername(this.loginModel.password);
        window.location.reload();
      },
      error => {
        this.loginError = error.error.error;
      }
    );
  }

  register(event: Event) {
    event.preventDefault();

    this.authService.register(this.registrationModel).subscribe(
      data => {
        this.authService.setToken(data.auth_token);
        this.authService.setUsername(this.registrationModel.username);
        window.location.reload();
      },
      error => {
        this.registerError = error.error.error;
      }
    );
  }

  logout() {
    this.authService.logout();
    window.location.reload();
  }
}
