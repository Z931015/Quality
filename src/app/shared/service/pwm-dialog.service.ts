import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PwmDialogService {
  private dialog$ = new BehaviorSubject<string>('');
  public errorMessage = new BehaviorSubject('');
  constructor() { }
  getDialogObserver(): Observable<string> {
    return this.dialog$.asObservable();
  }
  show() {
    this.dialog$.next('show');
  }
  reset(): void {
    this.dialog$.next('hide');
  }
}
