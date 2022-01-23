import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserExtended } from 'src/app/models/user-extended';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { UserRequest } from 'src/app/models/api/user';

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html'
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
            showConfirmButton: true
          })
        });
    }
  }

}

