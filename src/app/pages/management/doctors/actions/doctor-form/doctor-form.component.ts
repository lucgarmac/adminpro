import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable, of, tap } from 'rxjs';
import { Doctor, DoctorRequest } from 'src/app/models/api/doctor';
import { EntityNameEnum } from 'src/app/models/api/entity-name-enum';
import { FileUploadRequest } from 'src/app/models/api/file';
import { Hospital } from 'src/app/models/api/hospital';
import { ImageFile } from 'src/app/models/components/image-file';
import { DoctorService } from 'src/app/services/doctor.service';
import { FilesService } from 'src/app/services/files.service';
import { HospitalService } from 'src/app/services/hospital.service';
import { UtilsService } from 'src/app/services/utils.service';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './doctor-form.component.html',
  styles: [`
    .upload-wrapper {
      display: block;
      width: 300px;
      position: relative;
    }
    
    #file {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
      cursor: pointer;
      opacity: 0;
    }
  `]
})
export class DoctorFormComponent implements OnInit {

 
  private doctorUid: string;
  private token: string;

  // image
  imgLoaded: ImageFile;
  entityNameEnum = EntityNameEnum;
  defaultImgUrl: string;
  hospitalImgUrl: string;
  firstLoad: boolean;
  errorMsg: string;

  //form fields
  formGroup: FormGroup;
  operation: string;
  hospitals: Hospital[];
  thereAreChanges: boolean = false;

  doctorToEdit: Doctor;

  @ViewChild('inputFile', {static: false}) inpuFileElement: ElementRef;
  

  constructor(private builder: FormBuilder,
              private doctorService: DoctorService,
              private hospitalService: HospitalService,
              private filesService: FilesService,
              private utilsService: UtilsService,
              private activatedRoute: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.firstLoad = true;
    this.token = localStorage.getItem('token') || '';
    this.getHospitals();
    this.doctorUid = this.activatedRoute.snapshot.params['uid'];
    this.operation = this.doctorUid ? 'Update' : 'New';
    this.formGroup = this.builder.group({
      name: ['', [Validators.required, this.utilsService.nameValidator()]],
      hospital: ['', Validators.required]
    });

    if(this.doctorUid) {
      this.doctorService.getDoctor(this.token, this.doctorUid)
        .subscribe(response => {
          this.doctorToEdit = response;
          if(this.doctorToEdit) {
            this.formGroup.get('name').setValue(this.doctorToEdit.name);
            this.defaultImgUrl = this.doctorToEdit.img;
            const hospitalToEditID = this.doctorToEdit.hospital.id ? this.doctorToEdit.hospital.id : this.doctorToEdit.hospital._id;
            const hospitalFound = this.hospitals.length ? this.hospitals.find(item => item.id === hospitalToEditID) : null;
            if(hospitalFound) {
              this.formGroup.get('hospital').setValue(hospitalFound.id);
            }
          }
        });
    }

    this.formGroup.get('hospital').valueChanges.subscribe(value => {
      if(this.firstLoad) {
        this.firstLoad = false;
      }
      const hospitalFound = this.hospitals.find(item => item.id === value);
      this.hospitalImgUrl = hospitalFound.img ? hospitalFound.img : 'no-image';
    });

    this.formGroup.valueChanges.subscribe(values => {
      if(this.doctorUid && this.doctorToEdit) {
        const hospitalID = this.doctorToEdit.hospital._id || this.doctorToEdit.hospital.id;
        this.thereAreChanges = this.doctorToEdit.name !== this.formGroup.get('name').value.trim() ||
          hospitalID !== this.formGroup.get('hospital').value;
      }
    });
  }

  loadImage(event: any) {
    const files = event.srcElement.files;
    this.errorMsg = '';
    if (files && files.length) {
      const tempFile = files[0];
      const fileExtensionsAllowed = ['png', 'jpeg', 'jpg', 'gif'];
      const tempFileExt = tempFile.name.substring(tempFile.name.lastIndexOf('.') + 1);

      if (fileExtensionsAllowed.includes(tempFileExt)) {
        const reader = new FileReader();
        reader.readAsDataURL(tempFile);
        reader.onload = () => {
          this.imgLoaded = {
            file: tempFile,
            path: reader.result,
            name: tempFile.name
          };  
        }

      } else {
        this.errorMsg = 'Invalid image!! Extensions admits: png, jpeg, jpg, gif';
      }
    } else {
      this.errorMsg = 'You must select a image';
    }
  }

  onSubmit() {
    if(this.formGroup.valid) {
      this.doctorUid ? this.updateDoctor() : this.createDoctor();
    }
  }

  onCancel() {
    this.router.navigate(['/dashboard/doctors']);
  }

  private getHospitals() {
    this.hospitalService.getHospitals(this.token)
      .subscribe(response => {
        this.hospitals = response.hospitals;
      });
  }

  private updateDoctor() {
    const {requestDoctor, requestImage} = this.createRequests();
    const obs = [
      this.thereAreChanges ? this.doctorService.updateDoctor(this.token,this.doctorUid, requestDoctor) : of(null),
      this.imgLoaded ? this.filesService.uploadImage(this.token, requestImage) : of(null)
    ];

    forkJoin(obs)
      .subscribe({
        next: _ => {
          Swal.fire({
            title: 'Update doctor',
            text: 'The doctor has been update successfully',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          });
          setTimeout(() => this.router.navigate(['/dashboard/doctors']), 0);
        },
        error: err => Swal.fire({
          title: 'Update doctor',
          text: err.error.msg,
          icon: 'error',
          showConfirmButton: true
        })
      });
  }

  private createDoctor() {
    const requestDoctor: DoctorRequest = {
      name: this.formGroup.get('name').value.trim(),
      hospital: this.formGroup.get('hospital').value
    };
    this.doctorService.createDoctor(this.token, requestDoctor)
      .pipe(tap(response => {
        let requestImage: FileUploadRequest = null;
        if(this.imgLoaded) {
          requestImage = {
            entity: EntityNameEnum.Doctors,
            id: response.newDoctor.uid,
            img: this.imgLoaded.file
          };
          this.filesService.uploadImage(this.token, requestImage).subscribe();
        }
        
      }))
      .subscribe({
        next: _ => {
          Swal.fire({
            title: 'Create doctor',
            text: 'The doctor has been create successfully',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          });
          setTimeout(() => this.router.navigate(['/dashboard/doctors']), 0);
        },
        error: err => Swal.fire({
          title: 'Create doctor',
          text: err.error.msg,
          icon: 'error',
          showConfirmButton: true
        })
      });
  }

  private createRequests() {
    const requestDoctor: DoctorRequest = {
      name: this.formGroup.get('name').value.trim(),
      hospital: this.formGroup.get('hospital').value
    };

    let requestImage: FileUploadRequest = null;
    if(this.imgLoaded) {
      requestImage = {
        entity: EntityNameEnum.Doctors,
        id: this.doctorUid,
        img: this.imgLoaded.file
      };
    }

    return {requestDoctor, requestImage};
  }

}
