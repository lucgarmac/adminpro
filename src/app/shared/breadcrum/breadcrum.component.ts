import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { filter, map, Subscription } from 'rxjs';

@Component({
  selector: 'app-breadcrum',
  templateUrl: './breadcrum.component.html',
  styles: [
  ]
})
export class BreadcrumComponent implements OnDestroy{

  private subscription: Subscription;
  parentTitle: string;
  title: string;

  constructor(private router: Router) {
    this.subscription = this.getRouterData()
      .subscribe(data => {
      
        this.parentTitle = data.hasOwnProperty('parent') ? data['parent']['title'] : null;
        this.title = data.hasOwnProperty('parent') ? data['current']['title'] : data['title'];
        document.title = this.title ? `AdminPro - ${this.title}` : 'AdminPro';
      });
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private getRouterData() {
    return this.router.events
      .pipe(
        filter(e => e instanceof ActivationEnd),
        filter(e => !(<ActivationEnd>e).snapshot.firstChild),
        map(e => 
          (<ActivationEnd>e).snapshot.parent.data 
          ? {parent: (<ActivationEnd>e).snapshot.parent.data, current: (<ActivationEnd>e).snapshot.data}
          : (<ActivationEnd>e).snapshot.data
        )
      );
  }

}
