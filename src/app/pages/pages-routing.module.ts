import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../guards/auth.guard';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Charts1Component } from './charts1/charts1.component';
import { ProgressComponent } from './progress/progress.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromiseComponent } from './promise/promise.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { ProfileComponent } from './profile/profile.component';
import { UsersComponent } from './management/users/users.component';
import { HospitalsComponent } from './management/hospitals/hospitals.component';
import { DoctorsComponent } from './management/doctors/doctors.component';

const routes: Routes = [
  { 
    path: 'dashboard', 
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardComponent, data: { title: 'Dashboard'} },
      { path: 'progress', component: ProgressComponent, data: { title: 'ProgressBar'} }, 
      { path: 'charts', component: Charts1Component, data: { title: 'Charts'} },
      { path: 'promises', component: PromiseComponent, data: { title: 'Promises'}},
      { path: 'rxjs', component: RxjsComponent, data: { title: 'Rxjs'} },
      { path: 'account-settings', component: AccountSettingsComponent, data: { title: 'Theme'} },
      { path: 'profile', component: ProfileComponent, data: { title: 'Profile'} },
      { path: 'users', component: UsersComponent, data: { title: 'Users management'} },
      { path: 'hospitals', component: HospitalsComponent, data: { title: 'Hospitals management'} },
      { path: 'doctors', component: DoctorsComponent, data: { title: 'Doctors management'} }
    ]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
