import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Doctor, DoctorRequest, DoctorResponse, DoctorSearchResponse, DoctorUpdatedResponse } from '../models/api/doctor';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private url: string = `${environment.baseUrl}/doctors`;

  constructor(private http: HttpClient) { }

  createDoctor(token: string, request: DoctorRequest): Observable<DoctorResponse> {
    return this.http.post<DoctorResponse>(this.url, request, { headers: { 'token': token } });
  }

  updateDoctor(token: string, id: string, request: DoctorRequest): Observable<Doctor> {
    return this.http.put<DoctorUpdatedResponse>(`${this.url}/${id}`, request, { headers: { 'token': token } })
      .pipe(map(response => response.doctorUpdated));
  }

  getDoctors(token: string): Observable<DoctorSearchResponse> {
    return this.http.get<DoctorSearchResponse>(this.url, { headers: { 'token': token } });
  }

  removeDoctor(token: string, id: string): Observable<Doctor> {
    return this.http.delete<Doctor>(`${this.url}/${id}`, { headers: { 'token': token }});
  }
}
