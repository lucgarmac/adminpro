import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HospitalRequest } from 'src/app/models/api/hospital';
import { HospitalExtended } from 'src/app/models/hospital-extended';
import { HospitalService } from 'src/app/services/hospital.service';
import { UtilsService } from 'src/app/services/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-hospital-modal',
  templateUrl: './edit-hospital-modal.component.html',
  styles: [
  ]
})
export class EditHospitalModalComponent implements OnInit {

  formGroup: FormGroup;

  @Input() hospitalToEdit: HospitalExtended;
  @Input() token: string;

  constructor(public modal: NgbActiveModal,
              private builder: FormBuilder,
              private hospitalService: HospitalService,
              private utilsService: UtilsService) { }

  ngOnInit(): void {
    this.formGroup = this.builder.group({
      name: [this.hospitalToEdit ? this.hospitalToEdit.name : '', [Validators.required, this.utilsService.nameValidator()]]
    });
  }

  onUpdateHospital() {
    if (this.formGroup.valid) {
      const request: HospitalRequest = {
        name: this.formGroup.get('name').value.trim()
      };
      this.hospitalService.updateHospital(this.token, this.hospitalToEdit.id, request)
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

  /* private nameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value && control.value.length && control.value.trim().length ? null : {invalidName : true};
    };
  } */

}
