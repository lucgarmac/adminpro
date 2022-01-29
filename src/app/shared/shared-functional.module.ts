import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../pipes/pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsModule } from '../components/components.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PipesModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModalModule,
    ComponentsModule
  ],
  exports: [
    CommonModule,
    PipesModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModalModule,
    ComponentsModule
  ],
  providers: [
    NgbModal,
    NgbActiveModal
  ]
})
export class SharedFunctionalModule { }
