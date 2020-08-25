import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { AuthService } from './auth.service'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class StatusService {
  constructor(private http: HttpClient, private auth: AuthService) { }

  getStatuses(projectId: number): Observable<any> {
    const httpOptions = this.auth.generateHeaders();

    return this.http.get<any>(`/projects/${projectId}/statuses`, httpOptions);
  }

  createStatus(projectId: number, name: string) {
    const httpOptions = this.auth.generateHeaders();

    const model = {
      name
    };

    return this.http.post<any>(`/projects/${projectId}/statuses`, model, httpOptions);
  }

  deleteStatus(projectId: number, statusId: number): Observable<any> {
    const httpOptions = this.auth.generateHeaders();

    return this.http.delete<any>(`/projects/${projectId}/statuses/${statusId}`, httpOptions);
  }
}
