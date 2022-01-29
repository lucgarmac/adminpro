import { NgModule } from '@angular/core';
import { SharedFunctionalModule } from 'src/app/shared/shared-functional.module';
import { Charts1Component } from './charts1/charts1.component';
import { MainSectionRoutingModule } from './main-section-routing.module';
import { ProgressComponent } from './progress/progress.component';
import { PromiseComponent } from './promise/promise.component';
import { RxjsComponent } from './rxjs/rxjs.component';



@NgModule({
  declarations: [
    ProgressComponent,
    Charts1Component,
    PromiseComponent,
    RxjsComponent
  ],
  imports: [
    SharedFunctionalModule,
    MainSectionRoutingModule
  ]
})
export class MainSectionModule { }
