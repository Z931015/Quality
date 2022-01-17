import { TestBed } from '@angular/core/testing';

import { PwmSpinnerService } from './pwm-spinner.service';

describe('PwmSpinnerService', () => {
  let service: PwmSpinnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PwmSpinnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
