import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert-loader',
  templateUrl: './alert-loader.component.html'
})
export class AlertLoaderComponent {

  
  @Input() alertType: string = 'alert-info';
  @Input() icon: string = 'fa fa-refresh';
  @Input() iconSize: string = 'fa-2x';
  @Input() iconEffect: string = 'fa-spin';
  @Input() header: string = 'Header';
  @Input() content: string;
  
}
