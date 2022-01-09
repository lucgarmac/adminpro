import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserResponse, UserRequest, User, UserUpdatedResponse } from '../models/api/user';
import { environment } from 'src/environments/environment';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url: string = `${environment.baseUrl}/users`;

  constructor(private http: HttpClient) {
  }

  createUser(request: UserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.url, request);
  }

  updateUser(token: string, userUid: string, request: UserRequest): Observable<User> {
    return this.http.put<UserUpdatedResponse>(`${this.url}/${userUid}`, request, { headers: { 'token': token } })
      .pipe(map(response => response.userUpdated));
  }

}
