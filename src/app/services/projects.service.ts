import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { AuthService } from './auth.service'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  constructor(private http: HttpClient, private auth: AuthService) { }

  getProjects(): Observable<any> {
    const httpOptions = this.auth.generateHeaders();

    return this.http.get<any>(`/projects`, httpOptions);
  }

  createProject(projectName: string): Observable<any> {
    const httpOptions = this.auth.generateHeaders();

    const model = {
      name: projectName
    };

    return this.http.post<any>(`/projects`, model, httpOptions);
  }

  assign(projectId: number, user: string): Observable<any> {
    const httpOptions = this.auth.generateHeaders();

    const model = {
      user
    };

    return this.http.put<any>(`/projects/${projectId}/assign`, model, httpOptions);
  }

  unassign(projectId: number, user: string): Observable<any> {
    const httpOptions = this.auth.generateHeaders();

    const model = {
      user
    };

    return this.http.put<any>(`/projects/${projectId}/unassign`, model, httpOptions);
  }

  details(projectId: number): Observable<any> {
    const httpOptions = this.auth.generateHeaders();

    return this.http.get<any>(`/projects/${projectId}/`, httpOptions);
  }

  deleteProject(projectId: number): Observable<any> {
    const httpOptions = this.auth.generateHeaders();

    return this.http.delete<any>(`/projects/${projectId}/`, httpOptions);
  }
}
