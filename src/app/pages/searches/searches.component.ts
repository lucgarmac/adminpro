import { Component, forwardRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EntityNameEnum, EntityNameType } from 'src/app/models/api/entity-name-enum';
import { SearchEntityRequest } from 'src/app/models/api/search';
import { TableColumn, TableColumnTypeEnum, TablePagination } from 'src/app/models/components/table-search';
import { DoctorExtended } from 'src/app/models/doctor-extended';
import { HospitalExtended } from 'src/app/models/hospital-extended';
import { UserExtended } from 'src/app/models/user-extended';
import { SearchesService } from 'src/app/services/searchs.service';
import { UtilsService } from 'src/app/services/utils.service';

interface ViewEntity {
  entity: string;
  tableColumns: TableColumn[];
  tableRows: any[];
  pagination: TablePagination;
}

@Component({
  selector: 'app-searches',
  templateUrl: './searches.component.html',
  styles: [
  ]
})
export class SearchesComponent implements OnInit {

  private _defaultPagination: TablePagination;
  private token: string;

  tableColumns = [
    {
      id: 'imgTemplate',
      label: 'Avatar',
      type: TableColumnTypeEnum.Html,
      fixed: false
    },
    {
      id: 'name',
      label: 'Name',
      type: TableColumnTypeEnum.Data,
      fixed: false
    }
  ];

  viewEntities: ViewEntity[];
  
  @ViewChild('imgTemplate', { static: true }) imgTemplate: TemplateRef<any>;
  @ViewChild('nameTemplate', { static: true }) nameTemplate: TemplateRef<any>;

  get defaultPagination(): TablePagination {
    this._defaultPagination = {
      limit: 5,
      offset: 0,
      totalItems: 0
    };
    return this._defaultPagination;
  }

  constructor(private searchesService: SearchesService,
              private utilsService :UtilsService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token') || '';
    this.getTables();
    this.activatedRoute.params.subscribe(params => {
      if(!this.token) {
        this.token = localStorage.getItem('token') || '';
      }
      this.searchData(params['criteria']);
    });
  }
  private getTables() {
    this.viewEntities = [
      {
        entity: this.utilsService.capitalizeStr(EntityNameEnum.Users),
        tableColumns: this.tableColumns,
        tableRows: <UserExtended[]>[],
        pagination: this.defaultPagination
      },
      {
        entity: this.utilsService.capitalizeStr(EntityNameEnum.Hospitals),
        tableColumns: this.tableColumns,
        tableRows: <HospitalExtended[]>[],
        pagination: this.defaultPagination
      },
      {
        entity: this.utilsService.capitalizeStr(EntityNameEnum.Doctors),
        tableColumns: this.tableColumns,
        tableRows: <DoctorExtended[]>[],
        pagination: this.defaultPagination
      }
    ];

    // update to link name column for Doctors
    this.viewEntities[this.viewEntities.length -1].tableColumns[this.tableColumns.length -1].type = TableColumnTypeEnum.Html;
    this.viewEntities[this.viewEntities.length -1].tableColumns[this.tableColumns.length -1].id = 'nameTemplate';
  }

  private searchData(criteria: string) {
    const request: SearchEntityRequest = {
      name: criteria
    }
    this.searchesService.getDataEntitiesByName(this.token, request)
      .subscribe({
        next: response => {
          const respKeys = Object.keys(response);
          this.viewEntities.forEach(view => {
            const keyFound = respKeys.find(key => key.toLowerCase() === view.entity.toLowerCase());
            if(keyFound) {
              this.updateData(EntityNameEnum[<EntityNameType>view.entity], (<any>response)[keyFound]);
            }
          });
        },
        error: _ => this.viewEntities.forEach(view => view.tableRows = [])
      });
  }

  private updateData(entity: EntityNameEnum, rows: UserExtended[] | HospitalExtended[] | DoctorExtended[]) {
    rows.forEach(row => {
      row.imgTemplate = this.imgTemplate;
      (<any>row)['entity'] = entity;
      if(entity === EntityNameEnum.Doctors) {
        (<any>row)['nameTemplate'] = this.nameTemplate;
      }
      
    });
    const idx = this.viewEntities.findIndex(view => view.entity.toLowerCase() === entity.toLowerCase());
    if(idx !== -1) {
      this.viewEntities[idx].tableRows = rows;
    }
  }

}
