import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';
import { ProfileComponent } from './profile/profile.component';
import { SearchesComponent } from './searches/searches.component';



const routes: Routes = [
  { 
    path: '', 
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent, data: { title: 'Dashboard'} },
      { path: 'account-settings', component: AccountSettingsComponent, data: { title: 'Theme'} },
      { path: 'profile', component: ProfileComponent, data: { title: 'Profile'} },
      { path: 'searches/:criteria', component: SearchesComponent, data: { title: 'Search entities'} },
      { path: 'main', data: { title: 'Main'}, loadChildren: () => import('./main-section/main-section.module').then(m => m.MainSectionModule)},
      { path: 'management', data: { title: 'Management'}, loadChildren: () => import('./management/management.module').then(m => m.ManagementModule)},
      { path: '**', redirectTo: 'dashboard', pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
