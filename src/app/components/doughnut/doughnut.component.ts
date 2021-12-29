import { Component, Input, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-doughnut',
  templateUrl: './doughnut.component.html'
})
export class DoughnutComponent implements OnInit {

  @Input() doughnutTitle!: string;
  @Input() doughnutLabels!: string[];
  @Input() doughnutData!: number[] | number[][];
  @Input() doughnutColors!: string[] | string[][];


  doughnutChartData!: ChartConfiguration['data'];
  
  constructor() { }

  ngOnInit(): void {
    this.doughnutTitle = this.doughnutTitle ? this.doughnutTitle : 'No title';
    this.doughnutChartData = {
      datasets: this.getDataSets(),
      labels: this.doughnutLabels
    };
  }


  private getDataSets(): {data: number[], backgroundColor?: string[]}[] {
    const dataSets: {data: number[], backgroundColor?: string[]}[] = [];
    
    if(this.doughnutColors && this.doughnutColors.length && this.doughnutData.length !== this.doughnutColors.length) {
      throw Error('Data and colors must have same length!!');
    }

    this.setEntryType('data', this.doughnutData, dataSets);
    this.setEntryType('backgroundColor', this.doughnutColors, dataSets);

    return dataSets;
  }

  private setEntryType(type: 'backgroundColor' | 'data',
    data: (number[] | number[][]) | (string[] | string[][]),
    origin:{data: number[], backgroundColor?: string[]}[]) {

      if(data && data.length) {
        let dataSet: {data: number[], backgroundColor?: string[]};
      
        if(Array.isArray(data[0])) {
          data.forEach((item, idx) => {
            dataSet = {
              data: <number[]>(type === 'data' ? item 
              : origin && origin.length && idx < origin.length ? origin[idx].data : []),
              backgroundColor: <string[]>(type === 'backgroundColor' ? item 
                : origin && origin.length && idx < origin.length && !!origin[idx].backgroundColor 
                  ? origin[idx].backgroundColor : undefined)
            };
            
            origin && origin.length && idx <= origin.length
              ? origin[idx] = dataSet
              : origin.push(dataSet);
          });
        } else {
          dataSet = {
            data: <number[]>(type === 'data' ? data 
            : origin && origin.length ? origin[0].data : []),
            backgroundColor: <string[]>(type === 'backgroundColor' ? data 
              : origin && origin.length && !!origin[0].backgroundColor 
                ? origin[0].backgroundColor : null)
          };
          
          if(!dataSet.backgroundColor) {
            delete dataSet.backgroundColor;
          }
          origin && origin.length 
            ? origin[0] = dataSet
            : origin.push(dataSet);
        }
      }
  }

  

}
