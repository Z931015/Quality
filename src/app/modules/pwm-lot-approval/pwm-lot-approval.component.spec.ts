import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PwmLotApprovalComponent } from './pwm-lot-approval.component';

describe('PwmLotApprovalComponent', () => {
  let component: PwmLotApprovalComponent;
  let fixture: ComponentFixture<PwmLotApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PwmLotApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PwmLotApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
