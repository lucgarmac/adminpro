import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TableColumn, TablePagination } from 'src/app/models/components/table-search';


@Component({
  selector: 'app-table-search',
  templateUrl: './table-search.component.html',
  styleUrls: ['./table-search.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableSearchComponent {

  private _pagination: TablePagination;
  private _originalRows: any[];
  
  tableColumns: TableColumn[];
  tableRows: any[];

  @Input() enablePagination: boolean = false;
  @Input() showActions: boolean = true;
  @Input() enableClientPagination: boolean = false;
  

  @Output() pageChange = new EventEmitter<number>();
  @Output() removeClick = new EventEmitter<any>();
  @Output() editClick = new EventEmitter<any>();

  maxOffsetAllowed: number;


  get pagination(): TablePagination {
    return this._pagination;
  }
  @Input()
  set pagination(value: TablePagination) {
    this._pagination = value;
    if (this._pagination.totalItems) {
      this.maxOffsetAllowed = this.pagination.totalItems / this.pagination.limit;
    }
  }

  @Input()
  set rows(value: any[]) {
    if (!value) {
      this.tableRows = [];
    }
    
    if(this.enableClientPagination) {
      this._originalRows = value;
      if(!this.pagination) {
        this.pagination = {offset: 0, limit: 10, totalItems: 0};
      }
      this.paginateTable();

    } else {
      this.tableRows = value;
    }

    
  }

  @Input()
  set columns(value: TableColumn[]) {
    this.tableColumns = value;
    setTimeout(() => {
      this.updateColumnsSize();
    }, 0);

  }


  constructor(private elementRef: ElementRef,
              private cd: ChangeDetectorRef) { }

  previousPage() {
    this.pagination.offset = this.pagination.offset > 0 ? this.pagination.offset - 1 : 0;
    if(this.enableClientPagination) {
      this.paginateTable();
    } else {
      this.pageChange.emit(this.pagination.offset);
    }
    
  }

  nextPage() {
    this.pagination.offset = this.pagination.offset <= this.maxOffsetAllowed ? this.pagination.offset + 1 : this.maxOffsetAllowed;
    if(this.enableClientPagination) {
      this.paginateTable();
    } else {
      this.pageChange.emit(this.pagination.offset);
    }
  }

  onRemoveRowClick(row: any) {
    this.removeClick.emit(row);
  }

  onEditRowClick(row: any) {
    this.editClick.emit(row);
  }

  trackByColumn(index: number, column: TableColumn): string {
    return column.id;
  }

  private updateColumnsSize() {
    this.tableColumns.forEach(column => {
      if (column.fixed) {
        this.elementRef.nativeElement.querySelector(`#${column.id}`).style.width = `${column.columnWidth}px`;
      }
    })
  }

  private paginateTable() {
    const start = (this.pagination.offset * this.pagination.limit);
    this.tableRows = this._originalRows.slice(start > 0 ? start : 0, start + this.pagination.limit);
    this.pagination = {
      offset: this.pagination.offset,
      limit: this.pagination.limit,
      totalItems: this._originalRows.length
    };
  }
}