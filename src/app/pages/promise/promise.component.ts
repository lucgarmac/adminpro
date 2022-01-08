import { Component, OnInit } from '@angular/core';
import { ReqResInUser } from 'src/app/models/req-res-in-user';

@Component({
  selector: 'app-promise',
  templateUrl: './promise.component.html',
  styles: [
  ]
})
export class PromiseComponent implements OnInit {

  execPromise: any[] = [];
  users: ReqResInUser[];

  constructor() { }

  ngOnInit(): void {
    this.getUsers().then(users => {
      console.log(users);
      this.users = <ReqResInUser[]>users;
    });
  }

  getUsers() {
    return new Promise( resolve => {
      fetch('https://reqres.in/api/users')
    .then( response => {
      console.log('first then', response);
      this.execPromise.push(response);
      return response.json();
    })
    .then( body => {
        console.log('second then', body);
        this.execPromise.push(body);
        resolve(<ReqResInUser[]>(body.data));

      });
    });
  }

}
