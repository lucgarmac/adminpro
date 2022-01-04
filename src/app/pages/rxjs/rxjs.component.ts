import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { filter, interval, map, Observable, retry, Subscription, take } from 'rxjs';


@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html'
})
export class RxjsComponent implements OnInit, OnDestroy {

  // Example 1
  private subscriptionExample1: Subscription[] = [];
  private intervalExample1: any;
  resultExample1: any[] = [];
  launchError: boolean = false;
  finishObs: boolean = false;


  // Example 2
  private subscriptionExample2: Subscription[] = [];
  private intervalExample2: any;
  resultExample2: any[] = [];
  retries: number = 0;
  @ViewChild('retriesInput') retriesInput: ElementRef;

  // Example 3
  private subscriptionExample3: Subscription[] = [];
  resultExample3: any[] = [];
  takeExample3: number = 5;
  pairs: boolean;
  @ViewChild('takeInput') takeInput: ElementRef;

  constructor(private cd: ChangeDetectorRef) {

  }
  ngOnInit(): void {
    this.launchExample1();
    this.launchExample2();
    this.launchExample3();

  }

  ngOnDestroy(): void {
    console.log('Destroy observables!');
    this.subscriptionExample1.forEach(sub => sub.unsubscribe());
    this.subscriptionExample2.forEach(sub => sub.unsubscribe());
    this.subscriptionExample3.forEach(sub => sub.unsubscribe());

  }

  onChangeRetries(data: number) {
    if (data === null || data < 1) {
      data = 1;
    }
    this.retries = data;
    this.retriesInput.nativeElement.value = this.retries;
  }

  retryObservable() {

    this.subscriptionExample2.forEach(sub => sub.unsubscribe());
    this.subscriptionExample2 = [];
    clearInterval(this.intervalExample2);
      

    if(this.retries !== null && this.retries > 0) {
      this.launchExample2(this.retries);
    }

  }

  onChangeTake(data: number) {
    if (data === null || data < 1) {
      data = 1;
    }
    this.takeExample3 = data;
    this.takeInput.nativeElement.value = this.takeExample3;
  }

  takeObservable() {

    this.subscriptionExample3.forEach(sub => sub.unsubscribe());
    this.subscriptionExample3 = [];
      

    if(this.takeExample3 !== null && this.takeExample3 > 0) {
      this.launchExample3();
    }

  }

  giveMePairs() {
    this.pairs = !this.pairs;
    this.resultExample3 = []
    this.launchExample3(this.pairs, 500);
  }

  private launchExample1() {
    this.subscriptionExample1.push(new Observable(subscriber => {
      let counter = 0;
      this.intervalExample1 = setInterval(() => {
        subscriber.next(++counter);

        if (this.launchError) {
          counter = 0;
          clearInterval(this.intervalExample1);
          subscriber.error(counter + ' no gusta!!');
        }
        if (this.finishObs) {
          clearInterval(this.intervalExample1);
          subscriber.complete();
        }
      }, 1000);
    })
      .subscribe({
        next: (val) => {
          console.log('Example1: value returned', val);
          this.resultExample1.push({ ishtml: false, data: 'value returned ' + val });
        },
        error: (err) => {
          console.error('Example1: An error has ocurred when get value', err)
          this.resultExample1.push({
            ishtml: true, data: `<div class="alert alert-danger" role="alert">
        An error has ocurred when get value: <strong>${err}</strong>
      </div>`})
        },
        complete: () => {
          console.info('Example1: Finish observable!!');
          this.resultExample1.push({
            ishtml: true, data: `<div class="alert alert-info" role="alert">
        Finish observable!!
      </div>`});
        }
      }));
  }

  private launchExample2(retries?: number) {
    const observable = this.getObservableExample2();
    this.subscriptionExample2.push(observable
      .pipe(retry(retries ? retries : undefined))
      .subscribe({
        next: (val) => {
          console.log('Example2: value returned', val);
          this.resultExample2.push({ ishtml: false, data: 'value returned ' + val });
        },
        error: (err) => {
          console.error('Example2: An error has ocurred when get value', err)
          this.resultExample2.push({
            ishtml: true, data: `<div class="alert alert-danger" role="alert">
        An error has ocurred when get value: <strong>${err}</strong>
      </div>`})
        },
        complete: () => {
          console.info('Example2: Finish observable!!');
          this.resultExample2.push({
            ishtml: true, data: `<div class="alert alert-info" role="alert">
        Finish observable!!
      </div>`});
        }
      }));
  }

  private getObservableExample2(): Observable<number> {
    let counter = 0;
    return new Observable<number>(subscriber => {
      this.intervalExample2 = setInterval(() => {
        subscriber.next(++counter);

        if (counter === 2) {
          clearInterval(this.intervalExample2);
          subscriber.error(counter + ' no gusta!!');
          counter = 0;
        }
        if (counter === 5) {
          clearInterval(this.intervalExample2);
          subscriber.complete();
        }
      }, 1000);
    })
  }

  private launchExample3(pairs: boolean = false, intervalMillis?: number) {
    this.subscriptionExample3.push(
      interval(intervalMillis ? intervalMillis : 1000)
      .pipe(
        map(counter => counter + 1),
        filter( value => !pairs || pairs && value%2 === 0),
        take(this.takeExample3)
      )
      .subscribe(val => {
        console.log('Example3: value returned', val);
        this.resultExample3.push({ ishtml: false, data: 'value returned ' + val });
        
        if(val === this.takeExample3) {
          console.info('Example3: Finish observable!!');
          this.resultExample3.push({
            ishtml: true, data: `<div class="alert alert-info" role="alert">
        Finish observable!!
      </div>`});
        }
      })
    );
    
  }

}
