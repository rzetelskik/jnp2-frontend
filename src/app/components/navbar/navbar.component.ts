import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LoginModel, RegistrationModel } from '../../models/user'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {
  username: string = null;
  loginModel: LoginModel = new LoginModel();
  registrationModel: RegistrationModel = new RegistrationModel();

  loginError: string = null;
  registerError: string = null;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    // this.authService.auth()?.subscribe(
    //   resp => { },
    //   error => {
    //     console.error(error);
    //     this.authService.logout();
    //     // window.location.replace('/');
    //   }
    // );
    if(this.authService.loggedIn()) {
      this.username = this.authService.getUsername();
    }
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

        if(error.status == 502) {
          this.loginError = 'Service unavailable';
        }
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

        if(error.status == 502) {
          this.registerError = 'Service unavailable';
        }
      }
    );
  }

  logout() {
    this.authService.logout();
    window.location.reload();
  }
}
