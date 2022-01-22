import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UserResponse, UserRequest, User, UserUpdatedResponse, UserSearchResponse, UserSearchRequest } from '../models/api/user';
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

  getUsers(token: string, request: UserSearchRequest): Observable<UserSearchResponse> {
    const params = this.getQueryParams(request);
    return this.http.get<UserSearchResponse>(this.url, { headers: { 'token': token }, params });
  }

  removeUser(token: string, userUid: string): Observable<User> {
    return this.http.delete<User>(`${this.url}/${userUid}`, { headers: { 'token': token }});
  }

  private getQueryParams(request: any) {
    let httpParams: HttpParams = new HttpParams();
    Object.keys(request).forEach(key => {
      httpParams = httpParams.set(key, request[key]);
    });
    return httpParams;
  }

}
