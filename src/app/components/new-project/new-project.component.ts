import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../../services/projects.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent implements OnInit {
  projectName: string;
  error: string = null;

  constructor(private projectsService: ProjectsService, private router: Router) { }

  ngOnInit(): void {
  }

  create(event: Event) {
    event.preventDefault();

    this.projectsService.createProject(this.projectName).subscribe(
      data => {
        this.router.navigate(['/list']);
      },
      error => {
        this.error = error.error.error;
      }
    )
  }
}
