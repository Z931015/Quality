import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PwmSpinnerComponent } from './pwm-spinner.component';

describe('PwmSpinnerComponent', () => {
  let component: PwmSpinnerComponent;
  let fixture: ComponentFixture<PwmSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PwmSpinnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PwmSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
