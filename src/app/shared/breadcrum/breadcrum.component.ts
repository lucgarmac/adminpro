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
  title: string;

  constructor(private router: Router) {
    this.subscription = this.getRouterData()
      .subscribe(data => {
        this.title = data['title'];
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
        map(e => (<ActivationEnd>e).snapshot.data)
      );
  }

}
