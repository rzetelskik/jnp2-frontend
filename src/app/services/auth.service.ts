import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginModel, RegistrationModel } from '../models/user'
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type' : 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  generateHeaders() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.getToken()
      })
    }
  }

  login(model: LoginModel): Observable<any> {
    return this.http.post<any>(`/accounts/authenticate`, model, httpOptions);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  }

  loggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  register(model: RegistrationModel): Observable<any> {
    return this.http.post<any>(`/accounts/register`, model, httpOptions);
  }

  auth(): Observable<any> {
    const token = this.getToken();
    if(!token) {
      return null;
    }

    const httpOptions = this.generateHeaders();

    return this.http.get<any>(`/authorize`, httpOptions);
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string {
    return localStorage.getItem('token');
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
