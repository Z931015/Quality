import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PwmMaterialDetailsComponent } from './pwm-material-details.component';

describe('PwmMaterialDetailsComponent', () => {
  let component: PwmMaterialDetailsComponent;
  let fixture: ComponentFixture<PwmMaterialDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PwmMaterialDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PwmMaterialDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
