import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PwmPalletExtendExpiryComponent } from './pwm-pallet-extend-expiry.component';

describe('PwmPalletExtendExpiryComponent', () => {
  let component: PwmPalletExtendExpiryComponent;
  let fixture: ComponentFixture<PwmPalletExtendExpiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PwmPalletExtendExpiryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PwmPalletExtendExpiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
