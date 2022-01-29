import { NgModule } from '@angular/core';
import { SharedFunctionalModule } from '../shared/shared-functional.module';
import { SharedModule } from '../shared/shared.module';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { ProfileComponent } from './profile/profile.component';
import { SearchesComponent } from './searches/searches.component';




@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    AccountSettingsComponent,
    ProfileComponent,
    SearchesComponent
  ],
  imports: [
    SharedFunctionalModule,
    SharedModule,
    PagesRoutingModule
  ],
  exports: [
    DashboardComponent,
    AccountSettingsComponent
  ]
})
export class PagesModule { }
