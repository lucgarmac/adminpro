import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from '../models/api/user';

@Injectable({
  providedIn: 'root'
})
export class PagesService {

  user: User;

  private userSource = new Subject<User>();

  user$ = this.userSource.asObservable();

  constructor() { }

  setUser(value: User) {
    this.user = value;
    this.userSource.next(value);
  }

  getUser() {
    this.user ? this.user : null;
  }
}
