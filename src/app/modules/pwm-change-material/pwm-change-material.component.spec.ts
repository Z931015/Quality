import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PwmChangeMaterialComponent } from './pwm-change-material.component';

describe('PwmChangeMaterialComponent', () => {
  let component: PwmChangeMaterialComponent;
  let fixture: ComponentFixture<PwmChangeMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PwmChangeMaterialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PwmChangeMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
