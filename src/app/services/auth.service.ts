import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TokenRequest, LoginRequest, LoginResponse } from '../models/api/auth';
import { UserResponse } from '../models/api/user';


declare const gapi:any;


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth2: any;
  private url: string = `${environment.baseUrl}/login`;

  constructor(private http: HttpClient,
              private router: Router,
              private ngZone: NgZone) { 
    // Auth2 will remain instantiated even if the cache is cleared.
    this.loadAuthGoogle();
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<{token:string}>(this.url, request);
  }

  loginWithGoogle(request: TokenRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.url}/google`, request);
  }

  validateToken(token: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.url}/renew`, { 
      headers: { 'token': token }
    });
  }

  logout() {
    this.auth2.signOut().then(() => {
      this.ngZone.run(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('menu');
        this.router.navigate(['/login']);
      });
    });
  }

  loadAuthGoogle(): any {
    return new Promise((resolve) => {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '502632349653-usqshfgnckmjk3nctakd04mjuamqf10j.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin'
        });

        resolve(this.auth2);
      });
    });
    
  }
}
