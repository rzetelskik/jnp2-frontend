import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { AuthService } from './auth.service'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  serviceUrl: string = environment.projectsUrl;

  constructor(private http: HttpClient, private auth: AuthService) { }

  create(projectId: number, name: string, description: string, statusId: number): Observable<any> {
    const httpOptions = this.auth.generateHeaders();

    const model = {
      name,
      description,
      status_id: statusId
    };

    return this.http.post<any>(`${this.serviceUrl}/projects/${projectId}/tasks`, model, httpOptions);
  }

  getAll(projectId: number) {
    const httpOptions = this.auth.generateHeaders();

    return this.http.get<any>(`${this.serviceUrl}/projects/${projectId}/tasks`, httpOptions);
  }

  details(projectId: number, taskId: number) {
    const httpOptions = this.auth.generateHeaders();

    return this.http.get<any>(`${this.serviceUrl}/projects/${projectId}/tasks/${taskId}`, httpOptions);
  }

  delete(projectId: number, taskId: number) {
    const httpOptions = this.auth.generateHeaders();

    return this.http.delete<any>(`${this.serviceUrl}/projects/${projectId}/tasks/${taskId}`, httpOptions);
  }

  update(projectId: number, taskId: number, name: string, description: string, statusId: number) {
    const httpOptions = this.auth.generateHeaders();

    const model = {
      name,
      description,
      status_id: statusId
    };

    return this.http.patch<any>(`${this.serviceUrl}/projects/${projectId}/tasks/${taskId}`, model, httpOptions);
  }

  assign(projectId: number, taskId: number, users: string[]): Observable<any> {
    const httpOptions = this.auth.generateHeaders();

    const model = {
      users
    };

    return this.http.put(`${this.serviceUrl}/projects/${projectId}/tasks/${taskId}/assign`, model, httpOptions);
  }

  assigned(projectId: number): Observable<any> {
    const httpOptions = this.auth.generateHeaders();

    return this.http.get(`${this.serviceUrl}/projects/${projectId}/tasks/assigned`, httpOptions);
  }
}
