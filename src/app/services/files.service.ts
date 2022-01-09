import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Doctor } from '../models/api/doctor';
import { EntityNameEnum } from '../models/api/entity-name-enum';
import { FileRequest, FileUploadRequest, } from '../models/api/file';
import { Hospital } from '../models/api/hospital';
import { User } from '../models/api/user';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  private url: string = `${environment.baseUrl}/upload`;

  constructor(private http: HttpClient) { }

  getImageEntity(request: FileRequest ):string {
    return request.imageName.includes('https') || request.imageName.includes('http')   
    ? request.imageName
    : `${this.url}/${request.entity}/${request.imageName}`;
  }

  uploadImage(token: string, request: FileUploadRequest): Observable<User | Doctor | Hospital> {
    const formData = new FormData();
    formData.append('img', request.img);
    return this.http.patch<any> (`${this.url}/${request.entity}/${request.id}`, formData, { headers: { 'token': token}})
          .pipe( 
            map( response => request.entity === EntityNameEnum.Users 
                  ? response.user
                  : request.entity === EntityNameEnum.Hospitals
                    ? response.hospital : response.doctor
            )
          );
  }
}
