import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PwmPalletInquiryMainComponent } from './pwm-pallet-inquiry-main.component';

describe('PwmPalletInquiryMainComponent', () => {
  let component: PwmPalletInquiryMainComponent;
  let fixture: ComponentFixture<PwmPalletInquiryMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PwmPalletInquiryMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PwmPalletInquiryMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
