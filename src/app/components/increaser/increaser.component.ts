import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-increaser',
  templateUrl: './increaser.component.html',
  styles: [
  ]
})
export class IncreaserComponent {

  private _progress: number;

  @Input() btnClass: string = 'btn-primary';
  @Output() progressFormatted = new EventEmitter<number>();

  constructor() { }

   get progress () {
     return this._progress;
   }

  @Input()
  set progress(value: number) {
    if(value > 100) {
      this._progress = 100;
    } else if(value < 0 || !value) {
      this._progress = 0;
    } else {
      this._progress = value;
    }

    this.progressFormatted.emit(this.progress);
  }

  valueChange(value: number) {
    if (this.progress + value < 0) {
      this.progress = 0;
    } else if(this.progress + value > 100) {
      this.progress = 100;
    } else {
      this.progress = this.progress + value;
    }
    
    this.progressFormatted.emit(this.progress);
  }

}
