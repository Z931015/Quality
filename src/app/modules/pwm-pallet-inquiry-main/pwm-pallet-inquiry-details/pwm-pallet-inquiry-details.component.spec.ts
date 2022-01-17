import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PwmPalletInquiryDetailsComponent } from './pwm-pallet-inquiry-details.component';

describe('PwmPalletInquiryDetailsComponent', () => {
  let component: PwmPalletInquiryDetailsComponent;
  let fixture: ComponentFixture<PwmPalletInquiryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PwmPalletInquiryDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PwmPalletInquiryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
