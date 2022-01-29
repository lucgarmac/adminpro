import { NgModule } from '@angular/core';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedFunctionalModule } from 'src/app/shared/shared-functional.module';
import { DoctorFormComponent } from './doctors/actions/doctor-form/doctor-form.component';
import { DoctorsComponent } from './doctors/doctors.component';
import { EditHospitalModalComponent } from './hospitals/actions/edit-hospital-modal/edit-hospital-modal.component';
import { HospitalsComponent } from './hospitals/hospitals.component';
import { ManagementRoutingModule } from './management-routing.module';
import { EditUserModalComponent } from './users/actions/edit-user-modal/edit-user-modal.component';
import { UsersComponent } from './users/users.component';



@NgModule({
  declarations: [
    UsersComponent,
    DoctorsComponent,
    HospitalsComponent,
    EditUserModalComponent,
    EditHospitalModalComponent,
    DoctorFormComponent,
  ],
  imports: [
    SharedFunctionalModule,
    ManagementRoutingModule,
    NgbModalModule
  ],
  exports: [
    UsersComponent,
    DoctorsComponent,
    HospitalsComponent,
    EditUserModalComponent,
    EditHospitalModalComponent,
    DoctorFormComponent,
  ]
})
export class ManagementModule { }
