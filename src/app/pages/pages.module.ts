import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ComponentsModule } from '../components/components.module';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Charts1Component } from './charts1/charts1.component';
import { PagesComponent } from './pages.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromiseComponent } from './promise/promise.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { ProfileComponent } from './profile/profile.component';
import { UsersComponent } from './management/users/users.component';
import { DoctorsComponent } from './management/doctors/doctors.component';
import { HospitalsComponent } from './management/hospitals/hospitals.component';
import { NgbActiveModal, NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { EditUserModalComponent } from './management/users/actions/edit-user-modal/edit-user-modal.component';
import { EditHospitalModalComponent } from './management/hospitals/actions/edit-hospital-modal/edit-hospital-modal.component';
import { PipesModule } from '../pipes/pipes.module';
import { DoctorFormComponent } from './management/doctors/actions/doctor-form/doctor-form.component';
import { SearchesComponent } from './searches/searches.component';



@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    ProgressComponent,
    Charts1Component,
    AccountSettingsComponent,
    PromiseComponent,
    RxjsComponent,
    ProfileComponent,
    UsersComponent,
    DoctorsComponent,
    HospitalsComponent,
    EditUserModalComponent,
    EditHospitalModalComponent,
    DoctorFormComponent,
    SearchesComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgbModalModule,
    PipesModule
  ],
  exports: [
    DashboardComponent,
    ProgressComponent,
    Charts1Component,
    AccountSettingsComponent
  ],
  providers: [
    NgbModal,
    NgbActiveModal
  ]
})
export class PagesModule { }
