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
    return this.http.post<any>(`${this.serviceUrl}/accounts/authenticate`, model, httpOptions);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  }

  loggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  register(model: RegistrationModel): Observable<any> {
    return this.http.post<any>(`${this.serviceUrl}/accounts/register`, model, httpOptions);
  }

  auth(): Observable<any> {
    const token = localStorage.getItem('token');
    if(!token) {
      return null;
    }

    const headers = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization': token
    });

    return this.http.get<any>(`${this.serviceUrl}/authorize`, { headers, observe: 'response', responseType: 'text' as 'json' });
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  setUsername(username: string) {
    localStorage.setItem('username', username);
  }

  getUsername(): string {
    return localStorage.getItem('username');
  }

  setUserId(id: number) {
    localStorage.setItem('userID', id.toString());
  }
}
