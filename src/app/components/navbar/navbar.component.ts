import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LoginModel, RegistrationModel } from '../../models/user'
import { consoleTestResultHandler } from 'tslint/lib/test';

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
      data => {
        this.username = data.username;
        this.authService.authenticated = true;
      },
      error => {
        console.log(error);
        this.authService.logout();
        this.authService.authenticated = false;
      }
    )
  }

  login(event: Event) {
    event.preventDefault();

    this.authService.login(this.loginModel).subscribe(
      data => {
        this.authService.setToken(data.auth_token);
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
