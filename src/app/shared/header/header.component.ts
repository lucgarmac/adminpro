import { Component, OnInit } from '@angular/core';
import { EntityNameEnum } from 'src/app/models/api/entity-name-enum';
import { FileRequest } from 'src/app/models/api/file';
import { User } from 'src/app/models/api/user';
import { AuthService } from 'src/app/services/auth.service';
import { FilesService } from 'src/app/services/files.service';
import { PagesService } from 'src/app/pages/pages.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit{

  user: User;
  imgUserUrl: string;

  constructor(private authService: AuthService,
              private filesService: FilesService,
              private pagesService: PagesService,
              private router: Router) { }

  ngOnInit(): void {
    this.getImageUser();
    this.pagesService.user$.subscribe(_ => {
      this.getImageUser();
    });
  }

  findEntities(criteria: string) {
    this.router.navigate(['/dashboard/searches', criteria]);
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
