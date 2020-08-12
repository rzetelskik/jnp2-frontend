import { Component, OnInit } from '@angular/core';
import { ProjectHeader } from '../../models/project';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss']
})
export class ProjectsListComponent implements OnInit {
  projects: ProjectHeader[];

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    if(!this.auth.authenticated) {
      console.log("!!!!!")
    }

    this.projects = [
      {
        id: 1,
        name: 'Testowy'
      },
      {
        id: 2,
        name: 'Projekt'
      }
    ];
  }
}
