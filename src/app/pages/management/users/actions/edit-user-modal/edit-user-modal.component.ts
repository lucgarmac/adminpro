import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserExtended } from 'src/app/models/user-extended';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { User, UserRequest } from 'src/app/models/api/user';
import { FileRequest, FileUploadRequest } from 'src/app/models/api/file';
import { EntityNameEnum } from 'src/app/models/api/entity-name-enum';
import { FilesService } from 'src/app/services/files.service';

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.css']
})
export class EditUserModalComponent implements OnInit {

  formGroup: FormGroup;

  @Input() userToEdit: UserExtended;
  @Input() token: string;

  constructor(public modal: NgbActiveModal,
              private builder: FormBuilder,
              private userService: UserService) { }

  ngOnInit(): void {
    this.formGroup = this.builder.group({
      role: [this.userToEdit ? this.userToEdit.role : '', Validators.required]
    });

    
  }

  onUpdateUser() {
    this.updateRole();
  }

  private updateRole() {
    if (this.formGroup.valid) {
      const request: UserRequest = {
        name: this.userToEdit.email,
        email: this.userToEdit.email,
        role: this.formGroup.get('role').value
      };
      this.userService.updateUser(this.token, this.userToEdit.uid, request)
        .subscribe({
          next: _ => {
            Swal.fire({
              title: 'Update user',
              text: 'The user has been updated successfully.',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500
            });
            this.modal.close('success');
          },
          error: err => Swal.fire({
            title: 'Update user',
            text: err.error.msg,
            icon: 'error',
            showConfirmButton: false,
            timer: 1500
          })
        });
    }
  }

}

