import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { EntityNameEnum } from 'src/app/models/api/entity-name-enum';
import { SearchEntityRequest } from 'src/app/models/api/search';
import { TableColumn, TableColumnTypeEnum, TablePagination } from 'src/app/models/components/table-search';
import { DoctorExtended } from 'src/app/models/doctor-extended';
import { ListItem } from 'src/app/models/list-item';
import { ModalImageService } from 'src/app/services/components/modal-image.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { SearchesService } from 'src/app/services/searchs.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html'
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
              private searchesService: SearchesService,
              private modalImageService: ModalImageService,
              private router: Router) { }

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
    this.router.navigate(['/dashboard/doctors', doctor.uid]);
  }

  onEditImage(uid: string) {
    const doctorFound: DoctorExtended = this.tableRows.find(doctor => doctor.uid === uid);
    if (doctorFound) {
      this.modalImageService.openModal(EntityNameEnum.Doctors, uid, this.token, doctorFound.img);
    }
  }

  onCreateDoctor() {
    this.router.navigate(['/dashboard/doctors/new']);
  }

  searchData() {
    if (this.nameCriteria) {
      const request: SearchEntityRequest = {
        entity: EntityNameEnum.Doctors,
        name: this.nameCriteria
      };
      this.enableClientPagination = false;
      this.searchesService.getDataByEntityAndName(this.token, request)
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
