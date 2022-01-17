import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PwmDialogComponent } from './pwm-dialog.component';

describe('PwmDialogComponent', () => {
  let component: PwmDialogComponent;
  let fixture: ComponentFixture<PwmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PwmDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PwmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
