import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { TokenRequest } from '../models/api/auth';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, 
              private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
      const request: TokenRequest= {
        token: localStorage.getItem('token') || ''
      };
      return this.authService.validateToken(request).pipe(
        map( response => {
          localStorage.setItem('token', response.token);
          return true;
        }),
        catchError( _ => of(false)),
        tap(result => {
          if(!result) {
            this.router.navigate(['/login']);
          }
        })
      );
      
  }

}
