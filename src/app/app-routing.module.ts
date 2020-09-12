import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsListComponent } from './components/projects-list/projects-list.component'
import { ProjectDetailsComponent } from './components/project-details/project-details.component';
import { HomeComponent } from './components/home/home.component';
import { NewProjectComponent } from './components/new-project/new-project.component'
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'list', component: ProjectsListComponent, canActivate: [AuthGuard] },
  { path: 'project/new', component: NewProjectComponent, canActivate: [AuthGuard] },
  { path: 'project/:id', component: ProjectDetailsComponent, canActivate: [AuthGuard] },
  { path: 'project/:id/task/:task_id', component: ProjectDetailsComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
