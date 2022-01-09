import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';

import { DoughnutComponent } from './doughnut/doughnut.component';
import { IncreaserComponent } from './increaser/increaser.component';
import { CustomErrorComponent } from './custom-error/custom-error.component';



@NgModule({
  declarations: [
    IncreaserComponent,
    DoughnutComponent,
    CustomErrorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgChartsModule
  ],
  exports: [
    IncreaserComponent,
    DoughnutComponent,
    CustomErrorComponent
  ]
})
export class ComponentsModule { }
