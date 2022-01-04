import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-promise',
  templateUrl: './promise.component.html',
  styles: [
  ]
})
export class PromiseComponent implements OnInit {

  execPromise: any[] = [];
  users: User[];

  constructor() { }

  ngOnInit(): void {
    this.getUsers().then(users => {
      console.log(users);
      this.users = <User[]>users;
    });
    // const promise = new Promise((resolve, reject) => {
      
    //   const boolValue = false;
    //   if(boolValue) {
    //     resolve('Hola mundo');
    //   } else {
    //     reject('CODE 447895222')
    //   }
      
    // })
    // .then(value => console.log(value))
    // .catch(err => console.log('An error has ocurred:', err));

    // console.log('*********************************')
    // console.log('******* FINISH ngOnInit() *******');
    // console.log('*********************************')

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
        resolve(<User[]>(body.data));

      });
    });
  }

}
