import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ProjectsService } from '../../services/projects.service'
import { StatusService } from '../../services/status.service'
import { TasksService } from '../../services/tasks.service'
import { AuthService } from '../../services/auth.service'
import { List } from '../../models/list'
import { DatePipe } from '@angular/common'
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop'
import { Task, TaskUser } from '../../models/task';
import { ActivatedRoute } from '@angular/router'

interface ProjectUser {
  user: string;
  owner: boolean;
}

function mapToUser(x): ProjectUser {
  return {
    user: x[0],
    owner: x[1]
  }
}

interface ProjectDetails {
  id: number;
  projectName: string;
  created: Date;
  updated: Date;
  assignees: ProjectUser[];
}

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})

export class ProjectDetailsComponent implements OnInit, AfterViewChecked {
  projectDetails: ProjectDetails;
  details: Task = new Task(0, '', '');
  taskUser: string;
  taskError: string = null;
  isOwner: boolean = false;
  
  listName: string;
  addName: string;
  removeName: string;

  listForNewTask: number;
  taskName: string;
  taskDes: string;

  lists: List[] = [];
  errorMsg: string = null;

  taskID: number = 0;

  constructor(private route: ActivatedRoute, private projectService: ProjectsService, private statusService: StatusService, private taskService: TasksService, private auth: AuthService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      
      if(params['task_id'] != null) {
        this.taskID = +params['task_id'];
      }
      else {
        this.taskID = -1;
      }

      this.projectService.details(id).subscribe(
        data => {
          const assignees: ProjectUser[] = data.assignees.map(mapToUser);
  
          this.projectDetails = {
            id: data.id,
            projectName: data.name,
            created: new Date(data.created_at),
            updated: new Date(data.updated_at),
            assignees
          }

          const owners = this.projectDetails.assignees.filter(x => x.owner).filter(x => x.user === this.auth.getUsername());
          this.isOwner = owners.length > 0;
  
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
  
                  this.checkAssigned();
                },
                error => {
                  this.errorMsg = error.error.error;
                }
              )
            },
            error => {
              this.errorMsg = error.error.error;
            }
          );
        },
        error => {
          this.errorMsg = error.error.error;
        }
      );
    });
  }

  done: boolean = false;
  ngAfterViewChecked(): void {
    if(!this.done) {     
      if(this.taskID < 0) {
        this.done = true;
        return;
      }
      const el = document.getElementById(`task-card-${this.taskID}`);

      if(el) {
        el.click()
        this.done = true;
      }
    }
  }

  checkAssigned() {
    this.taskService.assigned(this.projectDetails.id).subscribe(
      data => {
        const ids: number[] = data.map(d => d.id);
        
        for(let l of this.lists) {
          for(let t of l.tasks) {
            if(ids.find(x => x === t.id)) {
              t.assigned = true;
            }
            else {
              t.assigned = false;
            }
          }
        }
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
        this.errorMsg = error.error.error;
      }
    );
  }

  removeList(id: number) {
    this.statusService.deleteStatus(this.projectDetails.id, id).subscribe(
      data => {
        window.location.reload();
      },
      error => {
        this.errorMsg = error.error.error;
      }
    );
  }

  deleteProject() {
    this.projectService.deleteProject(this.projectDetails.id).subscribe(
      data => {
        window.location.replace('/list');
      },
      error => {
        this.errorMsg = error.error.error;
      }
    );
  }

  addUser(event: Event) {
    event.preventDefault();

    this.projectService.assign(this.projectDetails.id, this.addName).subscribe(
      data => {
        document.getElementById('addButton').click();
        this.addName = '';

        this.projectService.details(this.projectDetails.id).subscribe(
          data => {
            const assignees: ProjectUser[] = data.assignees.map(mapToUser);

            this.projectDetails = {
              id: data.id,
              projectName: data.name,
              created: new Date(data.created_at),
              updated: new Date(data.updated_at),
              assignees
            }
            this.errorMsg = null;
          },
          error => {
            this.errorMsg = error.error.error;
          }
        );
      },
      error => {
        this.errorMsg = error.error.error;
      }
    );
  }

  removeUser(event: Event) {
    event.preventDefault();

    this.projectService.unassign(this.projectDetails.id, this.removeName).subscribe(
      data => {
        document.getElementById('removeButton').click();
        this.removeName = '';

        this.projectService.details(this.projectDetails.id).subscribe(
          data => {
            const assignees: ProjectUser[] = data.assignees.map(mapToUser);

            this.projectDetails = {
              id: data.id,
              projectName: data.name,
              created: new Date(data.created_at),
              updated: new Date(data.updated_at),
              assignees
            }
            this.errorMsg = null;
          },
          error => {
            this.errorMsg = error.error.error;
          }
        );
      },
      error => {
        this.errorMsg = error.error.error;
      }
    );
  }

  selectList(listId: number) {
    this.listForNewTask = listId;
  }

  createTask(event: Event) {
    event.preventDefault();

    this.taskService.create(this.projectDetails.id, this.taskName, this.taskDes, this.listForNewTask).subscribe(
      data => {
        window.location.reload();
      },
      error => {
        this.errorMsg = error.error.error;
      }
    )
  }

  showDetails(taskId: number) {
    this.taskService.details(this.projectDetails.id, taskId).subscribe(
      data => {
        const pipe = new DatePipe('en-US');

        this.details = new Task(data.id, data.name, data.description);
        this.details.created_by = data.created_by;
        this.details.created_at = pipe.transform(data.created_at, 'medium');
        this.details.updated_at = pipe.transform(data.updated_at, 'medium');
        this.details.status = data.status_id;
        this.details.assignees = data.assignees;

        this.details.selectedUsers = this.projectDetails.assignees.map(u => {
          const us = new TaskUser();
          us.user = u.user;
          if(this.details.assignees.find(x => x === us.user)) {
            us.assigned = true;
          }
          else {
            us.assigned = false;
          }
          return us;
        });
        this.errorMsg = null;
      },
      error => {
        this.errorMsg = error.error.error;
      }
    )
  }

  saveChanges() {
    this.taskService.update(this.projectDetails.id, this.details.id,
      this.details.name, this.details.description, this.details.status).subscribe(
        data => {
          const assignees = this.details.selectedUsers.filter(x => x.assigned).map(x => x.user);
          this.taskService.assign(this.projectDetails.id, this.details.id, assignees).subscribe(
            data => {
              this.showDetails(this.details.id);
              this.taskError = null;
              this.checkAssigned();
              this.errorMsg = null;
            },
            error => {
              document.getElementById('closeButton').click();
              this.errorMsg = error.error.error;
            }
          );
        },
        error => {
          document.getElementById('closeButton').click();
          this.errorMsg = error.error.error;
        }
      )
  }

  drop(event: CdkDragDrop<string[]>, id: number) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } 
    else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);

      const taskEl = new DOMParser().parseFromString(event.item.element.nativeElement.innerHTML, 'text/html') as HTMLDocument;
      const taskId = parseInt(taskEl.getElementsByClassName('task-id')[0].textContent);
      const taskName = taskEl.getElementById('t-name').textContent;
      const taskDescription = taskEl.getElementsByClassName('task-description')[0].textContent;

      this.taskService.update(this.projectDetails.id, taskId, taskName, taskDescription, id).subscribe(
        data => {
          this.errorMsg = null;
        },
        error => {
          this.errorMsg = error.error.error;

          transferArrayItem(event.container.data,
            event.previousContainer.data,
            event.currentIndex,
            event.previousIndex);
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
