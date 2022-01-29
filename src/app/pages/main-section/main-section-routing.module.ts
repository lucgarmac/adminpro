import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Charts1Component } from './charts1/charts1.component';
import { ProgressComponent } from './progress/progress.component';
import { PromiseComponent } from './promise/promise.component';
import { RxjsComponent } from './rxjs/rxjs.component';

const routes: Routes = [
  { path: 'progress', component: ProgressComponent, data: { title: 'ProgressBar'} }, 
  { path: 'charts', component: Charts1Component, data: { title: 'Charts'} },
  { path: 'promises', component: PromiseComponent, data: { title: 'Promises'}},
  { path: 'rxjs', component: RxjsComponent, data: { title: 'Rxjs'} },
  { path: '**', redirectTo: '/dashboard', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainSectionRoutingModule { }
