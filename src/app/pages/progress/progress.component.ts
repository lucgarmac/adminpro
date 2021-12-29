import { DOCUMENT } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: [ './progress.component.css']
})
export class ProgressComponent {

  
  _progressBar1: number = 40;
  _progressBar2: number = 60;

  progressBar1Formatted: string;
  progressBar2Formatted: string;


  constructor() { 
    this.progressBar1Formatted = `${this.progressBar1}%`;
    this.progressBar2Formatted = `${this.progressBar2}%`;
  }

  set progressBar1(value: number) {
    this._progressBar1 = value;
    this.progressBar1Formatted = `${this.progressBar1}%`;
  }

  get progressBar1(): number {
    return this._progressBar1;
  }

  set progressBar2(value: number) {
    this._progressBar2 = value;
    this.progressBar2Formatted = `${this.progressBar2}%`;
  }

  get progressBar2(): number {
    return this._progressBar2;
  }

  
  
}
