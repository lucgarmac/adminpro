import { NgModule } from '@angular/core';
import { SharedFunctionalModule } from '../shared/shared-functional.module';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';




@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    SharedFunctionalModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
