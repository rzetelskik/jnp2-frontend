import { Component, OnInit, Input } from '@angular/core';
import { ProjectHeader } from '../../models/project';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent implements OnInit {
  @Input()
  project: ProjectHeader;

  constructor() { }

  ngOnInit(): void {}

}
