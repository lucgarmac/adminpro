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
  private _columns: TableColumn[];
  private _rows: any[];
 
  @Input() enablePagination: boolean = false;
  @Input() showActions: boolean = true;

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
    if(this._pagination.totalItems) {
      this.maxOffsetAllowed = this.pagination.totalItems / this.pagination.limit;
    }
  }

  get rows(): any[] {
    return this._rows;
  }
  @Input()
  set rows(value: any[]) {
    if(!value) {
      this._rows = [];
    }

    this._rows = value;
  }

  get columns(): TableColumn[] {
    return this._columns;
  }
  @Input()
  set columns(value: TableColumn[]) {
    this._columns = value;
    setTimeout(() => {
      this.updateColumnsSize();
    }, 0);
    
  }


  constructor(private elementRef: ElementRef,
              private cd: ChangeDetectorRef) { }

  previousPage() {
    this.pagination.offset = this.pagination.offset > 0 ? this.pagination.offset-1 : 0;
    this.pageChange.emit(this.pagination.offset);
  }

  nextPage() {
    this.pagination.offset = this.pagination.offset <= this.maxOffsetAllowed ? this.pagination.offset+1 : this.maxOffsetAllowed;
    this.pageChange.emit(this.pagination.offset);
  }

  onRemoveRowClick(row: any) {
    this.removeClick.emit(row);
  }

  onEditRowClick(row: any) {
    this.editClick.emit(row);
  }

  trackByColumn(index:number, column: TableColumn): string {
    return column.id;
  }

  private updateColumnsSize() {
    this.columns.forEach(column => {
      if(column.fixed) {
        this.elementRef.nativeElement.querySelector(`#${column.id}`).style.width = `${column.columnWidth}px`;
      }
    })
  }
}