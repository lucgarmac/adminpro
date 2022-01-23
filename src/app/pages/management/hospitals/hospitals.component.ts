import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { EntityNameEnum } from 'src/app/models/api/entity-name-enum';
import { HospitalRequest } from 'src/app/models/api/hospital';
import { SearchEntityRequest } from 'src/app/models/api/search';
import { TableColumn, TableColumnTypeEnum, TablePagination } from 'src/app/models/components/table-search';
import { HospitalExtended } from 'src/app/models/hospital-extended';
import { ModalImageService } from 'src/app/services/components/modal-image.service';
import { HospitalService } from 'src/app/services/hospital.service';
import { SearchesService } from 'src/app/services/searchs.service';
import { UtilsService } from 'src/app/services/utils.service';
import Swal from 'sweetalert2';
import { EditHospitalModalComponent } from './actions/edit-hospital-modal/edit-hospital-modal.component';

@Component({
  selector: 'app-hospitals',
  templateUrl: './hospitals.component.html'
})
export class HospitalsComponent implements OnInit {

  private token: string;
  private _defaultPagination = {
    offset: 0,
    limit: 5
  };

  
  errorInSearch: boolean;
  showLoader: boolean;
  nameCriteria: string;
  entityNameEnum = EntityNameEnum;

  // new hospital
  formGroup: FormGroup;
  modalNewHospital: NgbModalRef;

  // configure table
  enableClientPagination: boolean = true;
  tableColumns: TableColumn[];
  originaltableRows: HospitalExtended[];
  tableRows: HospitalExtended[];
  pagination: TablePagination;

  @ViewChild('imgTemplate', { static: true }) imgTemplate: TemplateRef<any>;
  @ViewChild('newHospitalTemplate', { static: true }) newHospitalTemplate: TemplateRef<any>;

  get defaultPagination() {
    return this._defaultPagination;
  }

  constructor(private hospitalService: HospitalService,
              private searchesService: SearchesService,
              private modalService: NgbModal,
              private modalImageService: ModalImageService,
              private builder: FormBuilder,
              private utilsService: UtilsService) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token') || '';
    this.getTable();

    this.modalImageService.updateImageSuccess.subscribe(_ => {
      this.loadData();
    });

    this.loadData();
  }

  onRemoveHospital(hospital: HospitalExtended) {

    Swal.fire({
      title: 'Delete hospital',
      text: `Are you sure you want to delete the hospital '${hospital.name}'?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete'
    }).then((result) => {
      if (result.isConfirmed) {
        this.hospitalService.removeHospital(this.token, hospital.id)
          .subscribe({
            next: _ => {
              this.loadData();
              Swal.fire({
                title: 'Deleted hospital',
                text: 'The hospital has been deleted successfully.',
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

  onEditHospital(hospital: HospitalExtended) {
    const modalRef = this.modalService.open(EditHospitalModalComponent, {backdrop: 'static', keyboard: false});
    modalRef.componentInstance.hospitalToEdit = hospital;
    modalRef.componentInstance.token = this.token;
    modalRef.result.then(result => {
      if(result === 'success') {
        this.loadData();
      }
    });
  }

  onEditImage(id: string) {
    const hospitalFound: HospitalExtended = this.tableRows.find(hospital => hospital.id === id);
    if (hospitalFound) {
      this.modalImageService.openModal(EntityNameEnum.Hospitals, id, this.token, hospitalFound.img);
    }
  }

  onCreateHospital() {
    this.formGroup = this.builder.group({
      name: ['', [Validators.required, this.utilsService.nameValidator()]]
    });

    this.modalNewHospital = this.modalService.open(this.newHospitalTemplate, {backdrop: 'static', keyboard: false});
  }

  newHospital(formGroup: FormGroup) {
    if(formGroup.valid) {
      const request: HospitalRequest = {
        name: this.formGroup.get('name').value.trim()
      };
      this.hospitalService.createHospital(this.token, request)
        .subscribe({
          next: _ => {
            this.modalNewHospital.close();
            this.loadData();
            Swal.fire({
              title: 'Created hospital',
              text: 'The hospital has been created successfully.',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500
            });
          },
          error: err => Swal.fire({
            title: 'Create hospital',
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
        entity: EntityNameEnum.Hospitals,
        name: this.nameCriteria
      };
      this.enableClientPagination = false;
      this.searchesService.getDataByEntityAndName(this.token, request)
        .subscribe(response => {
          this.updateData(response.hospitals);
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
      }
    ];
    this.pagination = { limit: this.defaultPagination.limit, offset: this.defaultPagination.offset, totalItems: 0 };
  }


  private loadData() {
    this.errorInSearch = false;
    this.showLoader = true;

    this.hospitalService.getHospitals(this.token)
      .pipe(finalize(() => this.showLoader = false))
      .subscribe({
        next: response => {
          this.updateData(response.hospitals);
          this.originaltableRows = Array.from(this.tableRows);
        }, error: _ => this.errorInSearch = true

      });
  }

  private updateData(hospitals: HospitalExtended[]) {
    hospitals.forEach(hospital => {
      hospital.imgTemplate = this.imgTemplate;
    });
    this.tableRows = hospitals;
  }

}
