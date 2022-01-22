import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Doctor } from 'src/app/models/api/doctor';
import { EntityNameEnum } from 'src/app/models/api/entity-name-enum';
import { Hospital } from 'src/app/models/api/hospital';
import { User } from 'src/app/models/api/user';
import { EntityDataModal, ModalData } from 'src/app/models/components/modal-data';


@Injectable({
  providedIn: 'root'
})
export class ModalImageService {

  private dataModalSource = new Subject<ModalData>();

  dataModel$ = this.dataModalSource.asObservable();

  updateImageSuccess = new EventEmitter<User | Doctor | Hospital>();

  constructor() { }

  openModal(entity: EntityNameEnum, id: string, token: string, defaultImageUrl?: string) {
    const entityDataModal: EntityDataModal = {
      entity,
      id,
      token,
      defaultImageUrl
    }
    this.dataModalSource.next({hide: false, entityDataModal});
  }
  
  closeModal() {
    this.dataModalSource.next({hide: true });
  }
}
