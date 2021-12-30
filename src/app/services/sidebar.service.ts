import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  private _menu = [
    {
      title: 'Main',
      icon: 'mdi mdi-gauge',
      children: [
        { title: 'Dashboard', path: '/' },
        { title: 'Progress bar', path: 'progress' },
        { title: 'Charts', path: 'charts' }
      ]
    }
  ]

  constructor() { }

  get menu() {
    return this._menu;
  }
}
