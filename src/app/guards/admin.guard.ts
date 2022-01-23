import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { RoleEnum } from '../models/api/role-enum';
import { User } from '../models/api/user';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {


  constructor(private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const user: User = JSON.parse(localStorage.getItem('user')) || null;
    if(!(user && user.role === RoleEnum.AdminRole)) {
      this.router.navigate(['/dashboard']);
      return false;
    }

   return true;
  }

}
