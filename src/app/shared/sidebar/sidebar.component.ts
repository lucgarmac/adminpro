import { Component, OnInit } from '@angular/core';
import { EntityNameEnum } from 'src/app/models/api/entity-name-enum';
import { FileRequest } from 'src/app/models/api/file';
import { User } from 'src/app/models/api/user';
import { MenuItem } from 'src/app/models/menu-item';
import { AuthService } from 'src/app/services/auth.service';
import { FilesService } from 'src/app/services/files.service';
import { PagesService } from 'src/app/pages/pages.service';
import { SidebarService } from 'src/app/services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {

  user: User;
  imgUserUrl: string;
  menuItems: MenuItem[];
  

  constructor(private sidebarService: SidebarService,
              private authService: AuthService,
              private filesService: FilesService,
              private pagesService: PagesService) { }

  ngOnInit(): void {
    this.menuItems = this.sidebarService.menu;
    this.menuItems.forEach((item) => item.children.sort((a, b) => (a.title >= b.title) ? 1 : -1));
    this.getImageUser();

    this.pagesService.user$.subscribe(_ => {
      this.getImageUser();
    });
    
  }

  logoutClick() {
    this.authService.logout();
  }

  private getImageUser() {
    const lsUser = localStorage.getItem('user');
    this.user = lsUser ? JSON.parse(lsUser) : null;

    const request: FileRequest = {
      entity: EntityNameEnum.Users,
      imageName: this.user && this.user.img ? this.user.img : 'no-image'
    };
    this.imgUserUrl = this.filesService.getImageEntity(request);

  }


}
