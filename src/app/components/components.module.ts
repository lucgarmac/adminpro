import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';

import { DoughnutComponent } from './doughnut/doughnut.component';
import { IncreaserComponent } from './increaser/increaser.component';



@NgModule({
  declarations: [
    IncreaserComponent,
    DoughnutComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgChartsModule
  ],
  exports: [
    IncreaserComponent,
    DoughnutComponent
  ]
})
export class ComponentsModule { }
