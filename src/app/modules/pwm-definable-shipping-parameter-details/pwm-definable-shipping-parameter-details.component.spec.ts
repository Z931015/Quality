import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PwmDefinableShippingParameterDetailsComponent } from './pwm-definable-shipping-parameter-details.component';

describe('PwmDefinableShippingParameterDetailsComponent', () => {
  let component: PwmDefinableShippingParameterDetailsComponent;
  let fixture: ComponentFixture<PwmDefinableShippingParameterDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PwmDefinableShippingParameterDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PwmDefinableShippingParameterDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
