import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { AuthService } from './auth.service'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  serviceUrl: string = environment.projectsUrl;

  constructor(private http: HttpClient, private auth: AuthService) { }

  getProjects(): Observable<any> {
    const httpOptions = this.auth.generateHeaders();

    return this.http.get<any>(`${this.serviceUrl}/projects`, httpOptions);
  }

  createProject(projectName: string): Observable<any> {
    const httpOptions = this.auth.generateHeaders();

    const model = {
      name: projectName
    };

    return this.http.post<any>(`${this.serviceUrl}/projects`, model, httpOptions);
  }

  assign(projectId: number, user: string): Observable<any> {
    const httpOptions = this.auth.generateHeaders();

    const model = {
      user
    };

    return this.http.put<any>(`${this.serviceUrl}/projects/${projectId}/assign`, model, httpOptions);
  }

  unassign(projectId: number, user: string): Observable<any> {
    const httpOptions = this.auth.generateHeaders();

    const model = {
      user
    };

    return this.http.put<any>(`${this.serviceUrl}/projects/${projectId}/unassign`, model, httpOptions);
  }

  details(projectId: number): Observable<any> {
    const httpOptions = this.auth.generateHeaders();

    return this.http.get<any>(`${this.serviceUrl}/projects/${projectId}/`, httpOptions);
  }
}
