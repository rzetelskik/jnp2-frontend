import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginModel, RegistrationModel } from '../models/user'
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type' : 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public authenticated: boolean = false;
  serviceUrl: string = environment.accountsUrl;

  constructor(private http: HttpClient) { }

  login(model: LoginModel): Observable<any> {
    return this.http.post<any>(`${this.serviceUrl}/authenticate`, model, httpOptions);
  }

  logout() {
    localStorage.removeItem('token');
  }

  register(model: RegistrationModel): Observable<any> {
    return this.http.post<any>(`${this.serviceUrl}/register`, model, httpOptions);
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  auth(): Observable<any> {
    const token = localStorage.getItem('token');
    if(!token) {
      return null;
    }

    return this.http.get<any>(`${this.serviceUrl}/authorized?auth_token=${token}`, httpOptions);
  }

  loggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
