import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserCreatedResponse, UserRequest } from '../models/api/user';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url: string = `${environment.baseUrl}/users`;

  constructor(private http: HttpClient) { 
  }

  createUser(request: UserRequest): Observable<UserCreatedResponse> {
    return this.http.post<UserCreatedResponse>(this.url, request);
  }

}
