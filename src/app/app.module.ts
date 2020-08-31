import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProjectCardComponent } from './components/project-card/project-card.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProjectsListComponent } from './components/projects-list/projects-list.component';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './guard/auth.guard';
import { NewProjectComponent } from './components/new-project/new-project.component';
import { SocketIoModule } from 'ngx-socket-io';
import { NotifyToastComponent } from './components/notify-toast/notify-toast.component';

@NgModule({
  declarations: [
    AppComponent,
    ProjectCardComponent,
    NavbarComponent,
    ProjectsListComponent,
    ProjectDetailsComponent,
    HomeComponent,
    NewProjectComponent,
    NotifyToastComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    SocketIoModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
