import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../guards/auth.guard';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { ProgressComponent } from './progress/progress.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromiseComponent } from './promise/promise.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { 
    path: 'dashboard', 
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardComponent, data: { title: 'Dashboard'} },
      { path: 'progress', component: ProgressComponent, data: { title: 'ProgressBar'} }, 
      { path: 'charts', component: Grafica1Component, data: { title: 'Charts'} },
      { path: 'promises', component: PromiseComponent, data: { title: 'Promises'}},
      { path: 'rxjs', component: RxjsComponent, data: { title: 'Rxjs'} },
      { path: 'account-settings', component: AccountSettingsComponent, data: { title: 'Theme'} },
      { path: 'profile', component: ProfileComponent, data: { title: 'Profile'} }
    ]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
