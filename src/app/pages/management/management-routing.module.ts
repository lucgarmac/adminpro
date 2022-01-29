import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from 'src/app/guards/admin.guard';
import { DoctorFormComponent } from './doctors/actions/doctor-form/doctor-form.component';
import { DoctorsComponent } from './doctors/doctors.component';
import { HospitalsComponent } from './hospitals/hospitals.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  { path: 'users', component: UsersComponent, data: { title: 'Users'}, canActivate: [AdminGuard] },
  { path: 'hospitals', component: HospitalsComponent, data: { title: 'Hospitals'} },
  { path: 'doctors', component: DoctorsComponent, data: { title: 'Doctors'} },
  { path: 'doctors/new', component: DoctorFormComponent, data: { title: 'New Doctor'} },
  { path: 'doctors/:uid', component: DoctorFormComponent, data: { title: 'Update Doctor'} }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule { }
