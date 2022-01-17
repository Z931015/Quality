import { TestBed } from '@angular/core/testing';

import { PwmDialogService } from './pwm-dialog.service';

describe('PwmDialogService', () => {
  let service: PwmDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PwmDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
