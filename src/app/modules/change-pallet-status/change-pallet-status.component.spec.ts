import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePalletStatusComponent } from './change-pallet-status.component';

describe('ChangePalletStatusComponent', () => {
  let component: ChangePalletStatusComponent;
  let fixture: ComponentFixture<ChangePalletStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangePalletStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePalletStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
