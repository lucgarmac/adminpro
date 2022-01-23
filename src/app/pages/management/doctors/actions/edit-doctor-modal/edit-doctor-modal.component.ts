import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DoctorRequest } from 'src/app/models/api/doctor';
import { DoctorExtended } from 'src/app/models/doctor-extended';
import { ListItem } from 'src/app/models/list-item';
import { DoctorService } from 'src/app/services/doctor.service';
import { HospitalService } from 'src/app/services/hospital.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-doctor-modal',
  templateUrl: './edit-doctor-modal.component.html',
  styles: [
  ]
})
export class EditDoctorModalComponent implements OnInit {

  formGroup: FormGroup;

  hospitals: ListItem[];

  @Input() doctorToEdit: DoctorExtended;
  @Input() token: string;

  constructor(public modal: NgbActiveModal,
              private builder: FormBuilder,
              private doctorService: DoctorService,
              private hospitalService: HospitalService) { }

  ngOnInit(): void {
    this.formGroup = this.builder.group({
      name: [this.doctorToEdit ? this.doctorToEdit.name : '', [Validators.required, this.nameValidator()]],
      hospital: ['', Validators.required]
    });

    this.hospitalService.getHospitals(this.token)
      .subscribe(response => {
        this.hospitals = response && response.hospitals 
        ? response.hospitals.map( hospital => <ListItem>({id: hospital.id, label: hospital.name}))
        : [];

        if(this.hospitals.length && this.doctorToEdit && this.doctorToEdit.hospital) {
          const hospitalToEditID = this.doctorToEdit.hospital.id ? this.doctorToEdit.hospital.id : this.doctorToEdit.hospital._id;
          const hospitalFound = this.hospitals.find(item => item.id === hospitalToEditID);
          if(hospitalFound) {
            this.formGroup.get('hospital').setValue(hospitalFound.id);
          }
        }
        
      });
  }

  onUpdateDoctor() {
    if (this.formGroup.valid) {
      const request: DoctorRequest = {
        name: this.formGroup.get('name').value.trim(),
        hospital: this.formGroup.get('hospital').value
      };
      this.doctorService.updateDoctor(this.token, this.doctorToEdit.uid, request)
        .subscribe({
          next: _ => {
            Swal.fire({
              title: 'Update doctor',
              text: 'The doctor has been updated successfully.',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500
            });
            this.modal.close('success');
          },
          error: err => Swal.fire({
            title: 'Update doctor',
            text: err.error.msg,
            icon: 'error',
            showConfirmButton: true
          })
        });
    }
  }

  private nameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value && control.value.length && control.value.trim().length ? null : {invalidName : true};
    };
  }
}
