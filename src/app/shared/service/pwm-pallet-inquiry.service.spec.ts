import { TestBed } from '@angular/core/testing';

import { PwmPalletInquiryService } from './pwm-pallet-inquiry.service';

describe('PwmPalletInquriyService', () => {
  let service: PwmPalletInquiryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PwmPalletInquiryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
