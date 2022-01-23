import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { finalize } from 'rxjs';
import { EntityNameEnum } from 'src/app/models/api/entity-name-enum';
import { FileRequest } from 'src/app/models/api/file';
import { SearchEntityRequest } from 'src/app/models/api/search';
import { User, UserSearchRequest, UserRequest } from 'src/app/models/api/user';
import { TableColumn, TableColumnTypeEnum, TablePagination } from 'src/app/models/components/table-search';
import { UserExtended } from 'src/app/models/user-extended';
import { FilesService } from 'src/app/services/files.service';
import { SearchesService } from 'src/app/services/searchs.service';
import { UserService } from 'src/app/services/user.service';
import { PagesService } from '../../pages.service';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditUserModalComponent } from './actions/edit-user-modal/edit-user-modal.component';
import { ModalImageService } from 'src/app/services/components/modal-image.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {

  private token: string;
  private _defaultPagination = {
    offset: 0,
    limit: 5
  };

  user: User;
  errorInSearch: boolean;
  showLoader: boolean;
  nameCriteria: string;

  // configure table
  enablePagination: boolean = true;
  tableColumns: TableColumn[];
  originaltableRows: UserExtended[];
  tableRows: UserExtended[];
  pagination: TablePagination;


  @ViewChild('imgTemplate', { static: true }) imgTemplate: TemplateRef<any>;
  @ViewChild('authTemplate', { static: true }) authTemplate: TemplateRef<any>;

  get defaultPagination() {
    return this._defaultPagination;
  }

  constructor(private userService: UserService,
              private pagesService: PagesService,
              private filesService: FilesService,
              private searchesService: SearchesService,
              private modalService: NgbModal,
              private modalImageService: ModalImageService) { }

  ngOnInit(): void {
    this.getUser();
    this.getTable();
    this.pagesService.user$.subscribe(_ => {
      this.getUser();
    });

    this.modalImageService.updateImageSuccess.subscribe((user: User) => {
      if(user.uid === this.user.uid) {
        localStorage.setItem('user', JSON.stringify(user));
        this.pagesService.setUser(user);
        this.getUser();
      }
      
      this.loadData();
    });

    this.loadData();
  }

  onPageChange(offset: number) {
    this.pagination.offset = offset;
    this.loadData();
  }

  onRemoveUser(user: UserExtended) {
    if(user.uid === this.user.uid) {
      return;
    }
    Swal.fire({
      title: 'Delete user',
      text: `Are you sure you want to delete the user '${user.email}'?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.removeUser(this.token, user.uid)
          .subscribe({
            next: _ => {
              this.loadData();
              Swal.fire({
                title: 'Deleted user',
                text: 'The user has been deleted successfully.',
                icon: 'success',
                showConfirmButton: false,
                timer: 1500
              });
            },
            error: err =>  Swal.fire({
              title: 'Delete user',
              text: err.error.msg,
              icon: 'error',
              showConfirmButton: false,
              timer: 1500
            })
          });
        
      }
    })
  }

  onEditUser(user: UserExtended) {
    const modalRef = this.modalService.open(EditUserModalComponent, {backdrop: 'static', keyboard: false});
    modalRef.componentInstance.userToEdit = user;
    modalRef.componentInstance.token = this.token;
    modalRef.result.then(result => {
      if(result === 'success') {
        this.loadData();
      }
    });
  }

  onEditImage(uid: string) {
    const userFound: UserExtended = this.tableRows.find(user => user.uid === uid);
    if(userFound) {
      console.log('abrir modal image')
      this.modalImageService.openModal(EntityNameEnum.Users, uid, this.token,userFound.imgUrl);
    }
  }
 

  searchData() {
    if (this.nameCriteria) {
      const request: SearchEntityRequest = {
        entity: EntityNameEnum.Users,
        name: this.nameCriteria
      };
      this.enablePagination = false;
      this.searchesService.getDataByEntityAndName(this.token, request)
        .subscribe(response => {
          this.updateData(response.users);
        });
    } else {
      this.cleanCriteria();
    }
  }

  cleanCriteria() {
    this.nameCriteria = '';
    this.enablePagination = true;
    this.tableRows = this.originaltableRows;
  }

  private getTable() {
    this.tableColumns = [
      {
        id: 'imgTemplate',
        label: 'Avatar',
        type: TableColumnTypeEnum.Html,
        fixed: true,
        columnWidth: 100
      },
      {
        id: 'email',
        label: 'Email',
        type: TableColumnTypeEnum.Data,
        fixed: false
      },
      {
        id: 'name',
        label: 'Name',
        type: TableColumnTypeEnum.Data,
        fixed: false
      },
      {
        id: 'role',
        label: 'Role',
        type: TableColumnTypeEnum.Data,
        fixed: true,
        columnWidth: 100
      },
      {
        id: 'authTemplate',
        label: 'Auth',
        type: TableColumnTypeEnum.Html,
        fixed: true,
        columnWidth: 100
      }
    ];
    this.pagination = { limit: this.defaultPagination.limit, offset: this.defaultPagination.offset, totalItems: 0 };
  }

  private getUser() {
    const lsUser = localStorage.getItem('user');
    this.user = lsUser ? JSON.parse(lsUser) : null;
    this.token = localStorage.getItem('token') || '';
  }

  private loadData() {
    this.errorInSearch = false;
    this.showLoader = true;
    const criteria: UserSearchRequest = {
      offset: this.pagination.offset,
      limit: this.pagination.limit
    };
    this.userService.getUsers(this.token, criteria)
      .pipe(finalize(() => this.showLoader = false))
      .subscribe({
        next: response => {
          this.pagination = {
            limit: this.pagination.limit,
            offset: this.pagination.offset,
            totalItems: response.totalItems
          };

          this.updateData(response.users);
          this.originaltableRows = Array.from(this.tableRows);
        }, error: _ => this.errorInSearch = true

      });
  }

  private updateData(users: UserExtended[]) {
    users.forEach(user => {
      user.imgTemplate = this.imgTemplate;
      user.authTemplate = this.authTemplate;
      user.imgUrl = user.img;
      if (!user.google) {
        const request: FileRequest = {
          entity: EntityNameEnum.Users,
          imageName: user && user.img ? user.img : 'no-image'
        };
        user.imgUrl = this.filesService.getImageEntity(request);
      }

      if(user.uid === this.user.uid) {
        user.actionDisabled = true;
      }
    });
    this.tableRows = users;
  }

}
