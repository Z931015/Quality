import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PwmPalletDetailsComponent } from './pwm-pallet-details.component';

describe('PwmPalletDetailsComponent', () => {
  let component: PwmPalletDetailsComponent;
  let fixture: ComponentFixture<PwmPalletDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PwmPalletDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PwmPalletDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
