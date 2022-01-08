import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'src/app/models/menu-item';
import { AuthService } from 'src/app/services/auth.service';
import { SidebarService } from 'src/app/services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {

  menuItems: MenuItem[];

  constructor(private sidebarService: SidebarService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.menuItems = this.sidebarService.menu;
    this.menuItems.forEach((item) => item.children.sort((a, b) => (a.title >= b.title) ? 1 : -1));
  }

  logoutClick() {
    this.authService.logout();
  }


}
