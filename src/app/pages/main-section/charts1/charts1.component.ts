import { Component, OnInit } from '@angular/core';
import { ChartData, ChartType, ChartConfiguration } from 'chart.js';

@Component({
  templateUrl: './charts1.component.html',
  styles: [
  ]
})
export class Charts1Component {


  doughnutsValues = [
    {
      title: 'Sales', 
      labels: ['Download Sales', 'In-Store Sales', 'Mail-Order Sales' ],
      data: [350, 450, 100], 
      colors: ['#6857E6', '#009FEE', '#F02059']
    },
    {
      title: '',
      labels: ['Label 1', 'Label 2', 'Label 3' ],
      data: [100, 200, 300],
      colors: []
    },
    {
      title: 'Compras', 
      labels: ['Pan', 'Chocolate', 'Pizza' ],
      data: [10, 15, 40],
      colors: []
    },
    {
      title: 'Lenguajes', 
      labels: ['Java', '.NET', 'Angular' ],
      data: [30, 90, 132],
      colors: []
    }
  ];

}
