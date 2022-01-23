import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { DoctorRequest } from 'src/app/models/api/doctor';
import { EntityNameEnum } from 'src/app/models/api/entity-name-enum';
import { FileRequest } from 'src/app/models/api/file';
import { SearchEntityRequest } from 'src/app/models/api/search';
import { TableColumn, TableColumnTypeEnum, TablePagination } from 'src/app/models/components/table-search';
import { DoctorExtended } from 'src/app/models/doctor-extended';
import { ListItem } from 'src/app/models/list-item';
import { ModalImageService } from 'src/app/services/components/modal-image.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { FilesService } from 'src/app/services/files.service';
import { HospitalService } from 'src/app/services/hospital.service';
import { SearchsService } from 'src/app/services/searchs.service';
import { UtilsService } from 'src/app/services/utils.service';
import Swal from 'sweetalert2';
import { EditDoctorModalComponent } from './actions/edit-doctor-modal/edit-doctor-modal.component';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styles: [`
  .avatar {
      border-radius: 50%;
      width: 50px;
      height: 50px;
      background-size: cover;
      background-color: #869196;
      border: solid 1px #D1ECF1;
    }
  `]
})
export class DoctorsComponent implements OnInit {

  private token: string;
  private _defaultPagination = {
    offset: 0,
    limit: 5
  };

  errorInSearch: boolean;
  showLoader: boolean;
  nameCriteria: string;
  entityNameEnum = EntityNameEnum;

  // new doctor
  formGroup: FormGroup;
  modalNewDoctor: NgbModalRef;
  hospitals: ListItem[];

  // configure table
  enableClientPagination: boolean = true;
  tableColumns: TableColumn[];
  originaltableRows: DoctorExtended[];
  tableRows: DoctorExtended[];
  pagination: TablePagination;

  @ViewChild('imgTemplate', { static: true }) imgTemplate: TemplateRef<any>;
  @ViewChild('newDoctorTemplate', { static: true }) newDoctorTemplate: TemplateRef<any>;

  get defaultPagination() {
    return this._defaultPagination;
  }


  constructor(private doctorService: DoctorService,
              private searchsService: SearchsService,
              private modalService: NgbModal,
              private modalImageService: ModalImageService,
              private builder: FormBuilder,
              private utilsService: UtilsService,
              private hospitalService: HospitalService) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token') || '';
    this.getTable();

    this.modalImageService.updateImageSuccess.subscribe(_ => {
      this.loadData();
    });

    this.loadData();
  }

  onRemoveDoctor(doctor: DoctorExtended) {

    Swal.fire({
      title: 'Delete doctor',
      text: `Are you sure you want to delete the doctor '${doctor.name}'?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete'
    }).then((result) => {
      if (result.isConfirmed) {
        this.doctorService.removeDoctor(this.token, doctor.uid)
          .subscribe({
            next: _ => {
              this.loadData();
              Swal.fire({
                title: 'Deleted doctor',
                text: 'The doctor has been deleted successfully.',
                icon: 'success',
                showConfirmButton: false,
                timer: 1500
              });
            },
            error: err => Swal.fire({
              title: 'Delete hospital',
              text: err.error.msg,
              icon: 'error',
              showConfirmButton: true
            })
          });

      }
    })
  }

  onEditDoctor(doctor: DoctorExtended) {
    const modalRef = this.modalService.open(EditDoctorModalComponent, {backdrop: 'static', keyboard: false});
    modalRef.componentInstance.doctorToEdit = doctor;
    modalRef.componentInstance.token = this.token;
    modalRef.result.then(result => {
      if(result === 'success') {
        this.loadData();
      }
    });
  }

  onEditImage(uid: string) {
    const doctorFound: DoctorExtended = this.tableRows.find(doctor => doctor.uid === uid);
    if (doctorFound) {
      this.modalImageService.openModal(EntityNameEnum.Doctors, uid, this.token, doctorFound.img);
    }
  }

  onCreateDoctor() {
    this.formGroup = this.builder.group({
      name: ['', [Validators.required, this.utilsService.nameValidator()]],
      hospital: ['', Validators.required]
    });
    this.hospitalService.getHospitals(this.token)
      .subscribe(response => {
        this.hospitals = response && response.hospitals 
        ? response.hospitals.map( hospital => <ListItem>({id: hospital.id, label: hospital.name}))
        : [];
      });
    this.modalNewDoctor = this.modalService.open(this.newDoctorTemplate, {backdrop: 'static', keyboard: false});
  }

  newDoctor(formGroup: FormGroup) {
    if(formGroup.valid) {
      const request: DoctorRequest = {
        name: this.formGroup.get('name').value.trim(),
        hospital: this.formGroup.get('hospital').value

      };
      this.doctorService.createDoctor(this.token, request)
        .subscribe({
          next: _ => {
            this.modalNewDoctor.close();
            this.loadData();
            Swal.fire({
              title: 'Created doctor',
              text: 'The doctor has been created successfully.',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500
            });
          },
          error: err => Swal.fire({
            title: 'Create doctor',
            text: err.error.msg,
            icon: 'error',
            showConfirmButton: true
          })
        });
    }
  }

  searchData() {
    if (this.nameCriteria) {
      const request: SearchEntityRequest = {
        entity: EntityNameEnum.Doctors,
        name: this.nameCriteria
      };
      this.enableClientPagination = false;
      this.searchsService.getDataByEntityAndName(this.token, request)
        .subscribe(response => {
          this.updateData(response.doctors);
        });
    } else {
      this.cleanCriteria();
    }
  }

  cleanCriteria() {
    this.nameCriteria = '';
    this.enableClientPagination = true;
    this.tableRows = this.originaltableRows;
  }

  private getTable() {
    this.tableColumns = [
      {
        id: 'imgTemplate',
        label: 'Avatar',
        type: TableColumnTypeEnum.Html,
        fixed: true,
        columnWidth: 200
      },
      {
        id: 'name',
        label: 'Name',
        type: TableColumnTypeEnum.Data,
        fixed: false
      },
      {
        id: 'hospitalName',
        label: 'Hospital',
        type: TableColumnTypeEnum.Data,
        fixed: false
      }
    ];
    this.pagination = { limit: this.defaultPagination.limit, offset: this.defaultPagination.offset, totalItems: 0 };
  }


  private loadData() {
    this.errorInSearch = false;
    this.showLoader = true;

    this.doctorService.getDoctors(this.token)
      .pipe(finalize(() => this.showLoader = false))
      .subscribe({
        next: response => {
          this.updateData(response.doctors);
          this.originaltableRows = Array.from(this.tableRows);
        }, error: _ => this.errorInSearch = true

      });
  }

  private updateData(doctors: DoctorExtended[]) {
    doctors.forEach(doctor => {
      doctor.hospitalName = doctor.hospital ? doctor.hospital.name : '-';
      doctor.imgTemplate = this.imgTemplate;
    });
    this.tableRows = doctors;
  }

}
