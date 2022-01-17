import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PwmSpinnerService {
  private runningCalls: string[] = [];
  private spinner$ = new BehaviorSubject<string>('');
  constructor() { }
  getSpinnerObserver(): Observable<string> {
    return this.spinner$.asObservable();
  }
  spin(guid: string): void {
    this.runningCalls.push(guid);
    this.spinner$.next('spin')
  }
  unSpin(guid: string): void {
    const index = this.runningCalls.indexOf(guid, 0);
    if (index > -1) {
      this.runningCalls.splice(index, 1);
    }
    if (this.runningCalls.length == 0)
      this.spinner$.next('unspin')
  }
  reset(): void {
    this.runningCalls = [];
    this.spinner$.next('unspin');
  }
}
