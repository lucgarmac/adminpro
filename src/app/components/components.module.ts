import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';

import { DoughnutComponent } from './doughnut/doughnut.component';
import { IncreaserComponent } from './increaser/increaser.component';
import { CustomErrorComponent } from './custom-error/custom-error.component';
import { AlertLoaderComponent } from './alert-loader/alert-loader.component';
import { TableSearchComponent } from './table-search/table-search.component';
import { ModalImageComponent } from './modal-image/modal-image.component';



@NgModule({
  declarations: [
    IncreaserComponent,
    DoughnutComponent,
    CustomErrorComponent,
    AlertLoaderComponent,
    TableSearchComponent,
    ModalImageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgChartsModule
  ],
  exports: [
    IncreaserComponent,
    DoughnutComponent,
    CustomErrorComponent,
    AlertLoaderComponent,
    TableSearchComponent,
    ModalImageComponent
  ]
})
export class ComponentsModule { }
