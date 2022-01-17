import { PwmSpinnerService } from './../../service/pwm-spinner.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'quality-assurance-pwm-spinner',
  templateUrl: './pwm-spinner.component.html',
  styleUrls: ['./pwm-spinner.component.css']
})
export class PwmSpinnerComponent implements OnInit {
  showSpinner = false;
  constructor(private spinnerService: PwmSpinnerService, private cdRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.initSpinner();
  }
  initSpinner() {
    this.spinnerService.getSpinnerObserver().subscribe((status) => {
      this.showSpinner = status === 'spin';
      this.cdRef.detectChanges();
    });
  }
}
