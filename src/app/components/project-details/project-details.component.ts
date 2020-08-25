import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../../services/projects.service'
import { StatusService } from '../../services/status.service'
import { TasksService } from '../../services/tasks.service'
import { List } from '../../models/list'
import { DatePipe } from '@angular/common'
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop'
import { Task } from '../../models/task';

interface ProjectDetails {
  id: number;
  projectName: string;
  created: Date;
  updated: Date;
}

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})

export class ProjectDetailsComponent implements OnInit {
  projectDetails: ProjectDetails;
  details: Task = new Task(0, '', '');
  
  listName: string;
  addName: string;
  removeName: string;

  listForNewTask: number;
  taskName: string;
  taskDes: string;

  lists: List[] = [];

  constructor(private projectService: ProjectsService, private statusService: StatusService, private taskService: TasksService) { }

  ngOnInit(): void {
    const url = window.location.href.split('/');
    const id = Number(url[url.length - 1]);

    this.projectService.details(id).subscribe(
      data => {
        this.projectDetails = {
          id: data.id,
          projectName: data.name,
          created: new Date(data.created_at),
          updated: new Date(data.updated_at)
        }

        this.statusService.getStatuses(this.projectDetails.id).subscribe(
          data => {
            for(let l of data) {
              this.lists.push(new List(l.id, l.name, []));
            }
            this.lists.sort((a, b) => a.id - b.id);

            this.taskService.getAll(this.projectDetails.id).subscribe(
              data => {
                for(let t of data) {
                    this.addTask(t);
                }
              },
              error => {
                console.error(error);
              }
            )
          },
          error => {
            console.error(error);
          }
        );
      },
      error => {
        console.error(error);
      }
    );
  }

  addList(event: Event) {
    event.preventDefault();

    this.statusService.createStatus(this.projectDetails.id, this.listName).subscribe(
      data => {
        window.location.reload();
      },
      error => {
        console.error(error);
      }
    );
  }

  removeList(id: number) {
    this.statusService.deleteStatus(this.projectDetails.id, id).subscribe(
      data => {
        window.location.reload();
      },
      error => {
        console.error(error);
      }
    );
  }

  addUser(event: Event) {
    event.preventDefault();

    this.projectService.assign(this.projectDetails.id, this.addName).subscribe(
      data => {
        document.getElementById('addButton').click();
        this.addName = '';
      },
      error => {
        console.error(error);
      }
    );
  }

  removeUser(event: Event) {
    event.preventDefault();

    this.projectService.unassign(this.projectDetails.id, this.removeName).subscribe(
      data => {
        document.getElementById('removeButton').click();
        this.removeName = '';
      },
      error => {
        console.error(error);
      }
    );
  }

  selectList(listId: number) {
    this.listForNewTask = listId;
    console.log(listId);
  }

  createTask(event: Event) {
    event.preventDefault();

    this.taskService.create(this.projectDetails.id, this.taskName, this.taskDes, this.listForNewTask).subscribe(
      data => {
        window.location.reload();
      },
      error => {
        console.error(error);
      }
    )
  }

  showDetails(taskId: number) {
    console.log("CLICK!")
    this.taskService.details(this.projectDetails.id, taskId).subscribe(
      data => {
        const pipe = new DatePipe('en-US');

        this.details = new Task(data.id, data.name, data.description);
        this.details.created_by = data.created_by;
        this.details.created_at = pipe.transform(data.created_at, 'medium');
        this.details.updated_at = pipe.transform(data.updated_at, 'medium');
        this.details.status = data.status_id;
      },
      error => {
        console.log(error);
      }
    )
  }

  saveChanges() {
    this.taskService.update(this.projectDetails.id, this.details.id,
      this.details.name, this.details.description, this.details.status).subscribe(
        data => {
          window.location.reload();
        },
        error => {
          document.getElementById('closeButton').click();
          console.error(error);
        }
      )
  }

  drop(event: CdkDragDrop<string[]>, id: number) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } 
    else {
      const taskEl = new DOMParser().parseFromString(event.item.element.nativeElement.innerHTML, 'text/html') as HTMLDocument;
      const taskId = parseInt(taskEl.getElementsByClassName('task-id')[0].textContent);
      const taskName = taskEl.getElementsByClassName('task-name')[0].textContent;
      const taskDescription = taskEl.getElementsByClassName('task-description')[0].textContent;

      this.taskService.update(this.projectDetails.id, taskId, taskName, taskDescription, id).subscribe(
        data => {
          transferArrayItem(event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex);
        },
        error => {
          console.error(error);
        }
      );
    }
  }

  private addTask(task) {
    for(let l of this.lists) {
      if(l.id == task.status_id) {
        l.tasks.push(new Task(task.id, task.name, task.description));
      }
    }
  }

}
