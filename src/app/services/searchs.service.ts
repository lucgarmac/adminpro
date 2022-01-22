import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DataEntityResponse, SearchEntityRequest } from '../models/api/search';

@Injectable({
  providedIn: 'root'
})
export class SearchsService {

  private url: string = `${environment.baseUrl}/search`;

  constructor(private http: HttpClient) { }


  getDataEntitiesByName(token: string, request: SearchEntityRequest): Observable<DataEntityResponse> {
    return this.http.get<DataEntityResponse>(`${this.url}/all/${request.name}`, { headers: { 'token': token } });
  }

  getDataByEntityAndName(token: string, request: SearchEntityRequest): Observable<DataEntityResponse> {
    return this.http.get<DataEntityResponse>(`${this.url}/${request.entity}/${request.name}`, { headers: { 'token': token } });
  }
}
