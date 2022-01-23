import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Hospital, HospitalRequest, HospitalResponse, HospitalSearchResponse, HospitalUpdatedResponse } from '../models/api/hospital';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  private url: string = `${environment.baseUrl}/hospitals`;

  constructor(private http: HttpClient) {
  }

  createHospital(token: string, request: HospitalRequest): Observable<HospitalResponse> {
    return this.http.post<HospitalResponse>(this.url, request,  { headers: { 'token': token } });
  }

  updateHospital(token: string, id: string, request: HospitalRequest): Observable<Hospital> {
    return this.http.put<HospitalUpdatedResponse>(`${this.url}/${id}`, request, { headers: { 'token': token } })
      .pipe(map(response => response.hospitalUpdated));
  }

  getHospitals(token: string): Observable<HospitalSearchResponse> {
    return this.http.get<HospitalSearchResponse>(this.url, { headers: { 'token': token } });
  }

  removeHospital(token: string, id: string): Observable<Hospital> {
    return this.http.delete<Hospital>(`${this.url}/${id}`, { headers: { 'token': token }});
  }
}
