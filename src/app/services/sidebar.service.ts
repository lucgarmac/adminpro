import { Injectable } from '@angular/core';
import { MenuItem } from '../models/menu-item';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  private _menu: MenuItem[] = [
    {
      title: 'Main',
      icon: 'mdi mdi-gauge',
      children: [
        { title: 'Dashboard', path: '/' },
        { title: 'Progress bar', path: 'progress' },
        { title: 'Charts', path: 'charts' },
        { title: 'Promises', path: 'promises' },
        { title: 'Rxjs', path: 'rxjs' }
      ]
    }
  ]

  constructor() { }

  get menu(): MenuItem[] {
    return this._menu;
  }
}
