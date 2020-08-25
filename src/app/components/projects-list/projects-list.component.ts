import { Component, OnInit } from '@angular/core';
import { ProjectHeader } from '../../models/project';
import { ProjectsService } from '../../services/projects.service';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss']
})
export class ProjectsListComponent implements OnInit {
  projects: ProjectHeader[];

  constructor(private projectsService: ProjectsService) { }

  ngOnInit(): void {
    this.projectsService.getProjects()?.subscribe(
      data => {
        this.projects = data;
      },
      error => {
        console.error(error);
      }
    )
  }
}
