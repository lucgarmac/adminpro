import { Injectable } from '@angular/core';
import { MenuItem } from '../models/menu-item';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  private _menu: MenuItem[];

  constructor() { }

  get menu(): MenuItem[] {
    const menuUser = localStorage.getItem('menu');
    this._menu = menuUser ? JSON.parse(menuUser) : [];
    return this._menu;
  }
}
